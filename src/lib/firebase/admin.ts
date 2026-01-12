import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    return adminApp;
  }

  // Firebase Admin SDK 초기화
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  return adminApp;
}

export function getAdminAuth(): Auth {
  if (adminAuth) return adminAuth;
  adminAuth = getAuth(getAdminApp());
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  adminDb = getFirestore(getAdminApp());
  return adminDb;
}

// 이메일 인증 코드 저장 및 검증
export interface VerificationCode {
  code: string;
  email: string;
  expiresAt: Date;
  verified: boolean;
}

export async function saveVerificationCode(
  email: string,
  code: string
): Promise<void> {
  const db = getAdminDb();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5분 후 만료

  await db.collection('verificationCodes').doc(email).set({
    code,
    email,
    expiresAt,
    verified: false,
    createdAt: new Date(),
  });
}

export async function verifyCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  const doc = await db.collection('verificationCodes').doc(email).get();

  if (!doc.exists) {
    return { success: false, error: 'auth/invalid-verification-code' };
  }

  const data = doc.data() as VerificationCode;

  if (data.code !== code) {
    return { success: false, error: 'auth/invalid-verification-code' };
  }

  if (new Date() > new Date(data.expiresAt)) {
    return { success: false, error: 'auth/code-expired' };
  }

  // 인증 완료 표시
  await db.collection('verificationCodes').doc(email).update({
    verified: true,
  });

  return { success: true };
}

export async function isEmailVerified(email: string): Promise<boolean> {
  const db = getAdminDb();
  const doc = await db.collection('verificationCodes').doc(email).get();

  if (!doc.exists) return false;

  const data = doc.data() as VerificationCode;
  return data.verified && new Date() <= new Date(data.expiresAt);
}

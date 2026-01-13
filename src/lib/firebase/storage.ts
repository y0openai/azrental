import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { MAX_IMAGE_SIZE_BYTES } from '@/types/uncle';

// Firebase Storage 인스턴스 가져오기
function getStorageInstance() {
  const app = getApp();
  return getStorage(app);
}

// 허용되는 이미지 MIME 타입
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// 이미지 파일 검증
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 타입 검증
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'JPG 또는 PNG 파일만 업로드 가능합니다.',
    };
  }

  // 파일 크기 검증
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `이미지 크기가 ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB를 초과합니다.`,
    };
  }

  return { valid: true };
}

// 파일 업로드 옵션
interface UploadOptions {
  contentType?: string;
  customMetadata?: Record<string, string>;
}

// 파일 업로드
export async function uploadFile(
  path: string,
  file: File,
  options?: UploadOptions
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path);

    const metadata = {
      contentType: options?.contentType || file.type,
      customMetadata: options?.customMetadata,
    };

    await uploadBytes(storageRef, file, metadata);
    const url = await getDownloadURL(storageRef);

    return { success: true, url };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 업로드에 실패했습니다.',
    };
  }
}

// 파일 삭제
export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('File delete error:', error);
    // 파일이 존재하지 않는 경우는 성공으로 처리
    if (error instanceof Error && error.message.includes('object-not-found')) {
      return { success: true };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 삭제에 실패했습니다.',
    };
  }
}

// 다운로드 URL 가져오기
export async function getFileDownloadUrl(
  path: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path);

    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error) {
    console.error('Get download URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'URL을 가져오는데 실패했습니다.',
    };
  }
}

// 이미지 업로드 (검증 포함)
export async function uploadImage(
  path: string,
  file: File,
  options?: UploadOptions
): Promise<{ success: boolean; url?: string; error?: string }> {
  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // 업로드 실행
  return uploadFile(path, file, options);
}

// 프로필 이미지 경로 생성
export function getProfileImagePath(uid: string, index: number): string {
  return `uncles/${uid}/profile/image_${index}_${Date.now()}`;
}

// 신분증 이미지 경로 생성 (제한된 경로)
export function getIdCardImagePath(uid: string): string {
  return `uncles/${uid}/id-card/id_${Date.now()}`;
}

// 프로필 이미지 업로드
export async function uploadProfileImage(
  uid: string,
  file: File,
  index: number
): Promise<{ success: boolean; url?: string; error?: string }> {
  const path = getProfileImagePath(uid, index);
  return uploadImage(path, file, {
    customMetadata: {
      uploadedBy: uid,
      type: 'profile',
      index: index.toString(),
    },
  });
}

// 신분증 이미지 업로드
export async function uploadIdCardImage(
  uid: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const path = getIdCardImagePath(uid);
  return uploadImage(path, file, {
    customMetadata: {
      uploadedBy: uid,
      type: 'id-card',
      sensitive: 'true',
    },
  });
}

// 프로필 이미지 삭제 (URL에서 경로 추출)
export async function deleteProfileImageByUrl(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase Storage URL에서 경로 추출
    const pathMatch = url.match(/o\/(.+?)\?/);
    if (!pathMatch) {
      return { success: false, error: '유효하지 않은 이미지 URL입니다.' };
    }

    const path = decodeURIComponent(pathMatch[1]);
    return deleteFile(path);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '이미지 삭제에 실패했습니다.',
    };
  }
}

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUncleAuth } from '@/hooks/useUncleAuth';
import {
  UncleSignupData,
  UncleStatus,
  ApplicationStatusData,
} from '@/types/uncle';
import { ActionResult } from '@/app/actions/uncle-auth';
import { UncleUser } from '@/services/uncleAuthService';

interface UncleAuthContextType {
  // State
  uncle: UncleUser | null;
  loading: boolean;
  error: string | null;
  applicationStatus: UncleStatus | null;
  isAuthenticated: boolean;
  isApproved: boolean;

  // Actions
  saveDraft: (
    email: string,
    step: number,
    data: Partial<UncleSignupData>
  ) => Promise<ActionResult<{ applicationId: string }>>;
  loadDraft: (
    email: string
  ) => Promise<ActionResult<{ draftData: Partial<UncleSignupData>; currentStep: number }>>;
  apply: (data: UncleSignupData) => Promise<ActionResult<{ uid: string }>>;
  uploadProfileImage: (
    uid: string,
    file: File,
    index: number
  ) => Promise<ActionResult<{ url: string }>>;
  uploadIdCard: (uid: string, file: File) => Promise<ActionResult<{ url: string }>>;
  removeProfileImage: (uid: string, index: number, imageUrl: string) => Promise<ActionResult>;
  setMainImage: (uid: string, index: number) => Promise<ActionResult>;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<ActionResult<{ user: UncleUser }>>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  checkStatus: (email: string) => Promise<ActionResult<ApplicationStatusData>>;
  sendPasswordReset: (email: string) => Promise<ActionResult>;
  setError: (error: string | null) => void;
}

const UncleAuthContext = createContext<UncleAuthContextType | undefined>(undefined);

interface UncleAuthProviderProps {
  children: ReactNode;
}

export function UncleAuthProvider({ children }: UncleAuthProviderProps) {
  const uncleAuth = useUncleAuth();

  return (
    <UncleAuthContext.Provider value={uncleAuth}>
      {children}
    </UncleAuthContext.Provider>
  );
}

export function useUncleAuthContext() {
  const context = useContext(UncleAuthContext);
  if (context === undefined) {
    throw new Error('useUncleAuthContext must be used within an UncleAuthProvider');
  }
  return context;
}

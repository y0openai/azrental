'use client';

import React from 'react';
import Link from 'next/link';
import { UncleAuthProvider } from '@/contexts/UncleAuthContext';
import { UncleLoginForm } from '@/components/uncle-auth/UncleLoginForm';
import { ArrowLeft } from 'lucide-react';

export default function UncleLoginPage() {
  return (
    <UncleAuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                홈으로
              </Link>
              <div className="text-center">
                <h1 className="text-xl font-bold text-red-600">
                  아조씨렌탈
                </h1>
              </div>
              <div className="w-16" /> {/* Spacer for centering */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <UncleLoginForm />
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-gray-500">
          <p>© 2024 아조씨렌탈. All rights reserved.</p>
        </footer>
      </div>
    </UncleAuthProvider>
  );
}

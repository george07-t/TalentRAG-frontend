import React from 'react';
import { useRouter } from 'next/router';
import { AuthPanel } from '../components/AuthPanel';
import { setTokens } from '../lib/auth';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-[900px] mx-auto py-12 px-4">
        <AuthPanel
          initialMode="register"
          onAuth={(tokens) => {
            setTokens(tokens);
            router.replace('/upload');
          }}
        />
      </div>
    </main>
  );
}

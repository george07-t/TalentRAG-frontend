import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UploadForm } from '../components/UploadForm';
import { clearTokens, getAccessToken, getRefreshToken } from '../lib/auth';

export default function UploadPage() {
  const router = useRouter();
  const [access, setAccess] = useState<string | null>(null);

  useEffect(() => {
    const hasAnyToken = !!getAccessToken() || !!getRefreshToken();
    if (!hasAnyToken) {
      router.replace('/login');
      return;
    }
    setAccess(getAccessToken());
  }, []);

  const logout = () => {
    clearTokens();
    router.replace('/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-[1800px] mx-auto py-8 space-y-8 px-4">
        <header className="text-center space-y-4 py-6 animate-fadeIn relative">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
              <div className="text-left">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                  TalentRAG
                </h1>
                <p className="text-sm text-gray-600 font-medium">Upload Documents</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="absolute right-4 top-8 px-4 py-2 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 border border-white/50"
            >
              Logout
            </button>
          </div>
        </header>

        <UploadForm
          onUploaded={(sessionId) => {
            router.push(`/session/${sessionId}`);
          }}
          token={access}
          onAuthFailure={() => router.replace('/login')}
        />
      </div>
    </main>
  );
}

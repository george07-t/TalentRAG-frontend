import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MatchAnalysis } from '../../components/MatchAnalysis';
import { ChatInterface } from '../../components/ChatInterface';
import { apiFetch, getApiBase } from '../../lib/api';
import { clearTokens, getAccessToken, getRefreshToken } from '../../lib/auth';

export default function SessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [analysis, setAnalysis] = useState<any>(null);
  const [access, setAccess] = useState<string | null>(null);
  const API = getApiBase();

  useEffect(() => {
    const hasAnyToken = !!getAccessToken() || !!getRefreshToken();
    if (!hasAnyToken) {
      router.replace('/login');
      return;
    }
    setAccess(getAccessToken());
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!sessionId || typeof sessionId !== 'string') return;
      const res = await apiFetch(`/session/${sessionId}/analysis/`, {
        apiBase: API,
        onAuthFailure: () => router.replace('/login'),
      });
      if (!res.ok) {
        if (res.status === 401) return;
        return;
      }
      const data = await res.json();
      setAnalysis(data);
    };
    load();
  }, [sessionId]);

  const logout = () => {
    clearTokens();
    router.replace('/login');
  };

  if (!sessionId || typeof sessionId !== 'string') {
    return null;
  }

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
                <p className="text-sm text-gray-600 font-medium">Analysis & Chat</p>
              </div>
            </div>
            <div className="absolute right-4 top-8 flex gap-2">
              <button
                onClick={() => router.push('/upload')}
                className="px-4 py-2 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all border border-white/50"
              >
                New Upload
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all border border-white/50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[55%_45%] gap-6">
          <MatchAnalysis analysis={analysis} />
          <ChatInterface sessionId={sessionId} />
        </div>
      </div>
    </main>
  );
}

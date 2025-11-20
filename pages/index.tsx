import React, { useState, useEffect } from 'react';
import { UploadForm } from '../components/UploadForm';
import { MatchAnalysis } from '../components/MatchAnalysis';
import { ChatInterface } from '../components/ChatInterface';
import { AuthPanel } from '../components/AuthPanel';

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('talentrag_token');
    if (stored) setToken(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('talentrag_token');
    setToken(null);
    setSessionId(null);
    setAnalysis(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-[1800px] mx-auto py-8 space-y-8 px-4">
        <header className="text-center space-y-4 py-6 animate-fadeIn">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
              <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div className="text-left">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                  TalentRAG
                </h1>
                <p className="text-sm text-gray-600 font-medium">AI-Powered Resume Screening</p>
              </div>
            </div>
            {token && (
              <button
                onClick={handleLogout}
                className="absolute right-4 top-8 px-4 py-2 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 border border-white/50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Developed by <span className="font-semibold text-indigo-600">George Tonmoy Roy</span>
          </p>
        </header>
        {!token && <AuthPanel onAuth={(t) => setToken(t)} />}
        {token && !sessionId && <UploadForm token={token} onUploaded={(id, a) => { setSessionId(id); setAnalysis(a); }} />}
        {token && sessionId && (
          <div className="grid lg:grid-cols-[55%_45%] gap-6">
            <MatchAnalysis analysis={analysis} />
            <ChatInterface sessionId={sessionId} token={token} />
          </div>
        )}
        {token && sessionId && (
          <div className="flex justify-center pt-4 animate-fadeIn">
            <button 
              onClick={() => { setSessionId(null); setAnalysis(null); }}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 border border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Analyze New Resume
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

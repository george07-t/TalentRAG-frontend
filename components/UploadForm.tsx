import React, { useState } from 'react';

interface Props { 
  onUploaded: (sessionId: string, analysis: any) => void;
  token: string | null;
}

export const UploadForm: React.FC<Props> = ({ onUploaded, token }) => {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coldStarting, setColdStarting] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

  const submit = async () => {
    if (!resume || !jd) return;
    setLoading(true);
    setError(null);
    setColdStarting(false);
    
    try {
      const fd = new FormData();
      fd.append('resume', resume);
      fd.append('job_description', jd);
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Show cold start message after 5 seconds
      const coldStartTimer = setTimeout(() => {
        setColdStarting(true);
      }, 5000);
      
      // Extended timeout for cold start (90 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      
      const res = await fetch(`${API}/upload/`, { 
        method: 'POST', 
        body: fd, 
        headers,
        signal: controller.signal 
      });
      
      clearTimeout(coldStartTimer);
      clearTimeout(timeoutId);
      setColdStarting(false);
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Upload failed' }));
        setError(errData.error || `Error: ${res.status}`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLoading(false);
      if (data.session) {
        onUploaded(data.session, data.analysis);
      }
    } catch (err: any) {
      setColdStarting(false);
      if (err.name === 'AbortError') {
        setError('Request timeout. Backend may be starting up. Please try again in a moment.');
      } else {
        setError(err.message || 'Network error');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 border border-indigo-100 max-w-2xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Upload Documents</h2>
      </div>
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slideIn">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      {coldStarting && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg animate-slideIn">
          <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-sm">
            <p className="font-semibold">Waking up backend server...</p>
            <p className="text-xs text-blue-600">First request may take 50-60 seconds (free tier cold start)</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume (PDF/TXT)
          </label>
          <div className="relative">
            <input 
              type="file" 
              onChange={e => setResume(e.target.files?.[0] || null)}
              className="hidden"
              id="resume-upload"
              accept=".pdf,.txt"
            />
            <label 
              htmlFor="resume-upload"
              className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer group-hover:scale-105 transform"
            >
              {resume ? (
                <div className="flex items-center gap-2 text-green-600 animate-slideIn">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{resume.name}</span>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click or drag resume file here</p>
                </div>
              )}
            </label>
          </div>
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Job Description (PDF/TXT)
          </label>
          <div className="relative">
            <input 
              type="file" 
              onChange={e => setJd(e.target.files?.[0] || null)}
              className="hidden"
              id="jd-upload"
              accept=".pdf,.txt"
            />
            <label 
              htmlFor="jd-upload"
              className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer group-hover:scale-105 transform"
            >
              {jd ? (
                <div className="flex items-center gap-2 text-green-600 animate-slideIn">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{jd.name}</span>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click or drag job description here</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
      <button 
        disabled={loading || !resume || !jd} 
        onClick={submit} 
        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing with AI...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Analyze Resume</span>
          </>
        )}
      </button>
    </div>
  );
};

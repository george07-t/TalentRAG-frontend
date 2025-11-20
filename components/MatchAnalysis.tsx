import React, { useEffect, useState } from 'react';

export const MatchAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (analysis?.match_score) {
      let start = 0;
      const end = analysis.match_score;
      const duration = 1500;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedScore(end);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [analysis]);

  if (!analysis) return null;
  
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-indigo-100 animate-fadeIn">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Match Analysis</h2>
      </div>
      
      <div className="flex justify-center py-4">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle cx="96" cy="96" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
            <circle 
              cx="96" cy="96" r="70" 
              stroke="url(#gradient)" 
              strokeWidth="12" 
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
              {animatedScore}%
            </div>
            <div className="text-sm text-gray-500 font-medium">Match Score</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200 transform transition-all hover:scale-105 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-lg text-green-800">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-base text-green-700 animate-slideIn" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-green-500 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-lg border border-red-200 transform transition-all hover:scale-105 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-lg text-red-800">Gaps</h3>
          </div>
          <ul className="space-y-2">
            {analysis.gaps.map((g: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-base text-red-700 animate-slideIn" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-red-500 mt-0.5">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {analysis.insights && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="font-bold text-lg text-blue-800">Key Insights</h3>
          </div>
          <p className="text-base text-blue-800 leading-relaxed whitespace-pre-wrap">
            {analysis.insights}
          </p>
        </div>
      )}
    </div>
  );
};

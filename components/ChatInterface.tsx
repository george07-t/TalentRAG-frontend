import React, { useState, useEffect } from 'react';

interface ChatMessage { id?: string; role: string; question?: string; answer?: string; sources?: Source[]; }
interface Source { chunk_index: number; score: number; preview: string; }

export const ChatInterface: React.FC<{ sessionId: string; token: string | null }> = ({ sessionId, token }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const load = async () => {
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API}/session/${sessionId}/chat/`, { headers });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((d: any) => ({ role: d.role, question: d.question, answer: d.answer }));
        setMessages(mapped);
      }
    };
    load();
  }, [sessionId]);

  const ask = async () => {
    if (!input) return;
    const question = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', question }]);
    setLoading(true);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API}/session/${sessionId}/chat/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', answer: data.answer, sources: data.sources }]);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-indigo-100 animate-fadeIn">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">AI Assistant</h2>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
        {messages.length === 0 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 text-sm font-medium mb-2">Ask questions about the candidate</p>
              <p className="text-gray-400 text-xs">Try these example questions:</p>
            </div>
            <div className="space-y-2">
              {[
                "Does this candidate have a degree from a state university?",
                "Can they handle backend architecture?",
                "What is their experience with PostgreSQL?",
                "What programming languages does the candidate know?",
                "Does the candidate have experience with cloud platforms?"
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-lg text-sm text-gray-700 transition-all hover:shadow-md hover:scale-[1.02] flex items-start gap-3 group"
                >
                  <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex-1">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="animate-slideIn">
            {m.role === 'user' ? (
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl rounded-tl-none p-4 border border-indigo-200 shadow-sm">
                  <p className="text-sm text-gray-800">{m.question}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl rounded-tl-none p-4 border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-800 leading-relaxed">{m.answer}</p>
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <details className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                      <summary className="cursor-pointer font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Sources ({m.sources.length})
                      </summary>
                      <ul className="mt-3 space-y-2">
                        {m.sources.map((s, si) => (
                          <li key={si} className="bg-white rounded p-2 border-l-4 border-indigo-400 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                              <span className="font-medium">📄 Chunk {s.chunk_index}</span>
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Score {s.score}</span>
                            </div>
                            <div className="text-xs text-gray-700 italic line-clamp-2">{s.preview}</div>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={ask} className="flex gap-2 pt-4 border-t border-gray-200">
        <input 
          className="flex-1 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-3 rounded-xl transition-all outline-none" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Ask anything about this candidate..." 
        />
        <button 
          type="submit"
          onClick={ask} 
          disabled={!input.trim()}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send
        </button>
      </form>
    </div>
  );
};

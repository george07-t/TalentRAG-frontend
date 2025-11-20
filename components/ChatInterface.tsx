import React, { useState, useEffect } from 'react';

interface ChatMessage { id?: string; role: string; question?: string; answer?: string; }

export const ChatInterface: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/session/${sessionId}/chat/`);
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
    const res = await fetch(`${API}/session/${sessionId}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setLoading(false);
    setMessages(prev => [...prev, { role: 'assistant', answer: data.answer }]);
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Ask Questions About This Candidate</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            {m.role === 'user' ? (
              <div><span className="font-semibold">You:</span> {m.question}</div>
            ) : (
              <div><span className="font-semibold">AI:</span> {m.answer}</div>
            )}
          </div>
        ))}
        {loading && <div className="italic text-gray-500">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border px-2 py-1 rounded" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question..." />
        <button onClick={ask} className="px-4 py-2 bg-green-600 text-white rounded">Ask</button>
      </div>
    </div>
  );
};

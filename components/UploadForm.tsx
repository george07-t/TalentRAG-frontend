import React, { useState } from 'react';

interface Props { onUploaded: (sessionId: string, analysis: any) => void; }

export const UploadForm: React.FC<Props> = ({ onUploaded }) => {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

  const submit = async () => {
    if (!resume || !jd) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('resume', resume);
    fd.append('job_description', jd);
    const res = await fetch(`${API}/upload/`, { method: 'POST', body: fd });
    const data = await res.json();
    setLoading(false);
    if (data.session) {
      onUploaded(data.session, data.analysis);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Upload Resume & Job Description</h2>
      <div className="space-y-2">
        <input type="file" onChange={e => setResume(e.target.files?.[0] || null)} />
        <input type="file" onChange={e => setJd(e.target.files?.[0] || null)} />
      </div>
      <button disabled={loading} onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{loading ? 'Processing...' : 'Analyze'}</button>
    </div>
  );
};

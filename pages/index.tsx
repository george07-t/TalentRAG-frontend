import React, { useState } from 'react';
import { UploadForm } from '../components/UploadForm';
import { MatchAnalysis } from '../components/MatchAnalysis';
import { ChatInterface } from '../components/ChatInterface';

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  return (
    <main className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Resume Screening Tool</h1>
      {!sessionId && <UploadForm onUploaded={(id, a) => { setSessionId(id); setAnalysis(a); }} />}
      {sessionId && (
        <div className="space-y-6">
          <MatchAnalysis analysis={analysis} />
          <ChatInterface sessionId={sessionId} />
        </div>
      )}
    </main>
  );
}

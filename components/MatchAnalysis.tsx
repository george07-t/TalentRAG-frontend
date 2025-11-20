import React from 'react';

export const MatchAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => {
  if (!analysis) return null;
  return (
    <div className="bg-white p-6 rounded shadow space-y-3">
      <h2 className="text-xl font-semibold">Match Analysis</h2>
      <div className="text-3xl font-bold">{analysis.match_score}% Match</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Strengths</h3>
          <ul className="list-disc ml-5 text-sm">
            {analysis.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-medium">Gaps</h3>
          <ul className="list-disc ml-5 text-sm">
            {analysis.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

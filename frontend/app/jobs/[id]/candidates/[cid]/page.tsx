'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getCandidate } from '@/lib/api';
import type { Candidate } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import ScoreBar from '@/components/ScoreBar';

export default function CandidatePage({ params }: { params: Promise<{ id: string; cid: string }> }) {
  const { id, cid } = use(params);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    getCandidate(id, cid).then(setCandidate);
  }, [id, cid]);

  if (!candidate) return <div className="text-gray-500">Loading...</div>;

  const call = candidate.calls?.[candidate.calls.length - 1];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href={`/jobs/${id}`} className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to job
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{candidate.phone}{candidate.email ? ` · ${candidate.email}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge value={candidate.status} />
          {candidate.recommendation && <StatusBadge value={candidate.recommendation} type="recommendation" />}
        </div>
      </div>

      {/* Scores */}
      {candidate.scores && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Scores</h2>
            <span className="text-3xl font-bold">{candidate.scores.overall.toFixed(1)}<span className="text-gray-400 text-lg font-normal">/10</span></span>
          </div>
          <div className="space-y-4">
            <ScoreBar label="Experience Fit" value={candidate.scores.experience_fit} />
            <ScoreBar label="Communication" value={candidate.scores.communication} />
            <ScoreBar label="Salary Expectation" value={candidate.scores.salary_expectation} />
            <ScoreBar label="Availability" value={candidate.scores.availability} />
          </div>
        </div>
      )}

      {/* Summary */}
      {candidate.summary && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold mb-3">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
        </div>
      )}

      {/* Transcript */}
      {call && call.transcript.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Call Transcript</h2>
          <div className="space-y-3">
            {call.transcript.map((entry, i) => (
              <div key={i} className={`flex ${entry.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  entry.role === 'ai'
                    ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    : 'bg-blue-600 text-white rounded-tr-sm'
                }`}>
                  <p>{entry.text}</p>
                  <p className={`text-xs mt-1 ${entry.role === 'ai' ? 'text-gray-400' : 'text-blue-200'}`}>
                    {entry.role === 'ai' ? 'Recruiter' : candidate.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No transcript yet */}
      {(!call || call.transcript.length === 0) && candidate.status !== 'pending' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm">
          No transcript available yet.
        </div>
      )}
    </div>
  );
}

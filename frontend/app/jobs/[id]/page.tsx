'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import { getJob, getCandidates, uploadCandidateFiles, startCalls, startCandidateCall, getReportUrl } from '@/lib/api';
import type { Job, Candidate } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

const POLLING_STATUSES = new Set(['calling', 'debriefing']);

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [callingCandidateId, setCallingCandidateId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [j, c] = await Promise.all([getJob(id), getCandidates(id)]);
    setJob(j);
    setCandidates(c);
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll while calls are in progress
  useEffect(() => {
    const hasCalling = candidates.some(c => c.status === 'calling');
    if (!job || (!POLLING_STATUSES.has(job.status) && !hasCalling)) return;
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [job, candidates, refresh]);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
    setPhones(selected.map(() => ''));
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length) return;
    setUploading(true);
    setUploadError('');
    try {
      await uploadCandidateFiles(id, files, phones);
      setFiles([]);
      setPhones([]);
      await refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleCallCandidate(candidateId: string) {
    setCallingCandidateId(candidateId);
    setError('');
    try {
      await startCandidateCall(id, candidateId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start call');
    } finally {
      setCallingCandidateId(null);
    }
  }

  async function handleStartCalls() {
    setStarting(true);
    setError('');
    try {
      await startCalls(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start calls');
    } finally {
      setStarting(false);
    }
  }

  if (!job) return <div className="text-gray-500">Loading...</div>;

  const stats = job.stats;
  const canStart = candidates.some(c => c.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-gray-500 text-sm mt-1">HR: {job.hr_phone}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge value={job.status} type="job" />
          {job.status === 'done' && (
            <a
              href={getReportUrl(id)}
              target="_blank"
              className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              Download Report
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-900' },
            { label: 'Calling', value: stats.calling, color: 'text-blue-600' },
            { label: 'Completed', value: stats.completed, color: 'text-gray-900' },
            { label: 'Advancing', value: stats.advance, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upload Resumes */}
      {(
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Upload Resumes</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={onFilesChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Enter phone numbers for each file:</p>
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 flex-1 truncate">{f.name}</span>
                    <input
                      type="tel"
                      placeholder="+14155550001"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={phones[i] ?? ''}
                      onChange={e => setPhones(p => { const n = [...p]; n[i] = e.target.value; return n; })}
                    />
                  </div>
                ))}
              </div>
            )}
            {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}
            <button
              type="submit"
              disabled={uploading || !files.length}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length > 0 ? files.length : ''} Resume${files.length !== 1 ? 's' : ''}`}
            </button>
          </form>
        </div>
      )}

      {/* Start Calls */}
      {canStart && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartCalls}
            disabled={starting}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {starting ? 'Starting...' : `Start Calls (${candidates.filter(c => c.status === 'pending').length} candidates)`}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      )}

      {/* Candidates Table */}
      {candidates.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold">Candidates</h2>
            {(POLLING_STATUSES.has(job.status) || candidates.some(c => c.status === 'calling')) && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Score</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Recommendation</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {candidates.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-gray-400 text-xs">{c.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge value={c.status} />
                  </td>
                  <td className="px-6 py-4">
                    {c.scores ? (
                      <span className="font-semibold">{c.scores.overall.toFixed(1)}<span className="text-gray-400 font-normal">/10</span></span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    {c.recommendation ? <StatusBadge value={c.recommendation} type="recommendation" /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {(c.status === 'pending' || c.status === 'rescheduled') && (
                      <button
                        onClick={(e) => { e.preventDefault(); handleCallCandidate(c.id); }}
                        disabled={callingCandidateId === c.id}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium disabled:opacity-50"
                      >
                        {callingCandidateId === c.id ? 'Calling...' : 'Call'}
                      </button>
                    )}
                    <Link href={`/jobs/${id}/candidates/${c.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

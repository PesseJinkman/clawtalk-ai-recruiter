import type { Job, Candidate, Call } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Jobs
export function createJob(body: {
  title: string;
  jd: string;
  hr_phone: string;
  scoring_criteria: Record<string, unknown>;
}): Promise<Job> {
  return request('/jobs', { method: 'POST', body: JSON.stringify(body) });
}

export function getJobs(): Promise<Job[]> {
  return request('/jobs');
}

export function getJob(id: string): Promise<Job> {
  return request(`/jobs/${id}`);
}

// Candidates
export function uploadCandidatesJson(jobId: string, candidates: { name: string; phone: string; email?: string; resume_text?: string }[]): Promise<{ created: Candidate[] }> {
  return request(`/jobs/${jobId}/candidates`, {
    method: 'POST',
    body: JSON.stringify({ candidates }),
  });
}

export async function uploadCandidateFiles(jobId: string, files: File[], phones: string[]): Promise<{ created: Candidate[] }> {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  phones.forEach(p => form.append('phones', p));

  const res = await fetch(`${BASE}/jobs/${jobId}/candidates`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export function getCandidates(jobId: string): Promise<Candidate[]> {
  return request(`/jobs/${jobId}/candidates`);
}

export function getCandidate(jobId: string, cid: string): Promise<Candidate> {
  return request(`/jobs/${jobId}/candidates/${cid}`);
}

export function startCandidateCall(jobId: string, candidateId: string): Promise<{ candidate_id: string; call_id: string }> {
  return request(`/jobs/${jobId}/candidates/${candidateId}/call`, { method: 'POST' });
}

// Calls
export function startCalls(jobId: string): Promise<{ message: string; calls: { candidate_id: string; call_id: string }[] }> {
  return request(`/jobs/${jobId}/calls/start`, { method: 'POST' });
}

export function getCalls(jobId: string): Promise<Call[]> {
  return request(`/jobs/${jobId}/calls`);
}

export function getCall(callId: string): Promise<Call> {
  return request(`/calls/${callId}`);
}

export function rescheduleCall(callId: string, scheduledAt?: string): Promise<{ message: string; scheduled_at: string }> {
  return request(`/calls/${callId}/reschedule`, {
    method: 'POST',
    body: JSON.stringify(scheduledAt ? { scheduled_at: scheduledAt } : {}),
  });
}

export function getReportUrl(jobId: string): string {
  return `${BASE}/jobs/${jobId}/report`;
}

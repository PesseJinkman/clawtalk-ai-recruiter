import type { Job, Candidate } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  getJobs: () => request<Job[]>('/jobs'),

  createJob: (data: { title: string; jd: string; hr_phone: string; scoring_criteria: Record<string, unknown> }) =>
    request<Job>('/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getJob: (id: string) => request<Job>(`/jobs/${id}`),

  getJobReportUrl: (id: string) => `${API_URL}/jobs/${id}/report`,

  startCalls: (jobId: string) =>
    request<{ message: string; calls: { candidate_id: string; call_id: string }[] }>(
      `/jobs/${jobId}/calls/start`,
      { method: 'POST' }
    ),

  getCandidates: (jobId: string) => request<Candidate[]>(`/jobs/${jobId}/candidates`),

  uploadCandidates: (jobId: string, formData: FormData) =>
    request<{ created: Candidate[] }>(`/jobs/${jobId}/candidates`, {
      method: 'POST',
      body: formData,
    }),

  getCandidate: (jobId: string, candidateId: string) =>
    request<Candidate>(`/jobs/${jobId}/candidates/${candidateId}`),

  callCandidate: (jobId: string, candidateId: string) =>
    request<{ candidate_id: string; call_id: string }>(
      `/jobs/${jobId}/candidates/${candidateId}/call`,
      { method: 'POST' }
    ),
};

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/api';
import type { Job } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link
          href="/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Create a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No jobs yet. Create your first job to get started.</p>
          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create a Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-gray-900 truncate mr-2">{job.title}</h2>
                <StatusBadge value={job.status} type="job" />
              </div>
              {job.stats && (
                <div className="flex gap-4 text-xs text-gray-500 mb-3">
                  <span>{job.stats.total} candidates</span>
                  <span className="text-green-600">{job.stats.completed} completed</span>
                  <span className="text-green-700">{job.stats.advance} advancing</span>
                </div>
              )}
              <p className="text-xs text-gray-400">
                {new Date(job.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

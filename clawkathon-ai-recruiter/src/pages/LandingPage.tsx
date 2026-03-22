import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Job } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Briefcase, Plus, Users, CheckCircle, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Clawkathon</h1>
          </div>
          <Link to="/jobs/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create a Job
          </Link>
        </header>

        {loading && <p className="text-muted-foreground text-center py-20 animate-pulse">Loading jobs…</p>}
        {error && <p className="text-destructive text-center py-20 animate-fade-in">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-24 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No jobs yet.</p>
            <Link to="/jobs/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create your first job
            </Link>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, i) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card-surface group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${80 * i}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h2>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="mb-4">
                  <StatusBadge value={job.status} type="job" />
                </div>
                {job.stats && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {job.stats.total} candidates
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> {job.stats.completed} done
                    </span>
                    <span className="text-green-600 font-medium">{job.stats.advance} advancing</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

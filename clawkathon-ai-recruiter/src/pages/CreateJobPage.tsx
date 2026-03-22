import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [jd, setJd] = useState('');
  const [hrPhone, setHrPhone] = useState('');
  const [expYears, setExpYears] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const scoring_criteria: Record<string, unknown> = {};
      if (expYears) scoring_criteria.experience_years = Number(expYears);
      if (maxSalary) scoring_criteria.max_salary = Number(maxSalary);
      if (skills.trim()) scoring_criteria.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);

      const job = await api.createJob({ title, jd, hr_phone: hrPhone, scoring_criteria });
      navigate(`/jobs/${job.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors animate-fade-in-left">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>Create a New Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-surface space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Job Title *</label>
              <input className="input-field" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Job Description *</label>
              <textarea className="input-field resize-none" rows={6} required value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Describe the role, responsibilities, and requirements…" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">HR Phone Number *</label>
              <input className="input-field" required value={hrPhone} onChange={(e) => setHrPhone(e.target.value)} placeholder="+1 555 123 4567" />
            </div>
          </div>

          <div className="card-surface space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Scoring Criteria <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional)</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Min. Years Experience</label>
                <input type="number" min={0} className="input-field" value={expYears} onChange={(e) => setExpYears(e.target.value)} placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Max Salary ($)</label>
                <input type="number" min={0} className="input-field" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder="e.g. 120000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Required Skills</label>
              <input className="input-field" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js" />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated list</p>
            </div>
          </div>

          {error && <p className="text-sm text-destructive animate-fade-in">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
            {loading ? 'Creating…' : 'Create Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

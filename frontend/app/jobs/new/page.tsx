'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    jd: '',
    hr_phone: '',
    experience_years: '',
    skills: '',
    max_salary: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const job = await createJob({
        title: form.title,
        jd: form.jd,
        hr_phone: form.hr_phone,
        scoring_criteria: {
          experience_years: form.experience_years ? Number(form.experience_years) : undefined,
          skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
          max_salary: form.max_salary ? Number(form.max_salary) : undefined,
        },
      });
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a Job</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Senior Backend Engineer"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            required
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="We are looking for..."
            value={form.jd}
            onChange={e => setForm(f => ({ ...f, jd: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HR Phone Number</label>
          <input
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+14155551234"
            value={form.hr_phone}
            onChange={e => setForm(f => ({ ...f, hr_phone: e.target.value }))}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">Scoring Criteria</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min. Years Experience</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
                value={form.experience_years}
                onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Salary ($)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150000"
                value={form.max_salary}
                onChange={e => setForm(f => ({ ...f, max_salary: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Required Skills (comma-separated)</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Python, AWS, PostgreSQL"
              value={form.skills}
              onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}

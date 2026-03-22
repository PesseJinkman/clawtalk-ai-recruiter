import type { JobStatus, CandidateStatus, Recommendation } from '@/lib/types';

type BadgeType = 'job' | 'candidate' | 'recommendation';

const jobColors: Record<JobStatus, string> = {
  created: 'bg-muted text-muted-foreground',
  calling: 'bg-primary/10 text-primary',
  debriefing: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

const candidateColors: Record<CandidateStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  calling: 'bg-primary/10 text-primary',
  completed: 'bg-green-100 text-green-800',
  rescheduled: 'bg-yellow-100 text-yellow-800',
  no_answer: 'bg-red-100 text-red-800',
};

const recommendationColors: Record<Recommendation, string> = {
  advance: 'bg-green-100 text-green-800',
  maybe: 'bg-yellow-100 text-yellow-800',
  reject: 'bg-red-100 text-red-800',
};

interface StatusBadgeProps {
  value: string;
  type: BadgeType;
}

export function StatusBadge({ value, type }: StatusBadgeProps) {
  let colorClass = 'bg-muted text-muted-foreground';
  if (type === 'job') colorClass = jobColors[value as JobStatus] || colorClass;
  if (type === 'candidate') colorClass = candidateColors[value as CandidateStatus] || colorClass;
  if (type === 'recommendation') colorClass = recommendationColors[value as Recommendation] || colorClass;

  const label = value.replace(/_/g, ' ');

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colorClass}`}>
      {label}
    </span>
  );
}

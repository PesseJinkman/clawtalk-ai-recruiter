const JOB_COLORS: Record<string, string> = {
  created: 'bg-gray-100 text-gray-600',
  calling: 'bg-blue-100 text-blue-700',
  debriefing: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
};

const CANDIDATE_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  calling: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rescheduled: 'bg-yellow-100 text-yellow-700',
  no_answer: 'bg-red-100 text-red-600',
};

const RECOMMENDATION_COLORS: Record<string, string> = {
  advance: 'bg-green-100 text-green-700',
  maybe: 'bg-yellow-100 text-yellow-700',
  reject: 'bg-red-100 text-red-600',
};

interface Props {
  value: string;
  type?: 'job' | 'candidate' | 'recommendation';
}

export default function StatusBadge({ value, type = 'candidate' }: Props) {
  const map = type === 'job' ? JOB_COLORS : type === 'recommendation' ? RECOMMENDATION_COLORS : CANDIDATE_COLORS;
  const color = map[value] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {value.replace('_', ' ')}
    </span>
  );
}

interface Props {
  label: string;
  value: number;
}

export default function ScoreBar({ label, value }: Props) {
  const pct = Math.round((value / 10) * 100);
  const color = value >= 7 ? 'bg-green-500' : value >= 5 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

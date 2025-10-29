interface MetricProps {
  label: string;
  value: number | null;
  format?: 'number' | 'percent';
}

export function Metric({ label, value, format = 'number' }: MetricProps) {
  const isNil = value === null || value === undefined;
  const displayValue = isNil
    ? '—'
    : format === 'percent'
      ? `${Number(value).toFixed(2)}%`
      : Number(value).toLocaleString();
  
  return (
    <div className="flex flex-col">
      <span className="text-xs opacity-60">{label}</span>
      <span className="text-xl font-semibold">{displayValue}</span>
    </div>
  );
}

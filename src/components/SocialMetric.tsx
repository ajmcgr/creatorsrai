interface MetricProps {
  label: string;
  value?: number;
  format?: 'number' | 'percent';
}

export function Metric({ label, value, format = 'number' }: MetricProps) {
  const formatValue = (val?: number) => {
    if (val === undefined || val === null) return 'N/A';
    
    if (format === 'percent') {
      return `${val.toFixed(1)}%`;
    }
    
    // Format large numbers with K, M, B suffixes
    if (val >= 1_000_000_000) {
      return `${(val / 1_000_000_000).toFixed(1)}B`;
    }
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(1)}M`;
    }
    if (val >= 1_000) {
      return `${(val / 1_000).toFixed(1)}K`;
    }
    
    return val.toLocaleString();
  };

  return (
    <div className="text-center">
      <div className="font-bold text-base">{formatValue(value)}</div>
      <div className="text-xs opacity-70 mt-0.5">{label}</div>
    </div>
  );
}

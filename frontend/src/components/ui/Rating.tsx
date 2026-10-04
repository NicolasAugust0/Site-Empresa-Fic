import { Star } from 'lucide-react';

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </span>
  );
}

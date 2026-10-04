import type { TieBreaker } from '../../types/api';
import { TIE_BREAKER_OPTIONS } from '../../utils/constants';

export function TieBreakerSelect({ value, onChange }: { value: TieBreaker; onChange: (value: TieBreaker) => void }) {
  return (
    <label className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-600">
      <span className="whitespace-nowrap">Em caso de empate:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TieBreaker)}
        className="min-w-0 max-w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        {TIE_BREAKER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

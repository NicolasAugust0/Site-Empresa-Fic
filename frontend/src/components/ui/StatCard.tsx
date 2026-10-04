import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/format';
import { Card } from './Card';

const tones = {
  brand: 'bg-brand-50 text-brand-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  orange: 'bg-orange-50 text-orange-600',
  violet: 'bg-violet-50 text-violet-600',
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof tones;
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tones[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      </div>
      <div>
        <p className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-slate-500">{hint}</p>}
      </div>
    </Card>
  );
}

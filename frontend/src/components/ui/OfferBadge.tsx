import type { ReactNode } from 'react';
import type { Badge } from '../../types/api';
import { cn } from '../../utils/format';

const styles: Record<Badge['type'], string> = {
  best: 'bg-amber-100 text-amber-800 ring-amber-200',
  savings: 'bg-brand-100 text-brand-800 ring-brand-200',
  promo: 'bg-orange-100 text-orange-800 ring-orange-200',
  'free-delivery': 'bg-sky-100 text-sky-800 ring-sky-200',
  coupon: 'bg-violet-100 text-violet-800 ring-violet-200',
  tie: 'bg-slate-100 text-slate-700 ring-slate-200',
  fastest: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
};

export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', className)}>
      {children}
    </span>
  );
}

export function OfferBadge({ badge }: { badge: Badge }) {
  return <Pill className={styles[badge.type]}>{badge.label}</Pill>;
}

export function BadgeList({ badges, exclude = [] }: { badges: Badge[]; exclude?: Badge['type'][] }) {
  const visible = badges.filter((b) => !exclude.includes(b.type));
  if (!visible.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((b) => (
        <OfferBadge key={b.type} badge={b} />
      ))}
    </div>
  );
}

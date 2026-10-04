import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/format';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-slate-200/80 bg-white shadow-card', className)} {...props} />;
}

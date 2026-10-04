import { AlertTriangle, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/format';
import { Button } from './Button';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-slate-200/70', className)} />;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <SearchX className="h-10 w-10 text-slate-400" />
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {description && <p className="max-w-md text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <AlertTriangle className="h-9 w-9 text-red-500" />
      <h3 className="font-bold text-red-800">Algo deu errado</h3>
      <p className="text-sm text-red-700">{error.message}</p>
      <p className="text-xs text-red-600/80">Verifique se a API está rodando (npm run dev).</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

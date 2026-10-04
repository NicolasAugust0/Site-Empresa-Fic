import { Trophy } from 'lucide-react';
import type { OverviewStats } from '../../types/api';
import { formatBRL } from '../../utils/format';
import { Card } from '../ui/Card';
import { PlatformLogo } from '../ui/PlatformLogo';

/** Quantas vezes cada plataforma teve o menor preço final — análise agregada dos dados. */
export function PlatformInsights({ stats }: { stats: OverviewStats }) {
  const maxWins = Math.max(...stats.platforms.map((p) => p.wins), 1);
  const comparedProducts = stats.platforms.reduce((sum, p) => sum + p.wins, 0);

  return (
    <Card className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col justify-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Análise de dados</span>
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Nenhuma plataforma é sempre a mais barata.</h3>
        <p className="text-sm text-slate-500">
          Em {comparedProducts} produtos comparados, a economia média escolhendo a melhor opção é de{' '}
          <strong className="text-brand-700">{formatBRL(stats.averageSavings)}</strong> por pedido.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {stats.platforms.map((p) => (
          <div key={p.platform.id} className="flex items-center gap-3">
            <PlatformLogo platform={p.platform} size="sm" />
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">{p.platform.name}</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" /> {p.wins} vitórias
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(p.wins / maxWins) * 100}%`, backgroundColor: p.platform.color === '#111827' ? '#334155' : p.platform.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

import { MousePointerClick, PiggyBank, Store, Tags, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { catalogService } from '../../services/catalogService';
import { formatBRL } from '../../utils/format';
import { PlatformInsights } from '../home/PlatformInsights';
import { ErrorState, Skeleton } from '../ui/Feedback';
import { PlatformLogo } from '../ui/PlatformLogo';
import { StatCard } from '../ui/StatCard';
import { AdminTable } from './AdminTable';

export function OverviewTab() {
  const { data: stats, error, reload } = useAsync(() => catalogService.stats(), []);

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!stats) return <Skeleton className="h-96" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Store} label="Restaurantes" value={String(stats.totals.restaurants)} hint={`${stats.totals.products} produtos`} />
        <StatCard icon={Tags} tone="sky" label="Ofertas" value={String(stats.totals.offers)} hint={`${stats.totals.platforms} plataformas`} />
        <StatCard icon={PiggyBank} tone="amber" label="Economia média" value={formatBRL(stats.averageSavings)} hint="por produto comparado" />
        <StatCard icon={MousePointerClick} tone="violet" label="Cliques em pedir" value={String(stats.totals.clicks)} hint="redirecionamentos" />
      </div>

      <PlatformInsights stats={stats} />

      {stats.biggestSaving && (
        <div className="flex flex-col gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Maior diferença de preço: <strong>{stats.biggestSaving.productName}</strong> ({stats.biggestSaving.restaurantName}) —{' '}
            {formatBRL(stats.biggestSaving.value)}
          </p>
          <Link to={`/produto/${stats.biggestSaving.productId}`} className="font-semibold underline">
            Ver comparação
          </Link>
        </div>
      )}

      <AdminTable
        rows={stats.platforms}
        rowKey={(r) => r.platform.id}
        columns={[
          {
            header: 'Plataforma',
            render: (r) => (
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <PlatformLogo platform={r.platform} size="sm" /> {r.platform.name}
              </span>
            ),
          },
          { header: 'Ofertas', render: (r) => r.offers },
          { header: 'Melhor preço em', render: (r) => <strong className="text-brand-700">{r.wins} produtos</strong> },
          { header: 'Preço final médio', render: (r) => formatBRL(r.averageFinalPrice) },
          { header: 'Frete grátis', render: (r) => r.freeDeliveryOffers },
          { header: 'Cliques', render: (r) => r.clicks },
        ]}
      />
    </div>
  );
}

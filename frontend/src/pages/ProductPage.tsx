import { ArrowLeft, Info, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BestOfferHero } from '../components/comparison/BestOfferHero';
import { IndicatorsGrid } from '../components/comparison/IndicatorsGrid';
import { OfferRow } from '../components/comparison/OfferRow';
import { PriceChart } from '../components/comparison/PriceChart';
import { TieBreakerSelect } from '../components/comparison/TieBreakerSelect';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/Feedback';
import { ItemImage } from '../components/ui/ItemImage';
import { Rating } from '../components/ui/Rating';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { catalogService } from '../services/catalogService';
import type { TieBreaker } from '../types/api';
import { CATEGORY_LABELS } from '../utils/constants';
import { formatDateTime } from '../utils/format';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const [tieBreaker, setTieBreaker] = useState<TieBreaker | undefined>(undefined);

  const { data, error, loading, reload } = useAsync(() => catalogService.compare(productId, tieBreaker), [productId, tieBreaker]);
  useDocumentTitle(data ? `${data.product.name} — ${data.product.restaurant.name}` : 'Comparação');

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-56" />
        <Skeleton className="h-28" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const { product, offers } = data;
  const category = CATEGORY_LABELS[product.category];
  const lastUpdate = offers.map((o) => o.updatedAt).sort().at(-1);

  return (
    <div className={`mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8 ${loading ? 'opacity-70' : ''}`}>
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/busca'))}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {/* Produto */}
      <header className="flex items-start gap-4">
        <ItemImage image={product.image} alt={product.name} size="lg" className="hidden sm:flex" />
        <ItemImage image={product.image} alt={product.name} size="md" className="sm:hidden" />
        <div className="min-w-0 flex-1">
          {category && (
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              {category.emoji} {category.label}
            </span>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <Link to={`/restaurante/${product.restaurant.id}`} className="font-semibold text-slate-700 hover:text-brand-700 hover:underline">
              {product.restaurant.name}
            </Link>
            <Rating value={product.restaurant.rating} />
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {product.restaurant.address}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{product.description}</p>
        </div>
      </header>

      {offers.length === 0 ? (
        <EmptyState title="Nenhuma oferta disponível" description={data.message} />
      ) : (
        <>
          <BestOfferHero comparison={data} />
          <IndicatorsGrid comparison={data} />

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Ranking de preços</h2>
                <p className="text-sm text-slate-500">Do menor para o maior preço final</p>
              </div>
              {offers.length > 1 && <TieBreakerSelect value={tieBreaker ?? data.tieBreaker} onChange={setTieBreaker} />}
            </div>

            <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${data.isTie ? 'bg-amber-50 text-amber-900' : 'bg-brand-50 text-brand-900'}`}>
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{data.message}</p>
            </div>

            <div className="flex flex-col gap-3">
              {offers.map((offer) => (
                <OfferRow key={offer.offerId} offer={offer} defaultOpen={offer.isBest && offers.length > 0} />
              ))}
            </div>
          </section>

          {offers.length > 1 && <PriceChart offers={offers} />}

          <p className="text-center text-xs text-slate-400">
            Preço final = produto + entrega + outras taxas − descontos − cupons.
            {lastUpdate && ` Dados simulados atualizados em ${formatDateTime(lastUpdate)}.`}
          </p>
        </>
      )}
    </div>
  );
}

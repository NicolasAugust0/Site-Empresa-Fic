import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProductSummary } from '../../types/api';
import { formatBRL, pluralize } from '../../utils/format';
import { ItemImage } from '../ui/ItemImage';
import { Pill } from '../ui/OfferBadge';
import { PlatformLogo } from '../ui/PlatformLogo';

export function ProductCard({ product }: { product: ProductSummary }) {
  const single = product.offersCount === 1;

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
    >
      <div className="flex gap-3.5">
        <ItemImage image={product.image} alt={product.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-slate-900 group-hover:text-brand-700">{product.name}</h3>
          <p className="truncate text-sm text-slate-500">{product.restaurant.name}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.savings > 0 && <Pill className="bg-brand-100 text-brand-800 ring-brand-200">💰 Economize {formatBRL(product.savings)}</Pill>}
            {product.hasFreeDelivery && <Pill className="bg-sky-100 text-sky-800 ring-sky-200">🚚 Frete grátis</Pill>}
            {product.hasPromo && <Pill className="bg-orange-100 text-orange-800 ring-orange-200">🔥 Promoção</Pill>}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
        {product.bestPlatform && product.bestPrice !== null ? (
          <div className="flex items-center gap-2.5">
            <PlatformLogo platform={product.bestPlatform} size="sm" />
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {single ? 'Única oferta' : 'Melhor preço'} · {product.bestPlatform.name}
              </p>
              <p className="text-lg font-extrabold text-brand-700">{formatBRL(product.bestPrice)}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Sem ofertas no momento</p>
        )}
        <span className="flex items-center gap-0.5 text-xs font-semibold text-slate-500 group-hover:text-brand-700">
          {pluralize(product.offersCount, 'plataforma', 'plataformas')}
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

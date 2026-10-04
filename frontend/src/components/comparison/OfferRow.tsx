import { ArrowUpRight, ChevronDown, Clock } from 'lucide-react';
import { useState } from 'react';
import type { RankedOffer } from '../../types/api';
import { cn, formatBRL } from '../../utils/format';
import { ExternalLinkButton } from '../ui/Button';
import { BadgeList } from '../ui/OfferBadge';
import { PlatformLogo } from '../ui/PlatformLogo';
import { PriceBreakdown } from './PriceBreakdown';

const MEDALS = ['🥇', '🥈', '🥉'];

export function OfferRow({ offer, defaultOpen = false }: { offer: RankedOffer; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const medal = MEDALS[offer.position - 1] ?? `${offer.position}º`;

  return (
    <article
      className={cn(
        'rounded-2xl border bg-white shadow-card transition',
        offer.isBest ? 'border-brand-300 ring-2 ring-brand-500/20' : 'border-slate-200/80',
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="w-8 shrink-0 text-center text-2xl" aria-label={`${offer.position}º lugar`}>
            {medal}
          </span>
          <PlatformLogo platform={offer.platform} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-bold text-slate-900">{offer.platform.name}</h3>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" /> {offer.deliveryTimeMin} min
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Produto {formatBRL(offer.breakdown.productPrice)} · Entrega{' '}
              {offer.breakdown.deliveryFee === 0 ? 'grátis' : formatBRL(offer.breakdown.deliveryFee)}
              {offer.breakdown.totalDiscount > 0 && (
                <span className="font-semibold text-brand-700"> · −{formatBRL(offer.breakdown.totalDiscount)}</span>
              )}
            </p>
            <div className="mt-2">
              <BadgeList badges={offer.badges} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-left sm:text-right">
            <p className={cn('text-2xl font-extrabold tracking-tight', offer.isBest ? 'text-brand-700' : 'text-slate-900')}>
              {formatBRL(offer.finalPrice)}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {offer.differenceFromBest > 0 ? (
                <span className="text-red-600">+{formatBRL(offer.differenceFromBest)} que a melhor</span>
              ) : (
                'preço final'
              )}
            </p>
          </div>
          <ExternalLinkButton href={offer.redirectPath} variant={offer.isBest ? 'primary' : 'secondary'} className="shrink-0">
            Pedir agora <ArrowUpRight className="h-4 w-4" />
          </ExternalLinkButton>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-1 border-t border-slate-100 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      >
        {open ? 'Ocultar cálculo' : 'Ver cálculo do preço'}
        <ChevronDown className={cn('h-3.5 w-3.5 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          <div className="max-w-sm">
            <PriceBreakdown breakdown={offer.breakdown} couponCode={offer.couponCode} />
          </div>
        </div>
      )}
    </article>
  );
}

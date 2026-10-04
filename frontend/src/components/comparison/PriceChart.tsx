import type { RankedOffer } from '../../types/api';
import { formatBRL } from '../../utils/format';
import { Card } from '../ui/Card';
import { PlatformLogo } from '../ui/PlatformLogo';

const LEGEND = [
  { label: 'Produto', className: 'bg-slate-400' },
  { label: 'Entrega', className: 'bg-sky-400' },
  { label: 'Taxas', className: 'bg-violet-400' },
  { label: 'Descontos', className: 'bg-brand-400/40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,.7)_4px,rgba(255,255,255,.7)_8px)]' },
];

/** Gráfico de barras com a composição do preço de cada plataforma. */
export function PriceChart({ offers }: { offers: RankedOffer[] }) {
  const maxSubtotal = Math.max(...offers.map((o) => o.breakdown.subtotal), 1);

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-slate-900">Composição do preço</h3>
        <div className="flex flex-wrap gap-3">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`h-2.5 w-2.5 rounded-sm ${l.className}`} /> {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {offers.map((offer) => {
          const { productPrice, deliveryFee, additionalFee, totalDiscount, subtotal } = offer.breakdown;
          const pct = (v: number) => `${(v / subtotal) * 100}%`;
          return (
            <div key={offer.offerId} className="flex items-center gap-3">
              <PlatformLogo platform={offer.platform} size="sm" />
              <div className="flex-1">
                <div className="relative h-7 overflow-hidden rounded-lg bg-slate-100">
                  <div className="flex h-full" style={{ width: `${(subtotal / maxSubtotal) * 100}%` }}>
                    <div className="h-full bg-slate-400" style={{ width: pct(productPrice) }} title={`Produto ${formatBRL(productPrice)}`} />
                    <div className="h-full bg-sky-400" style={{ width: pct(deliveryFee) }} title={`Entrega ${formatBRL(deliveryFee)}`} />
                    <div className="h-full bg-violet-400" style={{ width: pct(additionalFee) }} title={`Taxas ${formatBRL(additionalFee)}`} />
                  </div>
                  {totalDiscount > 0 && (
                    <div
                      className="absolute inset-y-0 bg-brand-400/40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,.7)_4px,rgba(255,255,255,.7)_8px)]"
                      style={{
                        left: `${((subtotal - totalDiscount) / maxSubtotal) * 100}%`,
                        width: `${(totalDiscount / maxSubtotal) * 100}%`,
                      }}
                      title={`Descontos −${formatBRL(totalDiscount)}`}
                    />
                  )}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-slate-900"
                    style={{ left: `calc(${(offer.finalPrice / maxSubtotal) * 100}% - 1px)` }}
                  />
                </div>
              </div>
              <span className={`w-20 text-right text-sm font-bold ${offer.isBest ? 'text-brand-700' : 'text-slate-700'}`}>
                {formatBRL(offer.finalPrice)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-400">A linha preta marca o preço final (subtotal − descontos).</p>
    </Card>
  );
}

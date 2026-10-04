import type { PriceBreakdown, RawOffer, TieBreaker } from '../../types/domain.js';

export interface PricedOffer extends RawOffer {
  breakdown: PriceBreakdown;
}

export interface RankedEntry extends PricedOffer {
  position: number;
}

export const TIE_BREAKERS: Record<TieBreaker, string> = {
  none: 'sem critério de desempate',
  deliveryTime: 'menor tempo de entrega',
  deliveryFee: 'menor taxa de entrega',
  productPrice: 'menor preço do produto',
};

export function isTieBreaker(value: unknown): value is TieBreaker {
  return typeof value === 'string' && value in TIE_BREAKERS;
}

/** Critério secundário aplicado somente quando o preço final é igual. */
function compareSecondary(a: PricedOffer, b: PricedOffer, tieBreaker: TieBreaker): number {
  switch (tieBreaker) {
    case 'deliveryTime':
      return a.deliveryTimeMin - b.deliveryTimeMin;
    case 'deliveryFee':
      return a.breakdown.deliveryFee - b.breakdown.deliveryFee;
    case 'productPrice':
      return a.breakdown.productPrice - b.breakdown.productPrice;
    case 'none':
    default:
      return 0;
  }
}

/** Compara duas ofertas: preço final e, em caso de empate, o critério secundário. */
export function compareOffers(a: PricedOffer, b: PricedOffer, tieBreaker: TieBreaker): number {
  const byPrice = a.breakdown.finalPrice - b.breakdown.finalPrice;
  if (byPrice !== 0) return byPrice;
  return compareSecondary(a, b, tieBreaker);
}

/**
 * Ordena as ofertas da mais barata para a mais cara.
 * Ofertas que permanecem empatadas (mesmo preço e mesmo critério secundário)
 * compartilham a mesma posição no ranking.
 */
export function rankOffers(offers: PricedOffer[], tieBreaker: TieBreaker = 'none'): RankedEntry[] {
  const sorted = [...offers].sort(
    (a, b) => compareOffers(a, b, tieBreaker) || a.platform.name.localeCompare(b.platform.name),
  );

  const ranked: RankedEntry[] = [];
  sorted.forEach((offer, index) => {
    const previous = ranked[index - 1];
    const sharesPosition = previous && compareOffers(previous, offer, tieBreaker) === 0;
    ranked.push({ ...offer, position: sharesPosition ? previous.position : index + 1 });
  });
  return ranked;
}

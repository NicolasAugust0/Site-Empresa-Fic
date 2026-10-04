import type {
  ComparisonIndicators,
  ComparisonResult,
  ProductInfo,
  RankedOffer,
  RawOffer,
  TieBreaker,
} from '../../types/domain.js';
import { formatBRL } from '../../utils/money.js';
import { calculateFinalPrice } from '../pricing/PriceCalculator.js';
import { rankOffers, TIE_BREAKERS, type PricedOffer } from '../ranking/ranking.js';
import { buildRedirectPath } from '../redirect/paths.js';
import { buildBadges } from './badges.js';

function listNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
}

/**
 * Núcleo da comparação (função pura):
 * 1. calcula o preço final de cada oferta;
 * 2. ordena (ranking);
 * 3. identifica a melhor oferta e empates;
 * 4. calcula economia e indicadores;
 * 5. monta a resposta para o frontend.
 */
export function buildComparison(
  product: ProductInfo,
  rawOffers: RawOffer[],
  tieBreaker: TieBreaker = 'none',
): ComparisonResult {
  const priced: PricedOffer[] = rawOffers.map((offer) => ({ ...offer, breakdown: calculateFinalPrice(offer) }));
  const ranked = rankOffers(priced, tieBreaker);

  const prices = ranked.map((o) => o.breakdown.finalPrice);
  const bestPrice = prices.length ? Math.min(...prices) : 0;
  const worstPrice = prices.length ? Math.max(...prices) : 0;
  const savings = worstPrice - bestPrice;

  // Empate de preço final na primeira colocação (antes de qualquer desempate)
  const tiedAtBest = ranked.filter((o) => o.breakdown.finalPrice === bestPrice);
  const isTie = ranked.length > 1 && tiedAtBest.length > 1;
  const tieUnresolved = isTie && ranked[1].position === 1;

  const times = ranked.map((o) => o.deliveryTimeMin);
  const fastestTime = Math.min(...times);
  const hasUniqueFastest = ranked.length > 1 && times.filter((t) => t === fastestTime).length === 1;

  const offers: RankedOffer[] = ranked.map((entry) => {
    const isBest = entry.position === 1;
    return {
      position: entry.position,
      offerId: entry.offerId,
      platform: entry.platform,
      breakdown: entry.breakdown,
      finalPrice: entry.breakdown.finalPrice,
      differenceFromBest: entry.breakdown.finalPrice - bestPrice,
      couponCode: entry.couponCode,
      promoLabel: entry.promoLabel,
      deliveryTimeMin: entry.deliveryTimeMin,
      redirectUrl: entry.redirectUrl,
      redirectPath: buildRedirectPath(entry.offerId),
      updatedAt: entry.updatedAt.toISOString(),
      isBest,
      isTied: isTie && entry.breakdown.finalPrice === bestPrice,
      badges: buildBadges(entry, {
        isBest,
        isTiedForBest: tieUnresolved && isBest,
        savings,
        isFastest: hasUniqueFastest && entry.deliveryTimeMin === fastestTime,
      }),
    };
  });

  const bestOffer = offers[0] ?? null;
  const discounts = offers.map((o) => ({ value: o.breakdown.totalDiscount, platform: o.platform.name }));
  const biggest = discounts.reduce<(typeof discounts)[number] | null>(
    (max, d) => (d.value > (max?.value ?? 0) ? d : max),
    null,
  );

  const indicators: ComparisonIndicators = {
    bestPrice,
    worstPrice,
    averagePrice: prices.length ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : 0,
    maxSavings: savings,
    platformsCompared: offers.length,
    biggestDiscount: biggest?.value ?? 0,
    biggestDiscountPlatform: biggest?.platform ?? null,
  };

  const tiedPlatforms = isTie ? tiedAtBest.map((o) => o.platform.name) : [];

  let message: string;
  if (!bestOffer) {
    message = 'Nenhuma oferta disponível para este produto no momento.';
  } else if (offers.length === 1) {
    message = `Apenas uma oferta foi encontrada para este produto (${bestOffer.platform.name}).`;
  } else if (tieUnresolved) {
    message = `Empate! ${listNames(tiedPlatforms)} têm o mesmo preço final de ${formatBRL(bestPrice)}.`;
  } else if (isTie) {
    message =
      `${listNames(tiedPlatforms)} empataram em ${formatBRL(bestPrice)}. ` +
      `Desempate por ${TIE_BREAKERS[tieBreaker]}: ${bestOffer.platform.name}.`;
  } else {
    message =
      `${bestOffer.platform.name} tem o menor preço final: ${formatBRL(bestPrice)}. ` +
      `Você economiza ${formatBRL(savings)} em relação à opção mais cara.`;
  }

  return { product, offers, bestOffer, savings, isTie, tieBreaker, tiedPlatforms, indicators, message };
}

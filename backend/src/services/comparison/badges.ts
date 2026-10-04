import type { Badge } from '../../types/domain.js';
import { formatBRL } from '../../utils/money.js';
import type { RankedEntry } from '../ranking/ranking.js';

/** Percentual mínimo de desconto (sobre o preço do produto) para exibir "Promoção". */
const PROMO_THRESHOLD = 0.1;

interface BadgeContext {
  isBest: boolean;
  isTiedForBest: boolean;
  savings: number;
  isFastest: boolean;
}

/** Gera os selos visuais de uma oferta a partir das regras de negócio. */
export function buildBadges(entry: RankedEntry, ctx: BadgeContext): Badge[] {
  const badges: Badge[] = [];
  const { breakdown } = entry;

  if (ctx.isBest) badges.push({ type: 'best', label: '🏆 Melhor preço' });
  if (ctx.isTiedForBest) badges.push({ type: 'tie', label: '🤝 Empate no melhor preço' });
  if (ctx.isBest && ctx.savings > 0) {
    badges.push({ type: 'savings', label: `💰 Economize ${formatBRL(ctx.savings)}` });
  }
  if (breakdown.deliveryFee === 0) badges.push({ type: 'free-delivery', label: '🚚 Frete grátis' });
  if (breakdown.discount > 0 && (entry.promoLabel || breakdown.discount >= breakdown.productPrice * PROMO_THRESHOLD)) {
    badges.push({ type: 'promo', label: `🔥 ${entry.promoLabel ?? 'Promoção'}` });
  }
  if (breakdown.couponDiscount > 0) {
    badges.push({
      type: 'coupon',
      label: entry.couponCode ? `🎟️ Cupom ${entry.couponCode}` : '🎟️ Cupom aplicado',
    });
  }
  if (ctx.isFastest) badges.push({ type: 'fastest', label: '⚡ Entrega mais rápida' });

  return badges;
}

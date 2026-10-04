import { prisma } from '../../database/client.js';
import { productRepository } from '../../database/repositories/productRepository.js';
import { platformRepository } from '../../database/repositories/platformRepository.js';
import type { PlatformInfo } from '../../types/domain.js';
import { comparisonService } from '../comparison/ComparisonService.js';

export interface PlatformStats {
  platform: PlatformInfo;
  offers: number;
  wins: number;
  averageFinalPrice: number;
  freeDeliveryOffers: number;
  clicks: number;
}

export interface OverviewStats {
  totals: { restaurants: number; products: number; platforms: number; offers: number; clicks: number };
  averageSavings: number;
  totalPotentialSavings: number;
  biggestSaving: { productId: number; productName: string; restaurantName: string; value: number } | null;
  platforms: PlatformStats[];
}

/** Indicadores agregados — demonstra o potencial de análise de dados do projeto. */
export const statsService = {
  async overview(): Promise<OverviewStats> {
    const [products, platforms, restaurantsCount, offersCount, clicks] = await Promise.all([
      productRepository.findAll(),
      platformRepository.findActive(),
      prisma.restaurant.count(),
      prisma.offer.count(),
      prisma.clickEvent.findMany({ include: { offer: { select: { platformId: true } } } }),
    ]);

    const comparisons = await Promise.all(products.map((p) => comparisonService.compare(p)));
    const compared = comparisons.filter((c) => c.offers.length > 1);

    const stats = new Map<number, { offers: number; wins: number; sum: number; free: number; clicks: number }>();
    platforms.forEach((p) => stats.set(p.id, { offers: 0, wins: 0, sum: 0, free: 0, clicks: 0 }));

    for (const comparison of comparisons) {
      for (const offer of comparison.offers) {
        const s = stats.get(offer.platform.id);
        if (!s) continue;
        s.offers += 1;
        s.sum += offer.finalPrice;
        if (offer.breakdown.deliveryFee === 0) s.free += 1;
        if (offer.isBest && comparison.offers.length > 1) s.wins += 1;
      }
    }
    for (const click of clicks) {
      const s = stats.get(click.offer.platformId);
      if (s) s.clicks += 1;
    }

    const totalPotentialSavings = compared.reduce((sum, c) => sum + c.savings, 0);
    const biggest = compared.reduce<(typeof compared)[number] | null>(
      (max, c) => (c.savings > (max?.savings ?? -1) ? c : max),
      null,
    );

    return {
      totals: {
        restaurants: restaurantsCount,
        products: products.length,
        platforms: platforms.length,
        offers: offersCount,
        clicks: clicks.length,
      },
      averageSavings: compared.length ? Math.round(totalPotentialSavings / compared.length) : 0,
      totalPotentialSavings,
      biggestSaving: biggest
        ? {
            productId: biggest.product.id,
            productName: biggest.product.name,
            restaurantName: biggest.product.restaurant.name,
            value: biggest.savings,
          }
        : null,
      platforms: platforms.map((platform) => {
        const s = stats.get(platform.id)!;
        return {
          platform,
          offers: s.offers,
          wins: s.wins,
          averageFinalPrice: s.offers ? Math.round(s.sum / s.offers) : 0,
          freeDeliveryOffers: s.free,
          clicks: s.clicks,
        };
      }),
    };
  },
};

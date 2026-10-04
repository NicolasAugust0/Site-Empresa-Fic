import { config } from '../../config/env.js';
import { productRepository } from '../../database/repositories/productRepository.js';
import type { ComparisonResult, ProductInfo, ProductSummary, TieBreaker } from '../../types/domain.js';
import { PlatformService } from '../platforms/PlatformService.js';
import { buildComparison } from './buildComparison.js';

export interface ComparisonServiceDeps {
  platformService: Pick<PlatformService, 'getOffersForProduct'>;
  findProduct: (id: number) => Promise<ProductInfo | null>;
  defaultTieBreaker: TieBreaker;
}

/**
 * Serviço central de comparação.
 *   compareProduct(productId) -> { product, offers, bestOffer, savings, ... }
 */
export class ComparisonService {
  private readonly deps: ComparisonServiceDeps;

  constructor(deps: Partial<ComparisonServiceDeps> = {}) {
    this.deps = {
      platformService: deps.platformService ?? new PlatformService(),
      findProduct: deps.findProduct ?? ((id) => productRepository.findById(id)),
      defaultTieBreaker: deps.defaultTieBreaker ?? config.tieBreaker,
    };
  }

  async compareProduct(productId: number, tieBreaker?: TieBreaker): Promise<ComparisonResult | null> {
    const product = await this.deps.findProduct(productId);
    if (!product) return null;
    return this.compare(product, tieBreaker);
  }

  async compare(product: ProductInfo, tieBreaker?: TieBreaker): Promise<ComparisonResult> {
    const offers = await this.deps.platformService.getOffersForProduct(product);
    return buildComparison(product, offers, tieBreaker ?? this.deps.defaultTieBreaker);
  }

  async summarize(product: ProductInfo): Promise<ProductSummary> {
    const result = await this.compare(product);
    const { offers, bestOffer, indicators } = result;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      restaurant: product.restaurant,
      offersCount: offers.length,
      bestPrice: bestOffer ? indicators.bestPrice : null,
      worstPrice: bestOffer ? indicators.worstPrice : null,
      savings: result.savings,
      bestPlatform: bestOffer?.platform ?? null,
      hasFreeDelivery: offers.some((o) => o.breakdown.deliveryFee === 0),
      hasPromo: offers.some((o) => o.breakdown.totalDiscount > 0),
    };
  }

  async summarizeMany(products: ProductInfo[]): Promise<ProductSummary[]> {
    return Promise.all(products.map((p) => this.summarize(p)));
  }
}

export const comparisonService = new ComparisonService();

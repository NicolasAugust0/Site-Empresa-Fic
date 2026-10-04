import { platformRepository } from '../../database/repositories/platformRepository.js';
import type { PlatformInfo, ProductInfo, RawOffer } from '../../types/domain.js';
import type { PlatformOfferProvider } from './PlatformOfferProvider.js';
import { resolveProvider } from './providerRegistry.js';

export interface PlatformServiceDeps {
  listPlatforms: () => Promise<PlatformInfo[]>;
  resolveProvider: (platformSlug: string) => PlatformOfferProvider;
}

/**
 * Agrega as ofertas de um produto em TODAS as plataformas ativas,
 * delegando a cada provedor (mock ou oficial). Falha em uma plataforma
 * não derruba a comparação: ela apenas fica de fora do resultado.
 */
export class PlatformService {
  constructor(
    private readonly deps: PlatformServiceDeps = {
      listPlatforms: () => platformRepository.findActive(),
      resolveProvider,
    },
  ) {}

  async getOffersForProduct(product: ProductInfo): Promise<RawOffer[]> {
    const platforms = await this.deps.listPlatforms();
    const results = await Promise.allSettled(
      platforms.map((platform) => this.deps.resolveProvider(platform.slug).fetchOffers(product, platform)),
    );

    return results.flatMap((result, i) => {
      if (result.status === 'fulfilled') return result.value;
      console.error(`[platforms] falha ao buscar ofertas em ${platforms[i].name}:`, result.reason);
      return [];
    });
  }
}

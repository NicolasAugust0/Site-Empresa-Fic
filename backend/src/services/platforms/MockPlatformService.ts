import { offerRepository } from '../../database/repositories/offerRepository.js';
import type { PlatformInfo, ProductInfo, RawOffer } from '../../types/domain.js';
import type { PlatformOfferProvider } from './PlatformOfferProvider.js';

/**
 * Provedor de dados SIMULADOS.
 * Lê as ofertas cadastradas no banco (seed ou área administrativa)
 * e as entrega no mesmo formato que uma API oficial entregaria.
 */
export class MockPlatformService implements PlatformOfferProvider {
  readonly providerName = 'mock';

  isAvailable(): boolean {
    return true;
  }

  async fetchOffers(product: ProductInfo, platform: PlatformInfo): Promise<RawOffer[]> {
    return offerRepository.findAvailable(product.id, platform.id);
  }
}

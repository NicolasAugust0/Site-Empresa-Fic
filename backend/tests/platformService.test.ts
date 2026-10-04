import { describe, expect, it } from 'vitest';
import { PlatformService } from '../src/services/platforms/PlatformService.js';
import { IfoodService } from '../src/services/platforms/IfoodService.js';
import type { PlatformOfferProvider } from '../src/services/platforms/PlatformOfferProvider.js';
import { FOOD99, IFOOD, KEETA, offer, product } from './helpers.js';

describe('PlatformService', () => {
  it('agrega ofertas de todas as plataformas e ignora as que falharem', async () => {
    const working: PlatformOfferProvider = {
      providerName: 'fake',
      isAvailable: () => true,
      fetchOffers: async (_p, platform) => [offer(platform, { productPrice: 1000 })],
    };
    const failing: PlatformOfferProvider = {
      providerName: 'failing',
      isAvailable: () => true,
      fetchOffers: async () => {
        throw new Error('timeout');
      },
    };

    const service = new PlatformService({
      listPlatforms: async () => [IFOOD, FOOD99, KEETA],
      resolveProvider: (slug) => (slug === 'keeta' ? failing : working),
    });

    const original = console.error;
    console.error = () => {};
    const offers = await service.getOffersForProduct(product);
    console.error = original;

    expect(offers.map((o) => o.platform.slug)).toEqual(['ifood', '99food']);
  });
});

describe('Integrações oficiais (preparadas para o futuro)', () => {
  it('ficam indisponíveis sem credenciais e não fazem scraping', async () => {
    const service = new IfoodService();
    expect(service.isAvailable()).toBe(false);
    await expect(service.fetchOffers(product, IFOOD)).rejects.toThrow(/ainda não disponível/);
  });
});

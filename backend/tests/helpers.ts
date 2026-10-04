import type { PlatformInfo, ProductInfo, RawOffer } from '../src/types/domain.js';

export const platform = (slug: string, name: string, id: number): PlatformInfo => ({
  id,
  slug,
  name,
  logo: name.slice(0, 2),
  color: '#000000',
  textColor: '#FFFFFF',
  websiteUrl: `https://${slug}.example.com`,
  priority: id,
});

export const IFOOD = platform('ifood', 'iFood', 1);
export const FOOD99 = platform('99food', '99Food', 2);
export const KEETA = platform('keeta', 'Keeta', 3);

export const product: ProductInfo = {
  id: 1,
  name: 'Pizza Calabresa',
  description: 'Pizza grande',
  category: 'pizza',
  image: '🍕',
  restaurant: { id: 1, name: 'Pizzaria B', category: 'pizza', image: '🍕', rating: 4.7, address: 'Rua A' },
};

let nextId = 1;

/** Cria uma oferta crua a partir de valores em centavos. */
export function offer(p: PlatformInfo, values: Partial<RawOffer> & { productPrice: number }): RawOffer {
  return {
    offerId: nextId++,
    platform: p,
    deliveryFee: 0,
    additionalFee: 0,
    discount: 0,
    couponDiscount: 0,
    couponCode: null,
    promoLabel: null,
    deliveryTimeMin: 40,
    redirectUrl: `https://${p.slug}.example.com/pedido`,
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...values,
  };
}

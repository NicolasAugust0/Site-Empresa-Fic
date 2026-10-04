import { prisma } from '../../database/client.js';
import { calculateFinalPrice } from '../pricing/PriceCalculator.js';
import type { OfferInput } from './schemas.js';

/** Recalcula e persiste o preço final sempre que uma oferta é criada/alterada. */
function withFinalPrice<T extends Partial<OfferInput>>(data: T, current?: Partial<OfferInput>) {
  const merged = { ...current, ...data };
  const { finalPrice } = calculateFinalPrice({
    productPrice: merged.productPrice ?? 0,
    deliveryFee: merged.deliveryFee,
    additionalFee: merged.additionalFee,
    discount: merged.discount,
    couponDiscount: merged.couponDiscount,
  });
  return { ...data, finalPrice };
}

export const offerAdminService = {
  async list() {
    const offers = await prisma.offer.findMany({
      include: { platform: true, product: { include: { restaurant: true } } },
      orderBy: [{ productId: 'asc' }, { finalPrice: 'asc' }],
    });

    // Marca a melhor oferta (menor preço final) de cada produto
    const bestByProduct = new Map<number, number>();
    for (const o of offers) {
      if (!o.available) continue;
      const best = bestByProduct.get(o.productId);
      if (best === undefined || o.finalPrice < best) bestByProduct.set(o.productId, o.finalPrice);
    }
    return offers.map((o) => ({
      ...o,
      isBest: o.available && bestByProduct.get(o.productId) === o.finalPrice,
    }));
  },

  create(data: OfferInput) {
    return prisma.offer.create({ data: withFinalPrice(data) });
  },

  async update(id: number, data: Partial<OfferInput>) {
    const current = await prisma.offer.findUniqueOrThrow({ where: { id } });
    return prisma.offer.update({ where: { id }, data: withFinalPrice(data, current) });
  },

  remove(id: number) {
    return prisma.offer.delete({ where: { id } });
  },
};

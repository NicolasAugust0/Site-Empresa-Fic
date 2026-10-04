import { prisma } from '../client.js';
import { toRawOffer } from '../mappers.js';
import type { RawOffer } from '../../types/domain.js';

export const offerRepository = {
  /** Ofertas disponíveis de um produto em uma plataforma específica. */
  async findAvailable(productId: number, platformId: number): Promise<RawOffer[]> {
    const offers = await prisma.offer.findMany({
      where: { productId, platformId, available: true },
      include: { platform: true },
    });
    return offers.map((o) => toRawOffer(o, o.platform));
  },
};

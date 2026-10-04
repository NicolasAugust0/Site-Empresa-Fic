import { prisma } from '../client.js';
import { toProductInfo } from '../mappers.js';
import type { ProductInfo } from '../../types/domain.js';

export const productRepository = {
  async findById(id: number): Promise<ProductInfo | null> {
    const product = await prisma.product.findUnique({ where: { id }, include: { restaurant: true } });
    return product ? toProductInfo(product) : null;
  },

  async findAll(): Promise<ProductInfo[]> {
    const products = await prisma.product.findMany({ include: { restaurant: true }, orderBy: { name: 'asc' } });
    return products.map(toProductInfo);
  },

  async findByRestaurant(restaurantId: number): Promise<ProductInfo[]> {
    const products = await prisma.product.findMany({
      where: { restaurantId },
      include: { restaurant: true },
      orderBy: { name: 'asc' },
    });
    return products.map(toProductInfo);
  },
};

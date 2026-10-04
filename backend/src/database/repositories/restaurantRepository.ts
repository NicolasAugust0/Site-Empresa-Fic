import { prisma } from '../client.js';
import { toRestaurantInfo } from '../mappers.js';
import type { RestaurantInfo } from '../../types/domain.js';

export const restaurantRepository = {
  async findAll(): Promise<(RestaurantInfo & { productsCount: number })[]> {
    const restaurants = await prisma.restaurant.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });
    return restaurants.map((r) => ({ ...toRestaurantInfo(r), productsCount: r._count.products }));
  },

  async findById(id: number): Promise<RestaurantInfo | null> {
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    return restaurant ? toRestaurantInfo(restaurant) : null;
  },
};

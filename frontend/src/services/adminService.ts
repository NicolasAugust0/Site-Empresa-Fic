import type { AdminOffer, AdminPlatform, AdminProduct, AdminRestaurant } from '../types/api';
import { http } from './http';

function crud<T, Input>(resource: string) {
  return {
    list: () => http<T[]>(`/admin/${resource}`),
    create: (data: Input) => http<T>(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Input>) =>
      http<T>(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => http<void>(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export type RestaurantInput = Pick<AdminRestaurant, 'name' | 'category' | 'image' | 'rating' | 'address'>;
export type ProductInput = Pick<AdminProduct, 'restaurantId' | 'name' | 'description' | 'category' | 'image'>;
export type PlatformInput = Omit<AdminPlatform, 'id' | '_count'>;
export type OfferInput = Omit<AdminOffer, 'id' | 'finalPrice' | 'updatedAt' | 'isBest' | 'platform' | 'product'>;

export const adminService = {
  restaurants: crud<AdminRestaurant, RestaurantInput>('restaurants'),
  products: crud<AdminProduct, ProductInput>('products'),
  platforms: crud<AdminPlatform, PlatformInput>('platforms'),
  offers: crud<AdminOffer, OfferInput>('offers'),
};

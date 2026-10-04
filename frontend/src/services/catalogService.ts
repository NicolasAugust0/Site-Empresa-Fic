import type {
  Category,
  ComparisonResult,
  OverviewStats,
  Platform,
  ProductSummary,
  Restaurant,
  SearchResult,
  TieBreaker,
} from '../types/api';
import { http, toQuery } from './http';

export const catalogService = {
  categories: () => http<Category[]>('/categories'),
  search: (q: string, category?: string) => http<SearchResult>(`/search${toQuery({ q, category })}`),
  featured: (limit = 6) => http<ProductSummary[]>(`/products/featured${toQuery({ limit })}`),
  compare: (productId: number, tieBreaker?: TieBreaker) =>
    http<ComparisonResult>(`/products/${productId}/compare${toQuery({ tieBreaker })}`),
  restaurants: () => http<Restaurant[]>('/restaurants'),
  restaurant: (id: number) => http<{ restaurant: Restaurant; products: ProductSummary[] }>(`/restaurants/${id}`),
  platforms: () => http<Platform[]>('/platforms'),
  stats: () => http<OverviewStats>('/stats/overview'),
};

import { productRepository } from '../../database/repositories/productRepository.js';
import { restaurantRepository } from '../../database/repositories/restaurantRepository.js';
import type { ProductInfo, ProductSummary, RestaurantInfo } from '../../types/domain.js';
import { normalize } from '../../utils/text.js';
import { comparisonService } from '../comparison/ComparisonService.js';
import { findCategory } from './categories.js';

export interface SearchParams {
  query?: string;
  category?: string;
}

export interface SearchResult {
  query: string;
  category: string | null;
  products: ProductSummary[];
  restaurants: RestaurantInfo[];
  total: number;
}

function categoryTerms(slug: string): string {
  const category = findCategory(slug);
  return category ? [category.slug, category.label, ...category.aliases].join(' ') : slug;
}

/**
 * Pontua a relevância de um produto para os termos pesquisados.
 * Todos os termos precisam aparecer em algum campo; nome do produto pesa mais.
 */
export function scoreProduct(product: ProductInfo, terms: string[]): number {
  if (terms.length === 0) return 1;

  const name = normalize(product.name);
  const restaurant = normalize(product.restaurant.name);
  const category = normalize(`${categoryTerms(product.category)} ${categoryTerms(product.restaurant.category)}`);
  const description = normalize(product.description);
  const fullQuery = terms.join(' ');

  let score = 0;
  for (const term of terms) {
    if (name.includes(term)) score += 10;
    else if (restaurant.includes(term)) score += 6;
    else if (category.includes(term)) score += 4;
    else if (description.includes(term)) score += 1;
    else return 0; // termo não encontrado em nenhum campo
  }
  if (name === fullQuery) score += 20;
  else if (name.startsWith(fullQuery)) score += 8;
  if (restaurant === fullQuery) score += 10;
  return score;
}

export const searchService = {
  async search({ query = '', category }: SearchParams): Promise<SearchResult> {
    const terms = normalize(query).split(' ').filter(Boolean);
    const categorySlug = category && findCategory(category) ? category : null;

    const products = await productRepository.findAll();
    const matches = products
      .filter((p) => !categorySlug || p.category === categorySlug || p.restaurant.category === categorySlug)
      .map((p) => ({ product: p, score: scoreProduct(p, terms) }))
      .filter((m) => m.score > 0);

    const summaries = await comparisonService.summarizeMany(matches.map((m) => m.product));
    const scoreById = new Map(matches.map((m) => [m.product.id, m.score]));
    summaries.sort((a, b) => scoreById.get(b.id)! - scoreById.get(a.id)! || b.savings - a.savings);

    const restaurantIds = new Set(summaries.map((s) => s.restaurant.id));
    const allRestaurants = await restaurantRepository.findAll();
    const restaurants = allRestaurants.filter((r) => {
      if (categorySlug && r.category !== categorySlug && !restaurantIds.has(r.id)) return false;
      if (terms.length === 0) return true;
      const haystack = normalize(`${r.name} ${categoryTerms(r.category)}`);
      return terms.every((t) => haystack.includes(t)) || (categorySlug !== null && restaurantIds.has(r.id));
    });

    return {
      query,
      category: categorySlug,
      products: summaries,
      restaurants,
      total: summaries.length,
    };
  },
};

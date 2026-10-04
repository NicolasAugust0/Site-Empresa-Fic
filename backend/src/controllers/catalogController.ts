import type { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { productRepository } from '../database/repositories/productRepository.js';
import { restaurantRepository } from '../database/repositories/restaurantRepository.js';
import { platformRepository } from '../database/repositories/platformRepository.js';
import { comparisonService } from '../services/comparison/ComparisonService.js';
import { isTieBreaker } from '../services/ranking/ranking.js';
import { CATEGORIES } from '../services/search/categories.js';
import { searchService } from '../services/search/SearchService.js';
import { HttpError, parseId } from '../utils/http.js';

export const catalogController = {
  async categories(_req: Request, res: Response) {
    const products = await prisma.product.groupBy({ by: ['category'], _count: { _all: true } });
    const counts = new Map(products.map((p) => [p.category, p._count._all]));
    res.json(CATEGORIES.map(({ aliases: _aliases, ...c }) => ({ ...c, productsCount: counts.get(c.slug) ?? 0 })));
  },

  async search(req: Request, res: Response) {
    const query = typeof req.query.q === 'string' ? req.query.q.slice(0, 100) : '';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    res.json(await searchService.search({ query, category }));
  },

  async featured(req: Request, res: Response) {
    const limit = Math.min(Number(req.query.limit) || 6, 20);
    const summaries = await comparisonService.summarizeMany(await productRepository.findAll());
    res.json(
      summaries
        .filter((s) => s.offersCount > 1)
        .sort((a, b) => b.savings - a.savings)
        .slice(0, limit),
    );
  },

  async compare(req: Request, res: Response) {
    const productId = parseId(req.params.id);
    const tieBreaker = isTieBreaker(req.query.tieBreaker) ? req.query.tieBreaker : undefined;
    const result = await comparisonService.compareProduct(productId, tieBreaker);
    if (!result) throw new HttpError(404, 'Produto não encontrado.');
    res.json(result);
  },

  async restaurants(_req: Request, res: Response) {
    res.json(await restaurantRepository.findAll());
  },

  async restaurant(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) throw new HttpError(404, 'Restaurante não encontrado.');
    const products = await comparisonService.summarizeMany(await productRepository.findByRestaurant(id));
    res.json({ restaurant, products });
  },

  async platforms(_req: Request, res: Response) {
    res.json(await platformRepository.findActive());
  },
};

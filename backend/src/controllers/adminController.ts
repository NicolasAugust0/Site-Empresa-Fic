import type { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { offerAdminService } from '../services/admin/offerAdminService.js';
import { offerSchema, platformSchema, productSchema, restaurantSchema } from '../services/admin/schemas.js';
import { parseId } from '../utils/http.js';

export const adminController = {
  // Restaurantes
  listRestaurants: async (_req: Request, res: Response) => {
    res.json(
      await prisma.restaurant.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
    );
  },
  createRestaurant: async (req: Request, res: Response) => {
    res.status(201).json(await prisma.restaurant.create({ data: restaurantSchema.parse(req.body) }));
  },
  updateRestaurant: async (req: Request, res: Response) => {
    res.json(
      await prisma.restaurant.update({
        where: { id: parseId(req.params.id) },
        data: restaurantSchema.partial().parse(req.body),
      }),
    );
  },
  deleteRestaurant: async (req: Request, res: Response) => {
    await prisma.restaurant.delete({ where: { id: parseId(req.params.id) } });
    res.status(204).end();
  },

  // Produtos
  listProducts: async (_req: Request, res: Response) => {
    res.json(
      await prisma.product.findMany({
        include: { restaurant: { select: { id: true, name: true } }, _count: { select: { offers: true } } },
        orderBy: [{ restaurantId: 'asc' }, { name: 'asc' }],
      }),
    );
  },
  createProduct: async (req: Request, res: Response) => {
    res.status(201).json(await prisma.product.create({ data: productSchema.parse(req.body) }));
  },
  updateProduct: async (req: Request, res: Response) => {
    res.json(
      await prisma.product.update({
        where: { id: parseId(req.params.id) },
        data: productSchema.partial().parse(req.body),
      }),
    );
  },
  deleteProduct: async (req: Request, res: Response) => {
    await prisma.product.delete({ where: { id: parseId(req.params.id) } });
    res.status(204).end();
  },

  // Plataformas
  listPlatforms: async (_req: Request, res: Response) => {
    res.json(
      await prisma.platform.findMany({
        include: { _count: { select: { offers: true } } },
        orderBy: { priority: 'asc' },
      }),
    );
  },
  createPlatform: async (req: Request, res: Response) => {
    res.status(201).json(await prisma.platform.create({ data: platformSchema.parse(req.body) }));
  },
  updatePlatform: async (req: Request, res: Response) => {
    res.json(
      await prisma.platform.update({
        where: { id: parseId(req.params.id) },
        data: platformSchema.partial().parse(req.body),
      }),
    );
  },
  deletePlatform: async (req: Request, res: Response) => {
    await prisma.platform.delete({ where: { id: parseId(req.params.id) } });
    res.status(204).end();
  },

  // Ofertas
  listOffers: async (_req: Request, res: Response) => {
    res.json(await offerAdminService.list());
  },
  createOffer: async (req: Request, res: Response) => {
    res.status(201).json(await offerAdminService.create(offerSchema.parse(req.body)));
  },
  updateOffer: async (req: Request, res: Response) => {
    res.json(await offerAdminService.update(parseId(req.params.id), offerSchema.partial().parse(req.body)));
  },
  deleteOffer: async (req: Request, res: Response) => {
    await offerAdminService.remove(parseId(req.params.id));
    res.status(204).end();
  },
};

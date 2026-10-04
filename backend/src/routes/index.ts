import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { catalogController } from '../controllers/catalogController.js';
import { redirectController } from '../controllers/redirectController.js';
import { statsController } from '../controllers/statsController.js';
import { asyncHandler as h } from '../utils/http.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ComparaFood' });
});

// Catálogo, busca e comparação
apiRouter.get('/categories', h(catalogController.categories));
apiRouter.get('/search', h(catalogController.search));
apiRouter.get('/products/featured', h(catalogController.featured));
apiRouter.get('/products/:id/compare', h(catalogController.compare));
apiRouter.get('/restaurants', h(catalogController.restaurants));
apiRouter.get('/restaurants/:id', h(catalogController.restaurant));
apiRouter.get('/platforms', h(catalogController.platforms));
apiRouter.get('/stats/overview', h(statsController.overview));

// Redirecionamento para a plataforma (com registro de clique)
apiRouter.get('/redirect/:offerId', h(redirectController.redirect));

// Área administrativa (demonstração — sem autenticação no MVP)
const admin = Router();
admin.get('/restaurants', h(adminController.listRestaurants));
admin.post('/restaurants', h(adminController.createRestaurant));
admin.put('/restaurants/:id', h(adminController.updateRestaurant));
admin.delete('/restaurants/:id', h(adminController.deleteRestaurant));

admin.get('/products', h(adminController.listProducts));
admin.post('/products', h(adminController.createProduct));
admin.put('/products/:id', h(adminController.updateProduct));
admin.delete('/products/:id', h(adminController.deleteProduct));

admin.get('/platforms', h(adminController.listPlatforms));
admin.post('/platforms', h(adminController.createPlatform));
admin.put('/platforms/:id', h(adminController.updatePlatform));
admin.delete('/platforms/:id', h(adminController.deletePlatform));

admin.get('/offers', h(adminController.listOffers));
admin.post('/offers', h(adminController.createOffer));
admin.put('/offers/:id', h(adminController.updateOffer));
admin.delete('/offers/:id', h(adminController.deleteOffer));

apiRouter.use('/admin', admin);

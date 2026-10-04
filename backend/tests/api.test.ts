import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/database/client.js';

const app = createApp();

afterAll(() => prisma.$disconnect());

async function findProductId(query: string): Promise<number> {
  const res = await request(app).get('/api/search').query({ q: query });
  return res.body.products[0].id;
}

describe('API — fluxo de demonstração', () => {
  it('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('pesquisa "Pizza Calabresa" e encontra a Pizzaria B em primeiro lugar', async () => {
    const res = await request(app).get('/api/search').query({ q: 'Pizza Calabresa' });
    expect(res.status).toBe(200);
    expect(res.body.products[0]).toMatchObject({
      name: 'Pizza Calabresa',
      restaurant: { name: 'Pizzaria B' },
      bestPrice: 3790,
      savings: 1500,
      bestPlatform: { name: '99Food' },
    });
  });

  it('pesquisa por restaurante e por categoria', async () => {
    const byRestaurant = await request(app).get('/api/search').query({ q: 'pizzaria b' });
    expect(byRestaurant.body.restaurants.map((r: { name: string }) => r.name)).toContain('Pizzaria B');
    expect(byRestaurant.body.products.length).toBeGreaterThanOrEqual(4);

    const byCategory = await request(app).get('/api/search').query({ q: 'hambúrguer' });
    expect(byCategory.body.products.length).toBeGreaterThan(0);

    const combo = await request(app).get('/api/search').query({ q: 'Combo Bacon' });
    expect(combo.body.products[0].name).toBe('Combo Bacon');

    const filtered = await request(app).get('/api/search').query({ category: 'bebidas' });
    expect(filtered.body.products.every((p: { category: string }) => p.category === 'bebidas')).toBe(true);
  });

  it('compara a Pizza Calabresa entre iFood, 99Food e Keeta', async () => {
    const id = await findProductId('Pizza Calabresa');
    const res = await request(app).get(`/api/products/${id}/compare`);
    expect(res.status).toBe(200);
    expect(res.body.offers.map((o: { platform: { name: string }; finalPrice: number }) => [o.platform.name, o.finalPrice])).toEqual([
      ['99Food', 3790],
      ['Keeta', 4890],
      ['iFood', 5290],
    ]);
    expect(res.body.bestOffer.platform.name).toBe('99Food');
    expect(res.body.savings).toBe(1500);
    expect(res.body.indicators.platformsCompared).toBe(3);
  });

  it('aplica o critério de desempate escolhido (X-Burger Clássico)', async () => {
    const id = await findProductId('X-Burger Clássico');
    const tie = await request(app).get(`/api/products/${id}/compare`).query({ tieBreaker: 'none' });
    expect(tie.body.isTie).toBe(true);
    expect(tie.body.message).toMatch(/^Empate!/);

    const resolved = await request(app).get(`/api/products/${id}/compare`).query({ tieBreaker: 'deliveryTime' });
    expect(resolved.body.bestOffer.platform.name).toBe('iFood');
  });

  it('informa quando só existe uma oferta (Milkshake)', async () => {
    const id = await findProductId('Milkshake');
    const res = await request(app).get(`/api/products/${id}/compare`);
    expect(res.body.offers).toHaveLength(1);
    expect(res.body.message).toMatch(/Apenas uma oferta/);
  });

  it('redireciona para a plataforma e registra o clique', async () => {
    const id = await findProductId('Pizza Calabresa');
    const { body } = await request(app).get(`/api/products/${id}/compare`);
    const before = await prisma.clickEvent.count();

    const res = await request(app).get(body.bestOffer.redirectPath);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(`/pedido-simulado?plataforma=99food&produto=${id}`);
    expect(await prisma.clickEvent.count()).toBe(before + 1);
  });

  it('retorna 404 para produto inexistente e 400 para id inválido', async () => {
    expect((await request(app).get('/api/products/99999/compare')).status).toBe(404);
    expect((await request(app).get('/api/products/abc/compare')).status).toBe(400);
  });
});

describe('API — área administrativa', () => {
  it('altera uma oferta e recalcula o preço final e o vencedor', async () => {
    const id = await findProductId('Pizza Calabresa');
    const offers = (await request(app).get('/api/admin/offers')).body as Array<{
      id: number;
      productId: number;
      platform: { slug: string };
    }>;
    const keeta = offers.find((o) => o.productId === id && o.platform.slug === 'keeta')!;

    const updated = await request(app).put(`/api/admin/offers/${keeta.id}`).send({ discount: 2000 });
    expect(updated.status).toBe(200);
    expect(updated.body.finalPrice).toBe(4790 + 600 - 2000); // R$ 33,90

    const compare = await request(app).get(`/api/products/${id}/compare`);
    expect(compare.body.bestOffer.platform.name).toBe('Keeta');
  });

  it('valida os dados enviados', async () => {
    const res = await request(app).post('/api/admin/offers').send({ productId: 1, platformId: 1, productPrice: -10 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Dados inválidos.');
  });

  it('cadastra restaurante, produto e oferta', async () => {
    const restaurant = await request(app)
      .post('/api/admin/restaurants')
      .send({ name: 'Açaí da Praça', category: 'bebidas', image: '🍇', rating: 4.3, address: 'Praça Central, 1' });
    expect(restaurant.status).toBe(201);

    const product = await request(app)
      .post('/api/admin/products')
      .send({ restaurantId: restaurant.body.id, name: 'Açaí 500ml', category: 'bebidas', image: '🍇' });
    expect(product.status).toBe(201);

    const platforms = (await request(app).get('/api/platforms')).body as Array<{ id: number }>;
    const offer = await request(app).post('/api/admin/offers').send({
      productId: product.body.id,
      platformId: platforms[0].id,
      productPrice: 2200,
      deliveryFee: 500,
      redirectUrl: 'https://www.example.com/acai',
    });
    expect(offer.status).toBe(201);
    expect(offer.body.finalPrice).toBe(2700);

    const duplicate = await request(app).post('/api/admin/offers').send({
      productId: product.body.id,
      platformId: platforms[0].id,
      productPrice: 2200,
      redirectUrl: 'https://www.example.com/acai',
    });
    expect(duplicate.status).toBe(409);
  });

  it('GET /api/stats/overview retorna indicadores por plataforma', async () => {
    const res = await request(app).get('/api/stats/overview');
    expect(res.status).toBe(200);
    expect(res.body.platforms).toHaveLength(3);
    expect(res.body.totals.products).toBeGreaterThanOrEqual(21);
    expect(res.body.totalPotentialSavings).toBeGreaterThan(0);
  });
});

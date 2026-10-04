import { describe, expect, it } from 'vitest';
import { buildComparison } from '../src/services/comparison/buildComparison.js';
import { ComparisonService } from '../src/services/comparison/ComparisonService.js';
import { rankOffers } from '../src/services/ranking/ranking.js';
import { calculateFinalPrice } from '../src/services/pricing/PriceCalculator.js';
import { FOOD99, IFOOD, KEETA, offer, product } from './helpers.js';

/** Exemplo do documento: Pizzaria B — Pizza Calabresa. */
const calabresaOffers = () => [
  offer(IFOOD, { productPrice: 4990, deliveryFee: 800, discount: 500 }),
  offer(FOOD99, { productPrice: 4990, deliveryFee: 300, discount: 1500 }),
  offer(KEETA, { productPrice: 4790, deliveryFee: 600, discount: 500 }),
];

describe('Caso 1 — produto disponível em 3 plataformas', () => {
  const result = buildComparison(product, calabresaOffers(), 'none');

  it('identifica a plataforma com menor preço final como vencedora', () => {
    expect(result.bestOffer?.platform.name).toBe('99Food');
    expect(result.bestOffer?.finalPrice).toBe(3790);
  });

  it('ordena do mais barato ao mais caro', () => {
    expect(result.offers.map((o) => [o.position, o.platform.name, o.finalPrice])).toEqual([
      [1, '99Food', 3790],
      [2, 'Keeta', 4890],
      [3, 'iFood', 5290],
    ]);
  });

  it('calcula a economia em relação à opção mais cara e os indicadores', () => {
    expect(result.savings).toBe(1500);
    expect(result.indicators).toMatchObject({
      bestPrice: 3790,
      worstPrice: 5290,
      maxSavings: 1500,
      platformsCompared: 3,
      biggestDiscount: 1500,
      biggestDiscountPlatform: '99Food',
    });
    expect(result.message).toContain('R$ 15,00');
  });

  it('adiciona badges de melhor preço e economia apenas na vencedora', () => {
    const labels = result.bestOffer!.badges.map((b) => b.label);
    expect(labels).toContain('🏆 Melhor preço');
    expect(labels).toContain('💰 Economize R$ 15,00');
    expect(result.offers[1].badges.some((b) => b.type === 'best')).toBe(false);
  });

  it('gera o caminho de redirecionamento de cada oferta', () => {
    expect(result.bestOffer?.redirectPath).toBe(`/api/redirect/${result.bestOffer?.offerId}`);
  });
});

describe('Caso 2 — preço maior, mas desconto maior', () => {
  it('considera o preço final e não apenas o preço original', () => {
    const result = buildComparison(product, [
      offer(IFOOD, { productPrice: 6990, deliveryFee: 799, discount: 1000 }), // 67,89
      offer(FOOD99, { productPrice: 7290, deliveryFee: 0, discount: 1500 }), // 57,90 — produto mais caro
      offer(KEETA, { productPrice: 6690, deliveryFee: 899 }), // 75,89 — produto mais barato
    ]);
    expect(result.bestOffer?.platform.name).toBe('99Food');
    expect(result.bestOffer?.finalPrice).toBe(5790);
    expect(result.offers.at(-1)?.platform.name).toBe('Keeta');
  });
});

describe('Caso 3 — produto barato, mas frete muito alto', () => {
  it('inclui o frete no preço final', () => {
    const result = buildComparison(product, [
      offer(IFOOD, { productPrice: 4690, deliveryFee: 0 }), // 46,90 — frete grátis
      offer(KEETA, { productPrice: 3990, deliveryFee: 1500 }), // 54,90 — produto barato, frete alto
    ]);
    expect(result.bestOffer?.platform.name).toBe('iFood');
    expect(result.bestOffer?.badges.map((b) => b.type)).toContain('free-delivery');
    expect(result.savings).toBe(800);
  });
});

describe('Caso 4 — duas plataformas com o mesmo preço final', () => {
  const tied = () => [
    offer(IFOOD, { productPrice: 2990, deliveryFee: 599, deliveryTimeMin: 45 }),
    offer(FOOD99, { productPrice: 2990, deliveryFee: 599, deliveryTimeMin: 30 }),
    offer(KEETA, { productPrice: 3290, deliveryFee: 499, deliveryTimeMin: 35 }),
  ];

  it('sem critério secundário: apresenta empate', () => {
    const result = buildComparison(product, tied(), 'none');
    expect(result.isTie).toBe(true);
    expect(result.tiedPlatforms.sort()).toEqual(['99Food', 'iFood']);
    expect(result.offers.filter((o) => o.position === 1)).toHaveLength(2);
    expect(result.message).toMatch(/^Empate!/);
    expect(result.bestOffer?.badges.map((b) => b.type)).toContain('tie');
  });

  it('com critério configurável (menor tempo de entrega): escolhe um vencedor', () => {
    const result = buildComparison(product, tied(), 'deliveryTime');
    expect(result.isTie).toBe(true);
    expect(result.bestOffer?.platform.name).toBe('99Food');
    expect(result.offers.map((o) => o.position)).toEqual([1, 2, 3]);
    expect(result.message).toContain('menor tempo de entrega');
  });

  it('quando o critério secundário também empata, mantém o empate', () => {
    const result = buildComparison(
      product,
      [offer(IFOOD, { productPrice: 1000, deliveryTimeMin: 30 }), offer(FOOD99, { productPrice: 1000, deliveryTimeMin: 30 })],
      'deliveryTime',
    );
    expect(result.offers.every((o) => o.position === 1)).toBe(true);
    expect(result.message).toMatch(/^Empate!/);
  });
});

describe('Caso 5 — produto disponível em apenas uma plataforma', () => {
  it('informa que apenas uma oferta foi encontrada', () => {
    const result = buildComparison(product, [offer(IFOOD, { productPrice: 1890, deliveryFee: 599 })]);
    expect(result.offers).toHaveLength(1);
    expect(result.bestOffer?.platform.name).toBe('iFood');
    expect(result.savings).toBe(0);
    expect(result.message).toBe('Apenas uma oferta foi encontrada para este produto (iFood).');
  });

  it('sem ofertas: retorna resultado vazio sem erro', () => {
    const result = buildComparison(product, []);
    expect(result.bestOffer).toBeNull();
    expect(result.message).toMatch(/Nenhuma oferta/);
  });
});

describe('rankOffers', () => {
  it('desempata por menor taxa de entrega quando configurado', () => {
    const priced = [
      offer(IFOOD, { productPrice: 2000, deliveryFee: 500 }),
      offer(KEETA, { productPrice: 2500, deliveryFee: 0 }),
    ].map((o) => ({ ...o, breakdown: calculateFinalPrice(o) }));
    expect(rankOffers(priced, 'deliveryFee').map((o) => o.platform.name)).toEqual(['Keeta', 'iFood']);
    expect(rankOffers(priced, 'productPrice').map((o) => o.platform.name)).toEqual(['iFood', 'Keeta']);
  });
});

describe('ComparisonService (fonte de dados injetada)', () => {
  it('compareProduct busca o produto e as ofertas via PlatformService', async () => {
    const service = new ComparisonService({
      findProduct: async (id) => (id === product.id ? product : null),
      platformService: { getOffersForProduct: async () => calabresaOffers() },
      defaultTieBreaker: 'none',
    });

    const result = await service.compareProduct(product.id);
    expect(result?.product.name).toBe('Pizza Calabresa');
    expect(result?.bestOffer?.platform.slug).toBe('99food');
    expect(await service.compareProduct(999)).toBeNull();

    const summary = await service.summarize(product);
    expect(summary).toMatchObject({ offersCount: 3, bestPrice: 3790, worstPrice: 5290, savings: 1500 });
  });
});

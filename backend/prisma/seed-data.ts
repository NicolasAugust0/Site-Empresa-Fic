/**
 * Dados SIMULADOS para demonstração (valores em reais; o seed converte para centavos).
 *
 * Cenários propositais:
 *  - Pizza Calabresa: exemplo da apresentação (99Food vence com R$ 37,90).
 *  - Pizza Margherita: Keeta tem o produto mais barato, mas frete alto → perde.
 *  - Balde de Frango: 99Food tem o produto mais caro, mas o maior desconto → vence.
 *  - X-Burger Clássico: empate de preço final entre iFood e 99Food (desempate configurável).
 *  - Milkshake Ovomaltine: disponível em apenas uma plataforma.
 *  - Várias ofertas com frete grátis, cupons e promoções.
 */

export const platforms = [
  {
    slug: 'ifood',
    name: 'iFood',
    logo: 'iF',
    color: '#EA1D2C',
    textColor: '#FFFFFF',
    websiteUrl: 'https://www.ifood.com.br',
    priority: 1,
  },
  {
    slug: '99food',
    name: '99Food',
    logo: '99',
    color: '#FFC21A',
    textColor: '#1F2937',
    websiteUrl: 'https://99app.com',
    priority: 2,
  },
  {
    slug: 'keeta',
    name: 'Keeta',
    logo: 'K',
    color: '#111827',
    textColor: '#FFD600',
    websiteUrl: 'https://www.keeta.com',
    priority: 3,
  },
] as const;

type PlatformSlug = (typeof platforms)[number]['slug'];

export interface SeedOffer {
  price: number;
  delivery: number;
  fee?: number;
  discount?: number;
  coupon?: number;
  couponCode?: string;
  promo?: string;
  time: number;
}

export interface SeedProduct {
  name: string;
  description: string;
  category: string;
  image: string;
  offers: Partial<Record<PlatformSlug, SeedOffer>>;
}

export interface SeedRestaurant {
  name: string;
  category: string;
  image: string;
  rating: number;
  address: string;
  products: SeedProduct[];
}

export const restaurants: SeedRestaurant[] = [
  {
    name: 'Pizzaria B',
    category: 'pizza',
    image: '🍕',
    rating: 4.7,
    address: 'Rua das Flores, 120 — Centro',
    products: [
      {
        name: 'Pizza Calabresa',
        description: 'Pizza grande (8 fatias) com calabresa fatiada, cebola roxa, mussarela e orégano.',
        category: 'pizza',
        image: '🍕',
        offers: {
          ifood: { price: 49.9, delivery: 8, discount: 5, time: 45 },
          '99food': { price: 49.9, delivery: 3, discount: 15, promo: 'Promoção da semana', time: 50 },
          keeta: { price: 47.9, delivery: 6, discount: 5, time: 40 },
        },
      },
      {
        name: 'Pizza Margherita',
        description: 'Molho de tomate artesanal, mussarela de búfala, tomate e manjericão fresco.',
        category: 'pizza',
        image: '🍅',
        offers: {
          ifood: { price: 46.9, delivery: 0, time: 45 },
          '99food': { price: 46.9, delivery: 5.99, discount: 4, time: 50 },
          keeta: { price: 44.9, delivery: 7.5, fee: 0.99, time: 40 },
        },
      },
      {
        name: 'Pizza Portuguesa',
        description: 'Presunto, ovos, cebola, ervilha, azeitonas e mussarela.',
        category: 'pizza',
        image: '🫒',
        offers: {
          ifood: { price: 54.9, delivery: 7.99, coupon: 10, couponCode: 'PIZZA10', time: 45 },
          '99food': { price: 56.9, delivery: 4.99, discount: 8, time: 50 },
          keeta: { price: 54.9, delivery: 0, discount: 2, time: 42 },
        },
      },
      {
        name: 'Coca-Cola 2L',
        description: 'Refrigerante Coca-Cola garrafa 2 litros.',
        category: 'bebidas',
        image: '🥤',
        offers: {
          ifood: { price: 14.9, delivery: 8, time: 45 },
          keeta: { price: 13.9, delivery: 6, time: 40 },
        },
      },
    ],
  },
  {
    name: 'Burger House',
    category: 'hamburguer',
    image: '🍔',
    rating: 4.8,
    address: 'Av. Paulista, 1500 — Bela Vista',
    products: [
      {
        name: 'Combo Bacon',
        description: 'Hambúrguer 180g com bacon crocante, cheddar, batata média e refrigerante lata.',
        category: 'combos',
        image: '🥓',
        offers: {
          ifood: { price: 42.9, delivery: 6.99, fee: 0.99, discount: 5, time: 35 },
          '99food': { price: 44.9, delivery: 0, discount: 6, coupon: 4, couponCode: 'BACON4', time: 40 },
          keeta: { price: 39.9, delivery: 9.99, time: 38 },
        },
      },
      {
        name: 'X-Burger Clássico',
        description: 'Pão brioche, hambúrguer 150g, queijo prato, alface, tomate e molho da casa.',
        category: 'hamburguer',
        image: '🍔',
        offers: {
          ifood: { price: 29.9, delivery: 5.99, time: 35 },
          '99food': { price: 29.9, delivery: 5.99, time: 45 },
          keeta: { price: 32.9, delivery: 4.99, time: 38 },
        },
      },
      {
        name: 'Smash Burger Duplo',
        description: 'Dois smash burgers de 90g, cheddar duplo, cebola caramelizada e picles.',
        category: 'hamburguer',
        image: '🧀',
        offers: {
          ifood: { price: 34.9, delivery: 0, fee: 0.99, time: 35 },
          '99food': { price: 36.9, delivery: 2.99, discount: 7, promo: 'Smash Week', time: 42 },
        },
      },
      {
        name: 'Milkshake Ovomaltine',
        description: 'Milkshake cremoso de 500ml com Ovomaltine crocante.',
        category: 'bebidas',
        image: '🥛',
        offers: {
          ifood: { price: 18.9, delivery: 5.99, time: 35 },
        },
      },
    ],
  },
  {
    name: 'Frango Express',
    category: 'frango',
    image: '🍗',
    rating: 4.5,
    address: 'Rua Augusta, 845 — Consolação',
    products: [
      {
        name: 'Balde de Frango 12 pedaços',
        description: 'Frango frito crocante temperado com a receita da casa. Serve 3 a 4 pessoas.',
        category: 'frango',
        image: '🍗',
        offers: {
          ifood: { price: 69.9, delivery: 7.99, discount: 10, time: 40 },
          '99food': { price: 72.9, delivery: 0, discount: 15, promo: 'Balde em dobro de economia', time: 45 },
          keeta: { price: 66.9, delivery: 8.99, time: 35 },
        },
      },
      {
        name: 'Combo Frango Crocante',
        description: 'Sanduíche de frango crocante, batata pequena e refrigerante.',
        category: 'combos',
        image: '🍟',
        offers: {
          ifood: { price: 32.9, delivery: 4.99, time: 40 },
          keeta: { price: 32.9, delivery: 0, discount: 3, time: 35 },
        },
      },
      {
        name: 'Tirinhas de Frango',
        description: '300g de tirinhas empanadas com molho barbecue.',
        category: 'frango',
        image: '🥢',
        offers: {
          '99food': { price: 24.9, delivery: 3.99, time: 45 },
          keeta: { price: 22.9, delivery: 3.99, fee: 1.5, time: 35 },
        },
      },
      {
        name: 'Suco Natural de Laranja 500ml',
        description: 'Suco de laranja natural, sem açúcar.',
        category: 'bebidas',
        image: '🍊',
        offers: {
          ifood: { price: 11.9, delivery: 4.99, time: 40 },
          '99food': { price: 12.9, delivery: 0, time: 45 },
        },
      },
    ],
  },
  {
    name: 'Mega Lanches',
    category: 'lanches',
    image: '🌮',
    rating: 4.4,
    address: 'Rua Voluntários da Pátria, 300 — Santana',
    products: [
      {
        name: 'X-Tudo',
        description: 'Hambúrguer, presunto, queijo, ovo, bacon, salsicha, alface, tomate e milho.',
        category: 'lanches',
        image: '🥪',
        offers: {
          ifood: { price: 27.9, delivery: 4.99, time: 30 },
          '99food': { price: 27.9, delivery: 4.99, coupon: 5, couponCode: 'MEGA5', time: 35 },
          keeta: { price: 25.9, delivery: 4.99, time: 32 },
        },
      },
      {
        name: 'Misto Quente',
        description: 'Pão de forma na chapa com presunto e queijo.',
        category: 'lanches',
        image: '🥖',
        offers: {
          ifood: { price: 12.9, delivery: 0, time: 30 },
          '99food': { price: 12.9, delivery: 2.99, time: 35 },
        },
      },
      {
        name: 'Hot Dog Completo',
        description: 'Duas salsichas, purê, vinagrete, milho, batata palha e molhos.',
        category: 'lanches',
        image: '🌭',
        offers: {
          '99food': { price: 16.9, delivery: 3.99, discount: 4, time: 35 },
          keeta: { price: 15.9, delivery: 4.99, time: 32 },
        },
      },
      {
        name: 'Combo Mega Família',
        description: '4 X-Salada, 2 porções de batata grande e refrigerante 2L.',
        category: 'combos',
        image: '👨‍👩‍👧‍👦',
        offers: {
          ifood: { price: 89.9, delivery: 9.99, discount: 20, promo: 'Combo família', time: 40 },
          '99food': { price: 89.9, delivery: 6.99, discount: 12, time: 45 },
          keeta: { price: 84.9, delivery: 0, discount: 5, time: 38 },
        },
      },
    ],
  },
  {
    name: 'Sushi House',
    category: 'japonesa',
    image: '🍣',
    rating: 4.9,
    address: 'Rua Galvão Bueno, 50 — Liberdade',
    products: [
      {
        name: 'Combo Sushi 30 peças',
        description: 'Sashimis, niguiris, uramakis e hossomakis variados.',
        category: 'combos',
        image: '🍱',
        offers: {
          ifood: { price: 89.9, delivery: 9.9, discount: 15, time: 55 },
          '99food': { price: 94.9, delivery: 0, discount: 20, promo: 'Festival japonês', time: 60 },
          keeta: { price: 87.9, delivery: 7.9, discount: 10, time: 50 },
        },
      },
      {
        name: 'Temaki de Salmão',
        description: 'Cone de alga com arroz, salmão fresco e cream cheese.',
        category: 'japonesa',
        image: '🍣',
        offers: {
          ifood: { price: 32.9, delivery: 9.9, time: 55 },
          keeta: { price: 29.9, delivery: 7.9, discount: 5, time: 50 },
        },
      },
      {
        name: 'Hot Roll 10 peças',
        description: 'Uramaki empanado de salmão com cream cheese e tarê.',
        category: 'japonesa',
        image: '🔥',
        offers: {
          ifood: { price: 28.9, delivery: 9.9, coupon: 8, couponCode: 'SUSHI8', time: 55 },
          '99food': { price: 28.9, delivery: 6.9, time: 60 },
          keeta: { price: 27.9, delivery: 7.9, fee: 0.99, time: 50 },
        },
      },
    ],
  },
  {
    name: 'Brasa Burger',
    category: 'hamburguer',
    image: '🔥',
    rating: 4.6,
    address: 'Rua Teodoro Sampaio, 980 — Pinheiros',
    products: [
      {
        name: 'Burger Costela',
        description: 'Blend de costela 200g, queijo coalho, cebola crispy e barbecue de rapadura.',
        category: 'hamburguer',
        image: '🍔',
        offers: {
          ifood: { price: 38.9, delivery: 5.99, discount: 6, time: 40 },
          '99food': { price: 39.9, delivery: 4.99, discount: 4, time: 45 },
          keeta: { price: 38.9, delivery: 0, discount: 2, promo: 'Frete grátis', time: 42 },
        },
      },
      {
        name: 'Combo Brasa Duplo',
        description: 'Dois burgers clássicos, batata grande e dois refrigerantes.',
        category: 'combos',
        image: '🍟',
        offers: {
          ifood: { price: 64.9, delivery: 5.99, time: 40 },
          '99food': { price: 64.9, delivery: 4.99, discount: 10, coupon: 5, couponCode: 'BRASA5', time: 45 },
          keeta: { price: 61.9, delivery: 6.99, discount: 3, time: 42 },
        },
      },
    ],
  },
];

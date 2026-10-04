/**
 * Tipos de domínio do ComparaFood.
 * Todos os valores monetários estão em CENTAVOS.
 */

export interface PlatformInfo {
  id: number;
  slug: string;
  name: string;
  logo: string;
  color: string;
  textColor: string;
  websiteUrl: string;
  priority: number;
}

export interface RestaurantInfo {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  address: string;
}

export interface ProductInfo {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  restaurant: RestaurantInfo;
}

/** Oferta "crua", como vem de uma fonte de dados (mock ou API oficial). */
export interface RawOffer {
  offerId: number;
  platform: PlatformInfo;
  productPrice: number;
  deliveryFee: number;
  additionalFee: number;
  discount: number;
  couponDiscount: number;
  couponCode: string | null;
  promoLabel: string | null;
  deliveryTimeMin: number;
  redirectUrl: string;
  updatedAt: Date;
}

export interface PriceBreakdown {
  productPrice: number;
  deliveryFee: number;
  additionalFee: number;
  discount: number;
  couponDiscount: number;
  /** Soma de descontos efetivamente aplicada (limitada ao subtotal). */
  totalDiscount: number;
  subtotal: number;
  finalPrice: number;
}

export type BadgeType = 'best' | 'promo' | 'free-delivery' | 'coupon' | 'savings' | 'tie' | 'fastest';

export interface Badge {
  type: BadgeType;
  label: string;
}

export interface RankedOffer {
  position: number;
  offerId: number;
  platform: PlatformInfo;
  breakdown: PriceBreakdown;
  finalPrice: number;
  /** Diferença para a melhor oferta (0 para a vencedora). */
  differenceFromBest: number;
  couponCode: string | null;
  promoLabel: string | null;
  deliveryTimeMin: number;
  redirectUrl: string;
  redirectPath: string;
  updatedAt: string;
  isBest: boolean;
  isTied: boolean;
  badges: Badge[];
}

export type TieBreaker = 'none' | 'deliveryTime' | 'deliveryFee' | 'productPrice';

export interface ComparisonIndicators {
  bestPrice: number;
  worstPrice: number;
  averagePrice: number;
  maxSavings: number;
  platformsCompared: number;
  biggestDiscount: number;
  biggestDiscountPlatform: string | null;
}

export interface ComparisonResult {
  product: ProductInfo;
  offers: RankedOffer[];
  bestOffer: RankedOffer | null;
  /** Economia ao escolher a melhor oferta em vez da mais cara. */
  savings: number;
  isTie: boolean;
  tieBreaker: TieBreaker;
  tiedPlatforms: string[];
  indicators: ComparisonIndicators;
  message: string;
}

/** Resumo usado em listagens (busca, destaques, restaurante). */
export interface ProductSummary {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  restaurant: RestaurantInfo;
  offersCount: number;
  bestPrice: number | null;
  worstPrice: number | null;
  savings: number;
  bestPlatform: PlatformInfo | null;
  hasFreeDelivery: boolean;
  hasPromo: boolean;
}

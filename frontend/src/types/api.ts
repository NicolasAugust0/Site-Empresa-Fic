/** Tipos das respostas da API. Valores monetários em CENTAVOS. */

export interface Platform {
  id: number;
  slug: string;
  name: string;
  logo: string;
  color: string;
  textColor: string;
  websiteUrl: string;
  priority: number;
}

export interface Restaurant {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  address: string;
  productsCount?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  restaurant: Restaurant;
}

export interface Category {
  slug: string;
  label: string;
  emoji: string;
  productsCount: number;
}

export interface PriceBreakdown {
  productPrice: number;
  deliveryFee: number;
  additionalFee: number;
  discount: number;
  couponDiscount: number;
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
  platform: Platform;
  breakdown: PriceBreakdown;
  finalPrice: number;
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

export interface ComparisonResult {
  product: Product;
  offers: RankedOffer[];
  bestOffer: RankedOffer | null;
  savings: number;
  isTie: boolean;
  tieBreaker: TieBreaker;
  tiedPlatforms: string[];
  indicators: {
    bestPrice: number;
    worstPrice: number;
    averagePrice: number;
    maxSavings: number;
    platformsCompared: number;
    biggestDiscount: number;
    biggestDiscountPlatform: string | null;
  };
  message: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  restaurant: Restaurant;
  offersCount: number;
  bestPrice: number | null;
  worstPrice: number | null;
  savings: number;
  bestPlatform: Platform | null;
  hasFreeDelivery: boolean;
  hasPromo: boolean;
}

export interface SearchResult {
  query: string;
  category: string | null;
  products: ProductSummary[];
  restaurants: Restaurant[];
  total: number;
}

export interface PlatformStats {
  platform: Platform;
  offers: number;
  wins: number;
  averageFinalPrice: number;
  freeDeliveryOffers: number;
  clicks: number;
}

export interface OverviewStats {
  totals: { restaurants: number; products: number; platforms: number; offers: number; clicks: number };
  averageSavings: number;
  totalPotentialSavings: number;
  biggestSaving: { productId: number; productName: string; restaurantName: string; value: number } | null;
  platforms: PlatformStats[];
}

// ---- Área administrativa ----

export interface AdminRestaurant extends Omit<Restaurant, 'productsCount'> {
  _count: { products: number };
}

export interface AdminProduct {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  category: string;
  image: string;
  restaurant: { id: number; name: string };
  _count: { offers: number };
}

export interface AdminPlatform extends Platform {
  active: boolean;
  _count: { offers: number };
}

export interface AdminOffer {
  id: number;
  productId: number;
  platformId: number;
  productPrice: number;
  deliveryFee: number;
  additionalFee: number;
  discount: number;
  couponDiscount: number;
  couponCode: string | null;
  promoLabel: string | null;
  deliveryTimeMin: number;
  finalPrice: number;
  redirectUrl: string;
  available: boolean;
  updatedAt: string;
  isBest: boolean;
  platform: Platform;
  product: { id: number; name: string; restaurant: { id: number; name: string } };
}

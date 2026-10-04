import type { Offer, Platform, Product, Restaurant } from '@prisma/client';
import type { PlatformInfo, ProductInfo, RawOffer, RestaurantInfo } from '../types/domain.js';

export function toRestaurantInfo(r: Restaurant): RestaurantInfo {
  return { id: r.id, name: r.name, category: r.category, image: r.image, rating: r.rating, address: r.address };
}

export function toPlatformInfo(p: Platform): PlatformInfo {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    logo: p.logo,
    color: p.color,
    textColor: p.textColor,
    websiteUrl: p.websiteUrl,
    priority: p.priority,
  };
}

export function toProductInfo(p: Product & { restaurant: Restaurant }): ProductInfo {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    image: p.image,
    restaurant: toRestaurantInfo(p.restaurant),
  };
}

export function toRawOffer(o: Offer, platform: Platform): RawOffer {
  return {
    offerId: o.id,
    platform: toPlatformInfo(platform),
    productPrice: o.productPrice,
    deliveryFee: o.deliveryFee,
    additionalFee: o.additionalFee,
    discount: o.discount,
    couponDiscount: o.couponDiscount,
    couponCode: o.couponCode,
    promoLabel: o.promoLabel,
    deliveryTimeMin: o.deliveryTimeMin,
    redirectUrl: o.redirectUrl,
    updatedAt: o.updatedAt,
  };
}

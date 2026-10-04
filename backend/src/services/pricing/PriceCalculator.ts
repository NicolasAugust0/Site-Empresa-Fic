import type { PriceBreakdown } from '../../types/domain.js';
import { applyDiscounts } from './discounts.js';

export interface PriceInput {
  productPrice: number;
  deliveryFee?: number;
  additionalFee?: number;
  discount?: number;
  couponDiscount?: number;
}

const nonNegative = (value: number | undefined) => Math.max(0, Math.round(value ?? 0));

/**
 * Calcula o preço final de uma oferta (valores em centavos).
 *
 *   PREÇO FINAL = produto + entrega + outras taxas − descontos − cupons
 *
 * Função pura, sem dependência de banco ou interface — pode ser reutilizada
 * com dados simulados ou vindos de APIs oficiais.
 */
export function calculateFinalPrice(input: PriceInput): PriceBreakdown {
  const productPrice = nonNegative(input.productPrice);
  const deliveryFee = nonNegative(input.deliveryFee);
  const additionalFee = nonNegative(input.additionalFee);
  const discount = nonNegative(input.discount);
  const couponDiscount = nonNegative(input.couponDiscount);

  const subtotal = productPrice + deliveryFee + additionalFee;
  const { applied, total } = applyDiscounts(subtotal, { discount, couponDiscount });

  return {
    productPrice,
    deliveryFee,
    additionalFee,
    discount,
    couponDiscount,
    totalDiscount: applied,
    subtotal,
    finalPrice: total,
  };
}

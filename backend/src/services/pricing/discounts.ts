export interface DiscountInput {
  discount: number;
  couponDiscount: number;
}

export interface DiscountResult {
  /** Desconto total efetivamente aplicado. */
  applied: number;
  /** Valor após os descontos (nunca negativo). */
  total: number;
}

/**
 * Aplica descontos e cupons sobre um subtotal.
 * - Valores negativos são tratados como zero.
 * - O desconto total nunca ultrapassa o subtotal (o preço final não fica negativo).
 */
export function applyDiscounts(subtotal: number, { discount, couponDiscount }: DiscountInput): DiscountResult {
  const requested = Math.max(0, discount) + Math.max(0, couponDiscount);
  const applied = Math.min(requested, Math.max(0, subtotal));
  return { applied, total: subtotal - applied };
}

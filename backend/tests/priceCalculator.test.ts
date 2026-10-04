import { describe, expect, it } from 'vitest';
import { applyDiscounts } from '../src/services/pricing/discounts.js';
import { calculateFinalPrice } from '../src/services/pricing/PriceCalculator.js';
import { formatBRL, toCents } from '../src/utils/money.js';

describe('calculateFinalPrice', () => {
  it('aplica a fórmula: produto + entrega + taxas − descontos − cupons', () => {
    const result = calculateFinalPrice({
      productPrice: 4990,
      deliveryFee: 300,
      additionalFee: 0,
      discount: 1500,
      couponDiscount: 0,
    });
    expect(result.finalPrice).toBe(3790); // R$ 37,90 — exemplo do 99Food
    expect(result.subtotal).toBe(5290);
    expect(result.totalDiscount).toBe(1500);
  });

  it('soma taxas adicionais e cupons', () => {
    const result = calculateFinalPrice({
      productPrice: 5490,
      deliveryFee: 799,
      additionalFee: 99,
      discount: 200,
      couponDiscount: 1000,
    });
    expect(result.finalPrice).toBe(5490 + 799 + 99 - 200 - 1000);
  });

  it('nunca retorna preço negativo quando o desconto excede o total', () => {
    const result = calculateFinalPrice({ productPrice: 1000, deliveryFee: 0, discount: 5000 });
    expect(result.finalPrice).toBe(0);
    expect(result.totalDiscount).toBe(1000);
  });

  it('trata valores negativos como zero', () => {
    const result = calculateFinalPrice({ productPrice: 1000, deliveryFee: -500, discount: -100 });
    expect(result.finalPrice).toBe(1000);
  });

  it('evita erros de ponto flutuante usando centavos', () => {
    expect(toCents(49.9) + toCents(8) - toCents(5)).toBe(5290);
    expect(formatBRL(5290)).toBe('R$ 52,90');
  });
});

describe('applyDiscounts', () => {
  it('combina desconto e cupom', () => {
    expect(applyDiscounts(5000, { discount: 1000, couponDiscount: 500 })).toEqual({ applied: 1500, total: 3500 });
  });
});

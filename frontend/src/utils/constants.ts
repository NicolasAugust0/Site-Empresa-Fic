import type { TieBreaker } from '../types/api';

export const APP_NAME = 'ComparaFood';
export const APP_TAGLINE = 'Compare antes de pedir.';

export const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  hamburguer: { label: 'Hambúrguer', emoji: '🍔' },
  pizza: { label: 'Pizza', emoji: '🍕' },
  frango: { label: 'Frango', emoji: '🍗' },
  lanches: { label: 'Lanches', emoji: '🌮' },
  combos: { label: 'Combos', emoji: '🍟' },
  bebidas: { label: 'Bebidas', emoji: '🥤' },
  japonesa: { label: 'Japonesa', emoji: '🍣' },
};

export const TIE_BREAKER_OPTIONS: { value: TieBreaker; label: string }[] = [
  { value: 'deliveryTime', label: 'Menor tempo de entrega' },
  { value: 'deliveryFee', label: 'Menor taxa de entrega' },
  { value: 'productPrice', label: 'Menor preço do produto' },
  { value: 'none', label: 'Mostrar empate' },
];

export const POPULAR_SEARCHES = ['Pizza Calabresa', 'Combo Bacon', 'Hambúrguer', 'Pizzaria B', 'Sushi'];

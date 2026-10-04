/** Converte reais (ex.: 49.9) para centavos inteiros (4990). */
export function toCents(reais: number): number {
  return Math.round(reais * 100);
}

/** Converte centavos para reais. */
export function toReais(cents: number): number {
  return cents / 100;
}

/** Formata centavos como moeda brasileira: 3790 -> "R$ 37,90". */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(toReais(cents))
    .replace(/ /g, ' ');
}

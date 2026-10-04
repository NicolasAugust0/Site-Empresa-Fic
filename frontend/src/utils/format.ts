const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 3790 -> "R$ 37,90" */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, ' ');
}

/** Centavos -> reais (para campos de formulário). */
export function centsToReais(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** "37,90" ou "37.90" -> 3790 */
export function reaisToCents(value: string | number): number {
  return Math.round(Number(String(value).replace(',', '.')) * 100) || 0;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function isImageUrl(value: string): boolean {
  return /^(https?:)?\/\//.test(value) || value.startsWith('/');
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

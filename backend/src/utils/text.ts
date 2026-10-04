/** Normaliza texto para busca: minúsculas, sem acentos e espaços extras. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Gera um slug simples: "Pizza Calabresa" -> "pizza-calabresa". */
export function slugify(text: string): string {
  return normalize(text).replace(/\s+/g, '-');
}

export interface Category {
  slug: string;
  label: string;
  emoji: string;
  /** Termos alternativos que também encontram a categoria. */
  aliases: string[];
}

export const CATEGORIES: Category[] = [
  { slug: 'hamburguer', label: 'Hambúrguer', emoji: '🍔', aliases: ['burger', 'hamburger', 'x-burger'] },
  { slug: 'pizza', label: 'Pizza', emoji: '🍕', aliases: ['pizzaria'] },
  { slug: 'frango', label: 'Frango', emoji: '🍗', aliases: ['chicken', 'frito'] },
  { slug: 'lanches', label: 'Lanches', emoji: '🌮', aliases: ['lanche', 'sanduiche', 'hot dog'] },
  { slug: 'combos', label: 'Combos', emoji: '🍟', aliases: ['combo'] },
  { slug: 'bebidas', label: 'Bebidas', emoji: '🥤', aliases: ['bebida', 'refrigerante', 'suco', 'drink'] },
  { slug: 'japonesa', label: 'Japonesa', emoji: '🍣', aliases: ['sushi', 'temaki', 'japones'] },
];

export function findCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

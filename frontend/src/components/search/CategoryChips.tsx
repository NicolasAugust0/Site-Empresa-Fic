import { Link } from 'react-router-dom';
import type { Category } from '../../types/api';
import { cn } from '../../utils/format';

interface CategoryChipsProps {
  categories: Category[];
  active?: string | null;
  variant?: 'tiles' | 'chips';
}

export function CategoryChips({ categories, active, variant = 'chips' }: CategoryChipsProps) {
  if (variant === 'tiles') {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={`/busca?categoria=${c.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
          >
            <span className="text-3xl transition group-hover:scale-110 sm:text-4xl">{c.emoji}</span>
            <span className="text-sm font-semibold text-slate-700">{c.label}</span>
            <span className="text-[11px] text-slate-400">{c.productsCount} itens</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      <Link
        to="/busca"
        className={cn(
          'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition',
          !active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
        )}
      >
        Todos
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={`/busca?categoria=${c.slug}`}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition',
            active === c.slug
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
          )}
        >
          {c.emoji} {c.label}
        </Link>
      ))}
    </div>
  );
}

import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../utils/format';

interface SearchBarProps {
  size?: 'sm' | 'lg';
  autoFocus?: boolean;
}

export function SearchBar({ size = 'lg', autoFocus }: SearchBarProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');

  useEffect(() => {
    setValue(params.get('q') ?? '');
  }, [params]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    const category = params.get('categoria');
    if (category && size === 'sm') next.set('categoria', category);
    navigate(`/busca${next.toString() ? `?${next}` : ''}`);
  }

  const large = size === 'lg';

  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search
        className={cn('pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400', large ? 'left-5 h-5 w-5' : 'left-3.5 h-4 w-4')}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="O que você quer pedir?"
        aria-label="Pesquisar produto, restaurante ou categoria"
        autoFocus={autoFocus}
        className={cn(
          'w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:hidden',
          large ? 'rounded-2xl py-4 pl-13 pr-36 text-base shadow-lift sm:py-5 sm:text-lg' : 'rounded-xl py-2.5 pl-10 pr-10 text-sm',
        )}
      />
      {value && !large && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
          aria-label="Limpar busca"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {large && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 sm:right-2.5 sm:px-5 sm:py-3"
        >
          Comparar <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}

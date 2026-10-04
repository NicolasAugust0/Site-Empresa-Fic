import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Platform } from '../../types/api';
import { POPULAR_SEARCHES } from '../../utils/constants';
import { SearchBar } from '../search/SearchBar';
import { PlatformLogo } from '../ui/PlatformLogo';

export function Hero({ platforms }: { platforms: Platform[] }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-brand-50 via-white to-slate-50">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pb-14 pt-12 text-center sm:pt-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
          <Sparkles className="h-3.5 w-3.5" /> Compare antes de pedir
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Encontre onde seu pedido <span className="text-brand-600">custa menos.</span>
        </h1>
        <p className="max-w-xl text-base text-slate-600 sm:text-lg">
          Você não precisa abrir três aplicativos. Comparamos preço, frete, taxas, descontos e cupons e mostramos o{' '}
          <strong className="text-slate-800">preço final</strong> em cada plataforma.
        </p>

        <div className="w-full">
          <SearchBar autoFocus />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-slate-500">Experimente:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              to={`/busca?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
            >
              {term}
            </Link>
          ))}
        </div>

        {platforms.length > 0 && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Comparamos</span>
            <div className="flex -space-x-1.5">
              {platforms.map((p) => (
                <span key={p.id} className="rounded-xl ring-2 ring-white">
                  <PlatformLogo platform={p} size="sm" />
                </span>
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600">{platforms.map((p) => p.name).join(' · ')}</span>
          </div>
        )}
      </div>
    </section>
  );
}

import { ArrowLeft, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../components/search/ProductCard';
import { ErrorState, Skeleton } from '../components/ui/Feedback';
import { ItemImage } from '../components/ui/ItemImage';
import { Rating } from '../components/ui/Rating';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { catalogService } from '../services/catalogService';
import { CATEGORY_LABELS } from '../utils/constants';
import { formatBRL } from '../utils/format';

export function RestaurantPage() {
  const { id } = useParams();
  const { data, error, reload } = useAsync(() => catalogService.restaurant(Number(id)), [id]);
  useDocumentTitle(data?.restaurant.name ?? 'Restaurante');

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <Skeleton className="h-28" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { restaurant, products } = data;
  const category = CATEGORY_LABELS[restaurant.category];
  const totalSavings = products.reduce((sum, p) => sum + p.savings, 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:py-8">
      <Link to="/busca" className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Explorar
      </Link>

      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:p-6">
        <ItemImage image={restaurant.image} alt={restaurant.name} size="lg" />
        <div className="flex-1">
          {category && (
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              {category.emoji} {category.label}
            </span>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{restaurant.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <Rating value={restaurant.rating} />
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {restaurant.address}
            </span>
          </div>
        </div>
        {totalSavings > 0 && (
          <div className="rounded-2xl bg-brand-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Economia possível no cardápio</p>
            <p className="text-2xl font-extrabold text-brand-700">{formatBRL(totalSavings)}</p>
          </div>
        )}
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Cardápio comparado</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

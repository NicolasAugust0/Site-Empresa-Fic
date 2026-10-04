import { useSearchParams } from 'react-router-dom';
import { CategoryChips } from '../components/search/CategoryChips';
import { ProductCard } from '../components/search/ProductCard';
import { RestaurantCard } from '../components/search/RestaurantCard';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/Feedback';
import { Section } from '../components/ui/Section';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { catalogService } from '../services/catalogService';
import { CATEGORY_LABELS, POPULAR_SEARCHES } from '../utils/constants';
import { pluralize } from '../utils/format';
import { Link } from 'react-router-dom';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('categoria') ?? undefined;
  const categoryInfo = category ? CATEGORY_LABELS[category] : undefined;

  useDocumentTitle(q ? `"${q}"` : categoryInfo?.label ?? 'Explorar');

  const categories = useAsync(() => catalogService.categories(), []);
  const { data, error, loading, reload } = useAsync(() => catalogService.search(q, category), [q, category]);

  const heading = q ? `Resultados para "${q}"` : categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.label}` : 'Todos os produtos';

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:py-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{heading}</h1>
          {data && (
            <p className="text-sm text-slate-500">
              {pluralize(data.total, 'produto encontrado', 'produtos encontrados')} · ordenados por relevância e economia
            </p>
          )}
        </div>
        {categories.data && <CategoryChips categories={categories.data} active={category ?? null} />}
      </div>

      {error && <ErrorState error={error} onRetry={reload} />}

      {loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : data && data.total === 0 && data.restaurants.length === 0 ? (
        <EmptyState
          title="Nenhum resultado encontrado"
          description="Tente pesquisar pelo nome do produto, do restaurante ou por uma categoria."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <Link key={term} to={`/busca?q=${encodeURIComponent(term)}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700">
                  {term}
                </Link>
              ))}
            </div>
          }
        />
      ) : (
        data && (
          <div className={loading ? 'opacity-60 transition' : 'transition'}>
            {data.restaurants.length > 0 && (q || category) && (
              <div className="mb-8">
                <Section title="Restaurantes">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.restaurants.map((r) => (
                      <RestaurantCard key={r.id} restaurant={r} />
                    ))}
                  </div>
                </Section>
              </div>
            )}
            {data.products.length > 0 && (
              <Section title="Produtos" subtitle="Toque em um produto para ver a comparação completa">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        )
      )}
    </div>
  );
}

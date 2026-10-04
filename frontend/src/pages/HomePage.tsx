import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { HowItWorks } from '../components/home/HowItWorks';
import { PlatformInsights } from '../components/home/PlatformInsights';
import { CategoryChips } from '../components/search/CategoryChips';
import { ProductCard } from '../components/search/ProductCard';
import { RestaurantCard } from '../components/search/RestaurantCard';
import { ErrorState, Skeleton } from '../components/ui/Feedback';
import { Section } from '../components/ui/Section';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { catalogService } from '../services/catalogService';

export function HomePage() {
  useDocumentTitle();
  const { data, error, loading, reload } = useAsync(
    () =>
      Promise.all([
        catalogService.platforms(),
        catalogService.categories(),
        catalogService.featured(6),
        catalogService.restaurants(),
        catalogService.stats(),
      ]),
    [],
  );

  const [platforms, categories, featured, restaurants, stats] = data ?? [[], [], [], [], null];

  return (
    <>
      <Hero platforms={platforms} />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-10">
        {error && <ErrorState error={error} onRetry={reload} />}

        <Section title="Categorias" subtitle="O que você está com vontade de comer?">
          {loading ? <Skeleton className="h-28" /> : <CategoryChips categories={categories} variant="tiles" />}
        </Section>

        <Section
          title="🔥 Ofertas em destaque"
          subtitle="Produtos onde comparar faz mais diferença no bolso"
          action={
            <Link to="/busca" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">
              Ver tudo <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-44" />)
              : featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>

        <Section title="Como funciona">
          <HowItWorks />
        </Section>

        {stats && <PlatformInsights stats={stats} />}

        <Section title="Restaurantes populares" subtitle="Os mais bem avaliados presentes em várias plataformas">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24" />)
              : restaurants.slice(0, 6).map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </Section>
      </div>
    </>
  );
}

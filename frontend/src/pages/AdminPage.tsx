import { BarChart3, Layers, Package, Store, Tags } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { OffersTab } from '../components/admin/OffersTab';
import { OverviewTab } from '../components/admin/OverviewTab';
import { PlatformsTab } from '../components/admin/PlatformsTab';
import { ProductsTab } from '../components/admin/ProductsTab';
import { RestaurantsTab } from '../components/admin/RestaurantsTab';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../utils/format';

const TABS = [
  { id: 'visao-geral', label: 'Visão geral', icon: BarChart3, component: OverviewTab },
  { id: 'ofertas', label: 'Ofertas', icon: Tags, component: OffersTab },
  { id: 'produtos', label: 'Produtos', icon: Package, component: ProductsTab },
  { id: 'restaurantes', label: 'Restaurantes', icon: Store, component: RestaurantsTab },
  { id: 'plataformas', label: 'Plataformas', icon: Layers, component: PlatformsTab },
];

export function AdminPage() {
  useDocumentTitle('Administração');
  const [params, setParams] = useSearchParams();
  const active = TABS.find((t) => t.id === params.get('aba')) ?? TABS[0];
  const ActiveTab = active.component;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Área administrativa</span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Painel de dados</h1>
        <p className="text-sm text-slate-500">
          Alimente a base simulada: cadastre restaurantes, produtos, plataformas e ofertas. O preço final é recalculado automaticamente.
        </p>
      </div>

      <nav className="-mx-4 flex gap-1 overflow-x-auto border-b border-slate-200 px-4 [scrollbar-width:none]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setParams({ aba: id })}
            className={cn(
              '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition',
              active.id === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </nav>

      <ActiveTab />
    </div>
  );
}

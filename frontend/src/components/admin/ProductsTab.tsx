import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { adminService } from '../../services/adminService';
import type { AdminProduct } from '../../types/api';
import { CATEGORY_LABELS } from '../../utils/constants';
import { Button } from '../ui/Button';
import { ErrorState, Skeleton } from '../ui/Feedback';
import { ItemImage } from '../ui/ItemImage';
import { AdminTable } from './AdminTable';
import { EntityFormModal, toFormValues, type FieldConfig } from './EntityFormModal';
import { confirmDelete, useCrudModal } from './useCrudModal';

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, c]) => ({ value, label: `${c.emoji} ${c.label}` }));

export function ProductsTab() {
  const { data, error, reload } = useAsync(() => Promise.all([adminService.products.list(), adminService.restaurants.list()]), []);
  const modal = useCrudModal<AdminProduct>();

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Skeleton className="h-96" />;
  const [products, restaurants] = data;

  const fields: FieldConfig[] = [
    { name: 'restaurantId', label: 'Restaurante', type: 'select', required: true, options: restaurants.map((r) => ({ value: r.id, label: r.name })) },
    { name: 'category', label: 'Categoria', type: 'select', required: true, options: categoryOptions },
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'image', label: 'Imagem', type: 'text', required: true, hint: 'Emoji (ex.: 🍕) ou URL de imagem' },
    { name: 'description', label: 'Descrição', type: 'textarea' },
  ];

  async function save(payload: Record<string, unknown>) {
    const record = modal.state?.record;
    if (record) await adminService.products.update(record.id, payload);
    else await adminService.products.create(payload as never);
    reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={modal.openCreate}>
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      </div>
      <AdminTable
        rows={products}
        rowKey={(p) => p.id}
        onEdit={modal.openEdit}
        onDelete={(p) => confirmDelete(`Excluir "${p.name}" e todas as suas ofertas?`, () => adminService.products.remove(p.id), reload)}
        columns={[
          {
            header: 'Produto',
            render: (p) => (
              <div className="flex items-center gap-3">
                <ItemImage image={p.image} alt={p.name} size="sm" />
                <div>
                  <Link to={`/produto/${p.id}`} className="font-semibold text-slate-800 hover:text-brand-700 hover:underline">
                    {p.name}
                  </Link>
                  <p className="line-clamp-1 max-w-xs text-xs text-slate-500">{p.description}</p>
                </div>
              </div>
            ),
          },
          { header: 'Restaurante', render: (p) => p.restaurant.name },
          { header: 'Categoria', render: (p) => CATEGORY_LABELS[p.category]?.label ?? p.category },
          { header: 'Ofertas', render: (p) => p._count.offers },
        ]}
      />
      {modal.state && (
        <EntityFormModal
          title={modal.state.mode === 'edit' ? 'Editar produto' : 'Novo produto'}
          fields={fields}
          initialValues={toFormValues(fields, modal.state.record ?? { image: '🍔' })}
          onSubmit={save}
          onClose={modal.close}
        />
      )}
    </div>
  );
}

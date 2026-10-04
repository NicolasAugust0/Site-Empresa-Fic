import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { adminService } from '../../services/adminService';
import type { AdminRestaurant } from '../../types/api';
import { CATEGORY_LABELS } from '../../utils/constants';
import { Button } from '../ui/Button';
import { ErrorState, Skeleton } from '../ui/Feedback';
import { ItemImage } from '../ui/ItemImage';
import { Rating } from '../ui/Rating';
import { AdminTable } from './AdminTable';
import { EntityFormModal, toFormValues, type FieldConfig } from './EntityFormModal';
import { confirmDelete, useCrudModal } from './useCrudModal';

const fields: FieldConfig[] = [
  { name: 'name', label: 'Nome', type: 'text', required: true },
  {
    name: 'category',
    label: 'Categoria principal',
    type: 'select',
    required: true,
    options: Object.entries(CATEGORY_LABELS).map(([value, c]) => ({ value, label: `${c.emoji} ${c.label}` })),
  },
  { name: 'image', label: 'Imagem', type: 'text', required: true, hint: 'Emoji ou URL de imagem' },
  { name: 'rating', label: 'Avaliação (0 a 5)', type: 'number', step: '0.1', required: true },
  { name: 'address', label: 'Endereço', type: 'text', required: true, wide: true },
];

export function RestaurantsTab() {
  const { data, error, reload } = useAsync(() => adminService.restaurants.list(), []);
  const modal = useCrudModal<AdminRestaurant>();

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Skeleton className="h-96" />;

  async function save(payload: Record<string, unknown>) {
    const record = modal.state?.record;
    if (record) await adminService.restaurants.update(record.id, payload);
    else await adminService.restaurants.create(payload as never);
    reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={modal.openCreate}>
          <Plus className="h-4 w-4" /> Novo restaurante
        </Button>
      </div>
      <AdminTable
        rows={data}
        rowKey={(r) => r.id}
        onEdit={modal.openEdit}
        onDelete={(r) => confirmDelete(`Excluir "${r.name}", seus produtos e ofertas?`, () => adminService.restaurants.remove(r.id), reload)}
        columns={[
          {
            header: 'Restaurante',
            render: (r) => (
              <div className="flex items-center gap-3">
                <ItemImage image={r.image} alt={r.name} size="sm" />
                <Link to={`/restaurante/${r.id}`} className="font-semibold text-slate-800 hover:text-brand-700 hover:underline">
                  {r.name}
                </Link>
              </div>
            ),
          },
          { header: 'Categoria', render: (r) => CATEGORY_LABELS[r.category]?.label ?? r.category },
          { header: 'Avaliação', render: (r) => <Rating value={r.rating} /> },
          { header: 'Endereço', render: (r) => <span className="text-xs text-slate-500">{r.address}</span> },
          { header: 'Produtos', render: (r) => r._count.products },
        ]}
      />
      {modal.state && (
        <EntityFormModal
          title={modal.state.mode === 'edit' ? 'Editar restaurante' : 'Novo restaurante'}
          fields={fields}
          initialValues={toFormValues(fields, modal.state.record ?? { image: '🍽️', rating: 4.5 })}
          onSubmit={save}
          onClose={modal.close}
        />
      )}
    </div>
  );
}

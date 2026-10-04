import { ExternalLink, Plus } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { adminService } from '../../services/adminService';
import type { AdminPlatform } from '../../types/api';
import { Button } from '../ui/Button';
import { ErrorState, Skeleton } from '../ui/Feedback';
import { Pill } from '../ui/OfferBadge';
import { PlatformLogo } from '../ui/PlatformLogo';
import { AdminTable } from './AdminTable';
import { EntityFormModal, toFormValues, type FieldConfig, type FormValues } from './EntityFormModal';
import { confirmDelete, useCrudModal } from './useCrudModal';

const fields: FieldConfig[] = [
  { name: 'name', label: 'Nome', type: 'text', required: true },
  { name: 'slug', label: 'Identificador (slug)', type: 'text', required: true, hint: 'Ex.: ifood, 99food, keeta' },
  { name: 'logo', label: 'Logo', type: 'text', required: true, hint: 'Sigla curta (ex.: iF) ou URL de imagem' },
  { name: 'priority', label: 'Prioridade', type: 'number', hint: 'Ordem de exibição' },
  { name: 'color', label: 'Cor principal', type: 'color', required: true },
  { name: 'textColor', label: 'Cor do texto', type: 'color', required: true },
  { name: 'websiteUrl', label: 'Site oficial', type: 'url', required: true, wide: true },
  { name: 'active', label: 'Plataforma ativa (participa das comparações)', type: 'checkbox' },
];

function LogoPreview({ values }: { values: FormValues }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
      Prévia:
      <PlatformLogo
        platform={{
          name: String(values.name || 'Plataforma'),
          logo: String(values.logo || '?'),
          color: String(values.color || '#000000'),
          textColor: String(values.textColor || '#FFFFFF'),
        }}
      />
    </div>
  );
}

export function PlatformsTab() {
  const { data, error, reload } = useAsync(() => adminService.platforms.list(), []);
  const modal = useCrudModal<AdminPlatform>();

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Skeleton className="h-64" />;

  async function save(payload: Record<string, unknown>) {
    const record = modal.state?.record;
    if (record) await adminService.platforms.update(record.id, payload);
    else await adminService.platforms.create(payload as never);
    reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={modal.openCreate}>
          <Plus className="h-4 w-4" /> Nova plataforma
        </Button>
      </div>
      <AdminTable
        rows={data}
        rowKey={(p) => p.id}
        rowClassName={(p) => !p.active && 'opacity-50'}
        onEdit={modal.openEdit}
        onDelete={(p) => confirmDelete(`Excluir ${p.name} e todas as suas ofertas?`, () => adminService.platforms.remove(p.id), reload)}
        columns={[
          {
            header: 'Plataforma',
            render: (p) => (
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <PlatformLogo platform={p} size="sm" /> {p.name}
              </span>
            ),
          },
          { header: 'Slug', render: (p) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{p.slug}</code> },
          {
            header: 'Site',
            render: (p) => (
              <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-700">
                {p.websiteUrl.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
              </a>
            ),
          },
          { header: 'Ofertas', render: (p) => p._count.offers },
          {
            header: 'Status',
            render: (p) =>
              p.active ? <Pill className="bg-brand-100 text-brand-800 ring-brand-200">Ativa</Pill> : <Pill className="bg-slate-100 text-slate-600 ring-slate-200">Inativa</Pill>,
          },
        ]}
      />
      {modal.state && (
        <EntityFormModal
          title={modal.state.mode === 'edit' ? 'Editar plataforma' : 'Nova plataforma'}
          fields={fields}
          initialValues={toFormValues(fields, modal.state.record ?? { color: '#059669', textColor: '#FFFFFF', priority: data.length + 1, websiteUrl: 'https://' })}
          onSubmit={save}
          onClose={modal.close}
          preview={(values) => <LogoPreview values={values} />}
        />
      )}
    </div>
  );
}

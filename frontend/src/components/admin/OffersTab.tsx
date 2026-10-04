import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { adminService } from '../../services/adminService';
import type { AdminOffer } from '../../types/api';
import { cn, formatBRL, formatDateTime, reaisToCents } from '../../utils/format';
import { Button } from '../ui/Button';
import { ErrorState, Skeleton } from '../ui/Feedback';
import { Pill } from '../ui/OfferBadge';
import { PlatformLogo } from '../ui/PlatformLogo';
import { AdminTable } from './AdminTable';
import { EntityFormModal, toFormValues, type FieldConfig, type FormValues } from './EntityFormModal';
import { confirmDelete, useCrudModal } from './useCrudModal';

/** Prévia do preço final no formulário (o cálculo oficial é feito no backend). */
function FinalPricePreview({ values }: { values: FormValues }) {
  const cents = (name: string) => reaisToCents(String(values[name] || 0));
  const subtotal = cents('productPrice') + cents('deliveryFee') + cents('additionalFee');
  const final = Math.max(0, subtotal - cents('discount') - cents('couponDiscount'));
  return (
    <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
      <span className="text-sm text-brand-800">Preço final calculado</span>
      <span className="text-xl font-extrabold text-brand-700">{formatBRL(final)}</span>
    </div>
  );
}

export function OffersTab() {
  const offers = useAsync(() => adminService.offers.list(), []);
  const options = useAsync(() => Promise.all([adminService.products.list(), adminService.platforms.list()]), []);
  const modal = useCrudModal<AdminOffer>();
  const [filter, setFilter] = useState('');

  const fields: FieldConfig[] = useMemo(() => {
    const [products, platforms] = options.data ?? [[], []];
    return [
      {
        name: 'productId',
        label: 'Produto',
        type: 'select',
        required: true,
        wide: true,
        options: products.map((p) => ({ value: p.id, label: `${p.name} — ${p.restaurant.name}` })),
      },
      { name: 'platformId', label: 'Plataforma', type: 'select', required: true, options: platforms.map((p) => ({ value: p.id, label: p.name })) },
      { name: 'deliveryTimeMin', label: 'Tempo de entrega (min)', type: 'number', required: true },
      { name: 'productPrice', label: 'Preço do produto', type: 'money', required: true },
      { name: 'deliveryFee', label: 'Taxa de entrega', type: 'money', hint: '0 = frete grátis' },
      { name: 'additionalFee', label: 'Outras taxas', type: 'money', hint: 'Serviço, embalagem…' },
      { name: 'discount', label: 'Desconto', type: 'money' },
      { name: 'couponDiscount', label: 'Desconto do cupom', type: 'money' },
      { name: 'couponCode', label: 'Código do cupom', type: 'text', placeholder: 'Ex.: PIZZA10' },
      { name: 'promoLabel', label: 'Selo de promoção', type: 'text', placeholder: 'Ex.: Promoção da semana' },
      {
        name: 'redirectUrl',
        label: 'Link de redirecionamento',
        type: 'url',
        required: true,
        wide: true,
        hint: 'URL http(s) da plataforma ou caminho interno de demonstração (/pedido-simulado?...)',
      },
      { name: 'available', label: 'Oferta disponível', type: 'checkbox' },
    ];
  }, [options.data]);

  const rows = useMemo(() => {
    const term = filter.trim().toLowerCase();
    return (offers.data ?? []).filter(
      (o) =>
        !term ||
        `${o.product.name} ${o.product.restaurant.name} ${o.platform.name}`.toLowerCase().includes(term),
    );
  }, [offers.data, filter]);

  if (offers.error) return <ErrorState error={offers.error} onRetry={offers.reload} />;
  if (!offers.data) return <Skeleton className="h-96" />;

  async function save(payload: Record<string, unknown>) {
    const record = modal.state?.record;
    if (record) await adminService.offers.update(record.id, payload);
    else await adminService.offers.create(payload as never);
    offers.reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar por produto, restaurante ou plataforma"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <Button onClick={modal.openCreate}>
          <Plus className="h-4 w-4" /> Nova oferta
        </Button>
      </div>

      <AdminTable
        rows={rows}
        rowKey={(o) => o.id}
        rowClassName={(o) => !o.available && 'opacity-50'}
        onEdit={modal.openEdit}
        onDelete={(o) =>
          confirmDelete(`Excluir a oferta de ${o.product.name} no ${o.platform.name}?`, () => adminService.offers.remove(o.id), offers.reload)
        }
        columns={[
          {
            header: 'Produto',
            render: (o) => (
              <div>
                <p className="font-semibold text-slate-800">{o.product.name}</p>
                <p className="text-xs text-slate-500">{o.product.restaurant.name}</p>
              </div>
            ),
          },
          {
            header: 'Plataforma',
            render: (o) => (
              <span className="flex items-center gap-2">
                <PlatformLogo platform={o.platform} size="sm" /> {o.platform.name}
              </span>
            ),
          },
          { header: 'Produto (R$)', render: (o) => formatBRL(o.productPrice) },
          { header: 'Entrega', render: (o) => (o.deliveryFee === 0 ? <span className="font-semibold text-sky-700">Grátis</span> : formatBRL(o.deliveryFee)) },
          { header: 'Taxas', render: (o) => formatBRL(o.additionalFee) },
          {
            header: 'Descontos',
            render: (o) => (
              <span className="text-brand-700">
                −{formatBRL(o.discount + o.couponDiscount)}
                {o.couponCode && <span className="block text-[11px] text-violet-600">{o.couponCode}</span>}
              </span>
            ),
          },
          {
            header: 'Final',
            render: (o) => (
              <div className="flex flex-col items-start gap-1">
                <strong className={cn(o.isBest ? 'text-brand-700' : 'text-slate-900')}>{formatBRL(o.finalPrice)}</strong>
                {o.isBest && <Pill className="bg-amber-100 text-amber-800 ring-amber-200">🏆 Melhor</Pill>}
              </div>
            ),
          },
          { header: 'Atualizado', render: (o) => <span className="text-xs text-slate-500">{formatDateTime(o.updatedAt)}</span> },
        ]}
      />

      {modal.state && (
        <EntityFormModal
          title={modal.state.mode === 'edit' ? 'Editar oferta' : 'Nova oferta'}
          fields={fields}
          initialValues={toFormValues(
            fields,
            modal.state.record ?? { deliveryTimeMin: 40, available: true, redirectUrl: 'https://' },
          )}
          onSubmit={save}
          onClose={modal.close}
          preview={(values) => <FinalPricePreview values={values} />}
        />
      )}
    </div>
  );
}

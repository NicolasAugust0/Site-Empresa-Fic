import type { PriceBreakdown as Breakdown } from '../../types/api';
import { formatBRL } from '../../utils/format';

export function PriceBreakdown({ breakdown, couponCode }: { breakdown: Breakdown; couponCode: string | null }) {
  const rows: { label: string; value: number; sign: '+' | '−'; muted?: boolean }[] = [
    { label: 'Produto', value: breakdown.productPrice, sign: '+' },
    { label: 'Taxa de entrega', value: breakdown.deliveryFee, sign: '+' },
    { label: 'Outras taxas', value: breakdown.additionalFee, sign: '+' },
    { label: 'Desconto', value: breakdown.discount, sign: '−' },
    { label: couponCode ? `Cupom ${couponCode}` : 'Cupom', value: breakdown.couponDiscount, sign: '−' },
  ];

  return (
    <dl className="grid gap-1.5 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4">
          <dt className="text-slate-500">{row.label}</dt>
          <dd
            className={
              row.value === 0 ? 'text-slate-400' : row.sign === '−' ? 'font-semibold text-brand-700' : 'font-medium text-slate-700'
            }
          >
            {row.label === 'Taxa de entrega' && row.value === 0 ? 'Grátis' : `${row.sign} ${formatBRL(row.value)}`}
          </dd>
        </div>
      ))}
      <div className="mt-1 flex justify-between gap-4 border-t border-dashed border-slate-200 pt-2">
        <dt className="font-bold text-slate-800">Total</dt>
        <dd className="font-extrabold text-slate-900">{formatBRL(breakdown.finalPrice)}</dd>
      </div>
    </dl>
  );
}

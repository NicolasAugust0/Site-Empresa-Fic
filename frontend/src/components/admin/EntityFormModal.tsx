import { useState, type FormEvent, type ReactNode } from 'react';
import { ApiError } from '../../services/http';
import { centsToReais, cn, reaisToCents } from '../../utils/format';
import { Button } from '../ui/Button';
import { Modal } from './Modal';

export type FieldType = 'text' | 'textarea' | 'number' | 'money' | 'select' | 'checkbox' | 'color' | 'url';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  step?: string;
}

export type FormValues = Record<string, string | boolean>;

/** Converte um registro da API em valores de formulário (centavos → reais). */
export function toFormValues(fields: FieldConfig[], source: object): FormValues {
  const record = source as Record<string, unknown>;
  const values: FormValues = {};
  for (const f of fields) {
    const raw = record[f.name];
    if (f.type === 'checkbox') values[f.name] = Boolean(raw ?? true);
    else if (f.type === 'money') values[f.name] = centsToReais(Number(raw ?? 0));
    else values[f.name] = raw === null || raw === undefined ? '' : String(raw);
  }
  return values;
}

/** Converte valores de formulário no payload da API (reais → centavos). */
export function toPayload(fields: FieldConfig[], values: FormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === 'checkbox') payload[f.name] = Boolean(v);
    else if (f.type === 'money') payload[f.name] = reaisToCents(String(v || 0));
    else if (f.type === 'number' || (f.type === 'select' && typeof f.options?.[0]?.value === 'number')) payload[f.name] = Number(v);
    else payload[f.name] = typeof v === 'string' ? v.trim() : v;
  }
  return payload;
}

interface EntityFormModalProps {
  title: string;
  fields: FieldConfig[];
  initialValues: FormValues;
  onSubmit: (payload: Record<string, unknown>) => Promise<unknown>;
  onClose: () => void;
  preview?: (values: FormValues) => ReactNode;
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

export function EntityFormModal({ title, fields, initialValues, onSubmit, onClose, preview }: EntityFormModalProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: string | boolean) => setValues((v) => ({ ...v, [name]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await onSubmit(toPayload(fields, values));
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(Object.fromEntries((err.details ?? []).map((d) => [d.field, d.message])));
      } else {
        setError('Não foi possível salvar.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className={cn('flex flex-col gap-1.5', (f.wide || f.type === 'textarea') && 'sm:col-span-2', f.type === 'checkbox' && 'flex-row items-center gap-2')}>
              {f.type !== 'checkbox' && (
                <span className="text-xs font-semibold text-slate-600">
                  {f.label}
                  {f.type === 'money' && ' (R$)'}
                </span>
              )}
              {f.type === 'select' ? (
                <select className={inputClass} value={String(values[f.name] ?? '')} onChange={(e) => set(f.name, e.target.value)} required={f.required}>
                  <option value="">Selecione…</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea className={inputClass} rows={2} value={String(values[f.name] ?? '')} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
              ) : f.type === 'checkbox' ? (
                <>
                  <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} />
                  <span className="text-sm font-medium text-slate-700">{f.label}</span>
                </>
              ) : f.type === 'color' ? (
                <div className="flex gap-2">
                  <input type="color" className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200" value={String(values[f.name] || '#000000')} onChange={(e) => set(f.name, e.target.value.toUpperCase())} />
                  <input className={inputClass} value={String(values[f.name] ?? '')} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
                </div>
              ) : (
                <input
                  className={inputClass}
                  type={f.type === 'money' || f.type === 'number' ? 'number' : 'text'}
                  inputMode={f.type === 'money' ? 'decimal' : undefined}
                  step={f.type === 'money' ? '0.01' : f.step}
                  min={f.type === 'money' ? 0 : undefined}
                  value={String(values[f.name] ?? '')}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              )}
              {f.hint && <span className="text-[11px] text-slate-400">{f.hint}</span>}
              {fieldErrors[f.name] && <span className="text-xs font-medium text-red-600">{fieldErrors[f.name]}</span>}
            </label>
          ))}
        </div>

        {preview?.(values)}

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

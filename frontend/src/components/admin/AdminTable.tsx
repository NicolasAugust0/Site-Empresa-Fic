import { Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/format';

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => number;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowClassName?: (row: T) => string | false;
}

export function AdminTable<T>({ rows, columns, rowKey, onEdit, onDelete, rowClassName }: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className={cn('px-4 py-3', c.className)}>
                {c.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-3 text-right">Ações</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={rowKey(row)} className={cn('transition hover:bg-slate-50/60', rowClassName?.(row))}>
              {columns.map((c) => (
                <td key={c.header} className={cn('whitespace-nowrap px-4 py-3 align-middle', c.className)}>
                  {c.render(row)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-700" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

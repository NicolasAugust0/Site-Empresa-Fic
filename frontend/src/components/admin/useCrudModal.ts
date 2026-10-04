import { useState } from 'react';

/** Controla o modal de criação/edição de uma entidade da área admin. */
export function useCrudModal<T>() {
  const [state, setState] = useState<{ mode: 'create' | 'edit'; record?: T } | null>(null);
  return {
    state,
    openCreate: () => setState({ mode: 'create' }),
    openEdit: (record: T) => setState({ mode: 'edit', record }),
    close: () => setState(null),
  };
}

export async function confirmDelete(message: string, action: () => Promise<unknown>, onDone: () => void) {
  if (!window.confirm(message)) return;
  try {
    await action();
    onDone();
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'Não foi possível excluir.');
  }
}

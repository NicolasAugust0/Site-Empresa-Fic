export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body.error ?? 'Não foi possível completar a requisição.', body.details);
  }
  return body as T;
}

export function toQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

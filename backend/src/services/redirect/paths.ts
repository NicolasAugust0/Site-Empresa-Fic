/** Caminho público que registra o clique e redireciona para a plataforma. */
export function buildRedirectPath(offerId: number): string {
  return `/api/redirect/${offerId}`;
}

import { prisma } from '../../database/client.js';

export { buildRedirectPath } from './paths.js';

/**
 * Resolve o destino de uma oferta e registra o clique (métrica de conversão).
 * Os links ficam no banco (Offer.redirectUrl) e podem ser trocados por links
 * reais/afiliados pela área administrativa, sem alterar código.
 */
export async function resolveRedirect(offerId: number): Promise<string | null> {
  const offer = await prisma.offer.findUnique({ where: { id: offerId }, select: { id: true, redirectUrl: true } });
  if (!offer) return null;

  await prisma.clickEvent.create({ data: { offerId: offer.id } });
  return offer.redirectUrl;
}

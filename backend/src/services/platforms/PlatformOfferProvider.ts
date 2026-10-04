import type { PlatformInfo, ProductInfo, RawOffer } from '../../types/domain.js';

/**
 * Contrato de qualquer fonte de ofertas.
 *
 * Hoje: MockPlatformService (dados simulados no SQLite).
 * Futuro: IfoodService, Food99Service, KeetaService — somente via APIs
 * oficiais ou fontes de dados autorizadas (nunca scraping).
 */
export interface PlatformOfferProvider {
  readonly providerName: string;
  /** Indica se o provedor está configurado e pronto para uso. */
  isAvailable(): boolean;
  /** Busca as ofertas de um produto em uma plataforma. */
  fetchOffers(product: ProductInfo, platform: PlatformInfo): Promise<RawOffer[]>;
}

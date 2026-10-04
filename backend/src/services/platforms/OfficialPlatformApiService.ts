import type { PlatformInfo, ProductInfo, RawOffer } from '../../types/domain.js';
import type { PlatformOfferProvider } from './PlatformOfferProvider.js';

export class IntegrationNotAvailableError extends Error {
  constructor(platform: string) {
    super(`Integração oficial com ${platform} ainda não disponível. Usando dados simulados.`);
    this.name = 'IntegrationNotAvailableError';
  }
}

/**
 * Base para integrações com APIs OFICIAIS/AUTORIZADAS.
 *
 * Cada plataforma terá sua subclasse, que deve:
 *  1. autenticar com credenciais fornecidas pela plataforma (variáveis de ambiente);
 *  2. consultar o endpoint oficial de cardápio/preços;
 *  3. converter a resposta para RawOffer (valores em centavos).
 *
 * Não implementa scraping nem qualquer forma de contornar proteções.
 */
export abstract class OfficialPlatformApiService implements PlatformOfferProvider {
  abstract readonly providerName: string;
  protected abstract readonly platformLabel: string;
  protected abstract readonly envPrefix: string;

  protected get apiBaseUrl(): string | undefined {
    return process.env[`${this.envPrefix}_API_URL`];
  }

  protected get apiKey(): string | undefined {
    return process.env[`${this.envPrefix}_API_KEY`];
  }

  isAvailable(): boolean {
    return Boolean(this.apiBaseUrl && this.apiKey);
  }

  async fetchOffers(product: ProductInfo, platform: PlatformInfo): Promise<RawOffer[]> {
    if (!this.isAvailable()) throw new IntegrationNotAvailableError(this.platformLabel);
    return this.requestOffers(product, platform);
  }

  /** Ponto de extensão: chamada à API oficial e mapeamento para RawOffer. */
  protected async requestOffers(_product: ProductInfo, _platform: PlatformInfo): Promise<RawOffer[]> {
    throw new IntegrationNotAvailableError(this.platformLabel);
  }
}

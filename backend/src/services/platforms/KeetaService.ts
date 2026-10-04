import { OfficialPlatformApiService } from './OfficialPlatformApiService.js';

/** Integração futura com a Keeta (API oficial/parceiro). Variáveis: KEETA_API_URL, KEETA_API_KEY. */
export class KeetaService extends OfficialPlatformApiService {
  readonly providerName = 'keeta-official';
  protected readonly platformLabel = 'Keeta';
  protected readonly envPrefix = 'KEETA';
}

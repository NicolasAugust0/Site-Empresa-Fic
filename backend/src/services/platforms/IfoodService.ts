import { OfficialPlatformApiService } from './OfficialPlatformApiService.js';

/** Integração futura com o iFood (API oficial/parceiro). Variáveis: IFOOD_API_URL, IFOOD_API_KEY. */
export class IfoodService extends OfficialPlatformApiService {
  readonly providerName = 'ifood-official';
  protected readonly platformLabel = 'iFood';
  protected readonly envPrefix = 'IFOOD';
}

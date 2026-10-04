import { OfficialPlatformApiService } from './OfficialPlatformApiService.js';

/** Integração futura com o 99Food (API oficial/parceiro). Variáveis: FOOD99_API_URL, FOOD99_API_KEY. */
export class Food99Service extends OfficialPlatformApiService {
  readonly providerName = '99food-official';
  protected readonly platformLabel = '99Food';
  protected readonly envPrefix = 'FOOD99';
}

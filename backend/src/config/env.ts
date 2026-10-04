import 'dotenv/config';
import type { TieBreaker } from '../types/domain.js';
import { isTieBreaker } from '../services/ranking/ranking.js';

export type ProviderMode = 'mock' | 'official';

function providerMode(value: string | undefined): ProviderMode {
  return value === 'official' ? 'official' : 'mock';
}

const tieBreaker: TieBreaker = isTieBreaker(process.env.TIE_BREAKER) ? process.env.TIE_BREAKER : 'deliveryTime';

export const config = {
  port: Number(process.env.PORT ?? 3333),
  tieBreaker,
  providers: {
    ifood: providerMode(process.env.PLATFORM_PROVIDER_IFOOD),
    '99food': providerMode(process.env.PLATFORM_PROVIDER_99FOOD),
    keeta: providerMode(process.env.PLATFORM_PROVIDER_KEETA),
  } as Record<string, ProviderMode>,
};

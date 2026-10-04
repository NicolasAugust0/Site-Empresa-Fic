import { config } from '../../config/env.js';
import { Food99Service } from './Food99Service.js';
import { IfoodService } from './IfoodService.js';
import { KeetaService } from './KeetaService.js';
import { MockPlatformService } from './MockPlatformService.js';
import type { PlatformOfferProvider } from './PlatformOfferProvider.js';

const mockProvider = new MockPlatformService();

const officialProviders: Record<string, PlatformOfferProvider> = {
  ifood: new IfoodService(),
  '99food': new Food99Service(),
  keeta: new KeetaService(),
};

const warned = new Set<string>();

/**
 * Escolhe o provedor de dados de cada plataforma.
 * Para trocar dados simulados por uma API oficial basta configurar
 * PLATFORM_PROVIDER_<PLATAFORMA>=official e as credenciais correspondentes.
 */
export function resolveProvider(platformSlug: string): PlatformOfferProvider {
  const official = officialProviders[platformSlug];
  if (config.providers[platformSlug] === 'official' && official) {
    if (official.isAvailable()) return official;
    if (!warned.has(platformSlug)) {
      warned.add(platformSlug);
      console.warn(`[platforms] ${platformSlug}: integração oficial sem credenciais — usando MockPlatformService.`);
    }
  }
  return mockProvider;
}

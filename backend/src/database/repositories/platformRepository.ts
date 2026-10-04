import { prisma } from '../client.js';
import { toPlatformInfo } from '../mappers.js';
import type { PlatformInfo } from '../../types/domain.js';

export const platformRepository = {
  async findActive(): Promise<PlatformInfo[]> {
    const platforms = await prisma.platform.findMany({ where: { active: true }, orderBy: { priority: 'asc' } });
    return platforms.map(toPlatformInfo);
  },
};

import type { Request, Response } from 'express';
import { statsService } from '../services/stats/StatsService.js';

export const statsController = {
  async overview(_req: Request, res: Response) {
    res.json(await statsService.overview());
  },
};

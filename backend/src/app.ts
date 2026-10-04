import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api', apiRouter);
  app.use('/api', notFoundHandler);

  // Em produção (`npm run build && npm start`) a API também serve o frontend compilado.
  const frontendDist = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'frontend', 'dist');
  if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (_req, res) => res.sendFile(join(frontendDist, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}

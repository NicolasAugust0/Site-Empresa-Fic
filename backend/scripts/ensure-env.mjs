// Cria backend/.env a partir de .env.example caso ainda não exista.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

if (!existsSync(envPath)) {
  copyFileSync(join(root, '.env.example'), envPath);
  console.log('[setup] .env criado a partir de .env.example');
}

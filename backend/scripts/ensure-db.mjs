// Garante que o banco SQLite exista e tenha dados de demonstração.
// Executado antes de `npm run dev` / `npm start` para o projeto iniciar do zero.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = join(root, 'prisma', 'dev.db');

if (existsSync(dbPath)) {
  console.log('[db] banco encontrado em prisma/dev.db');
} else {
  console.log('[db] banco não encontrado — criando e populando com dados de demonstração...');
  execSync('npx prisma db push --skip-generate && npx prisma db seed', { cwd: root, stdio: 'inherit' });
}

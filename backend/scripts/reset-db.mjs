// Apaga o banco SQLite de desenvolvimento e recria com os dados de demonstração.
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['dev.db', 'dev.db-journal']) rmSync(join(root, 'prisma', file), { force: true });

console.log('[db] banco removido — recriando com dados de demonstração...');
execSync('npx prisma db push --skip-generate && npx prisma db seed', { cwd: root, stdio: 'inherit' });

import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

/** Recria do zero o banco SQLite usado apenas pelos testes (prisma/test.db). */
export default function setup() {
  for (const file of ['test.db', 'test.db-journal']) rmSync(join('prisma', file), { force: true });
  execSync('npx prisma db push --skip-generate && npx prisma db seed', {
    stdio: 'ignore',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  });
}

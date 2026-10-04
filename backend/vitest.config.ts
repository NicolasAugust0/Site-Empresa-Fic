import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // Testes de API usam um banco separado, recriado e populado a cada execução.
    env: { DATABASE_URL: 'file:./test.db' },
    globalSetup: ['tests/globalSetup.ts'],
  },
});

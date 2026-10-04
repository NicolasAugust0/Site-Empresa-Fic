import { config } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🍔 ComparaFood API rodando em http://localhost:${config.port}/api`);
  console.log(`   Critério de desempate: ${config.tieBreaker}`);
});

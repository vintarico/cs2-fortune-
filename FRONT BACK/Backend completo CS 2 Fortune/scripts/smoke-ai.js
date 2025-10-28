// Smoke test básico das rotas sem chamar OpenAI
const axios = require('axios');

async function run() {
  const baseURL = process.env.BASE_URL || 'http://localhost:3001';
  const client = axios.create({ baseURL });

  try {
    // 1) Health-check
    const health = await client.get('/health');
    console.log('Health:', health.data);

    // 2) Login para obter token
    const login = await client.post('/api/login/steam', {
      steamId: 'smoketest-123',
      username: 'Smoke Test'
    });
    const token = login.data.token;
    console.log('Login OK, token obtido.');

    // 3) Listar modelos disponíveis (não chama OpenAI)
    const models = await client.get('/api/ai/models', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Modelos disponíveis:', models.data.models.map(m => m.id));

    // 4) Quota (não chama OpenAI)
    const quota = await client.get('/api/ai/quota', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Quota:', quota.data.quota);

    console.log('\nSmoke test concluído com sucesso.');
  } catch (err) {
    const data = err.response?.data || err.message;
    console.error('Falha no smoke test:', data);
    process.exit(1);
  }
}

run();

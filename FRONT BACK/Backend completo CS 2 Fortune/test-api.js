// Script para testar endpoints da API
const axios = require('axios');

const API_URL = 'http://localhost:3001';
let token = '';

async function testAPI() {
  console.log('🧪 TESTANDO ENDPOINTS DA API CS2 FORTUNE\n');
  
  try {
    // 1. Health Check
    console.log('1️⃣ Testando Health Check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('   ✅', health.data);
    console.log('');

    // 2. Login Steam (Mock)
    console.log('2️⃣ Testando Login Steam...');
    const login = await axios.post(`${API_URL}/api/login/steam`, {
      steamId: '76561198000000001',
      username: 'TestUser'
    });
    token = login.data.token;
    console.log('   ✅ Token gerado:', token.substring(0, 50) + '...');
    console.log('   📊 User:', login.data.user);
    console.log('');

    // 3. Consultar Saldo
    console.log('3️⃣ Testando GET /api/saldo...');
    const saldo = await axios.get(`${API_URL}/api/saldo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Saldo:', saldo.data);
    console.log('');

    // 4. Fazer Depósito
    console.log('4️⃣ Testando POST /api/transaction (depósito)...');
    const deposit = await axios.post(`${API_URL}/api/transaction`, {
      type: 'deposito',
      amount: 100.00
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Depósito:', deposit.data);
    console.log('');

    // 5. Consultar Saldo Atualizado
    console.log('5️⃣ Consultando saldo após depósito...');
    const novoSaldo = await axios.get(`${API_URL}/api/saldo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Novo Saldo:', novoSaldo.data);
    console.log('');

    // 6. AI - Modelos Disponíveis
    console.log('6️⃣ Testando GET /api/ai/models...');
    const models = await axios.get(`${API_URL}/api/ai/models`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Modelos:', models.data.models);
    console.log('');

    // 7. AI - Quota do Usuário
    console.log('7️⃣ Testando GET /api/ai/quota...');
    const quota = await axios.get(`${API_URL}/api/ai/quota`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Quota:', quota.data);
    console.log('');

    console.log('✅ TODOS OS TESTES PASSARAM!\n');

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();

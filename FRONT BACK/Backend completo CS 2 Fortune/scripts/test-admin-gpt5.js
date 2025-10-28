// Script manual para testar rota admin enable-gpt5 com usuário admin do seed
const axios = require('axios');

async function testAdminGPT5() {
  const baseURL = 'http://localhost:3001';
  
  try {
    console.log('1. Login como admin (steamId: admin-001)...');
    const loginRes = await axios.post(`${baseURL}/api/login/steam`, {
      steamId: 'admin-001',
      username: 'admin'
    });
    
    const adminToken = loginRes.data.token;
    console.log('✓ Login OK, token obtido');
    console.log('✓ User:', loginRes.data.user.username, '| isAdmin:', loginRes.data.user.isAdmin);
    
    console.log('\n2. Listar modelos disponíveis para admin...');
    const modelsRes = await axios.get(`${baseURL}/api/ai/models`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Modelos:', modelsRes.data.models.map(m => m.id));
    console.log('✓ Modelo padrão:', modelsRes.data.defaultModel);
    
    console.log('\n3. Habilitar GPT-5 globalmente...');
    const enableRes = await axios.post(`${baseURL}/api/ai/admin/enable-gpt5`, 
      { enabled: true },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✓ Resposta:', enableRes.data);
    
    console.log('\n4. Buscar estatísticas de uso (admin only)...');
    const statsRes = await axios.get(`${baseURL}/api/ai/admin/usage-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Total usuários:', statsRes.data.users.total);
    console.log('✓ Usuários ativos IA:', statsRes.data.users.activeAI);
    console.log('✓ Flags globais:', statsRes.data.flags.global);
    
    console.log('\n5. Login como usuário free e tentar acessar rota admin...');
    const freeLogin = await axios.post(`${baseURL}/api/login/steam`, {
      steamId: 'free-001',
      username: 'freeUser'
    });
    const freeToken = freeLogin.data.token;
    
    try {
      await axios.post(`${baseURL}/api/ai/admin/enable-gpt5`, 
        { enabled: false },
        { headers: { Authorization: `Bearer ${freeToken}` } }
      );
      console.log('✗ ERRO: Usuário free conseguiu acessar rota admin!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✓ Usuário free bloqueado corretamente (403)');
      } else {
        throw err;
      }
    }
    
    console.log('\n✓ TESTE COMPLETO: Rota admin enable-gpt5 funcionando!');
    
  } catch (err) {
    console.error('✗ Falha:', err.response?.data || err.message);
    process.exit(1);
  }
}

testAdminGPT5();

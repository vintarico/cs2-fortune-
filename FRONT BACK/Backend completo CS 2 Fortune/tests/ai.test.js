process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index');

async function loginSteam() {
  const res = await request(app)
    .post('/api/login/steam')
    .send({ steamId: 'test-user-001', username: 'Test User' });
  return res.body.token;
}

describe('AI Routes (sem OpenAI)', () => {
  it('GET /api/ai/models deve listar modelos disponíveis', async () => {
    const token = await loginSteam();
    const res = await request(app)
      .get('/api/ai/models')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('models');
    expect(Array.isArray(res.body.models)).toBe(true);
    expect(res.body).toHaveProperty('defaultModel');
  });

  it('GET /api/ai/quota deve retornar quota do usuário', async () => {
    const token = await loginSteam();
    const res = await request(app)
      .get('/api/ai/quota')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('quota');
    expect(res.body.quota).toHaveProperty('limit');
  });
});

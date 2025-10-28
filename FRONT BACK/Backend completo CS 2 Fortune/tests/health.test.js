process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index');

describe('Health Check', () => {
  it('GET /health deve retornar status ok e DB up', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('db');
  });
});

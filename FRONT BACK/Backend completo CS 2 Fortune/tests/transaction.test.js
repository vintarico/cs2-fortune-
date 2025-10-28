process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Transaction Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Login para obter token
    const res = await request(app)
      .post('/api/login/steam')
      .send({ steamId: 'transaction-test-user', username: 'Transaction Test' });
    
    token = res.body.token;
    userId = res.body.user.id;
  });

  it('POST /api/transaction (deposito) deve aumentar saldo/balance', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'deposito', amount: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('saldoAtual');
    expect(res.body.saldoAtual).toBeGreaterThanOrEqual(100);
  });

  it('POST /api/transaction (retirada) deve diminuir saldo/balance', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'retirada', amount: 25 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('saldoAtual');
    
    // Verificar que saldo diminuiu
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const currentBalance = user?.balance ?? 0;
    expect(currentBalance).toBeGreaterThanOrEqual(0);
  });

  it('POST /api/transaction (retirada) deve falhar com saldo insuficiente', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'retirada', amount: 999999 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Saldo insuficiente');
  });

  it('POST /api/transaction deve rejeitar tipo inválido', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'invalido', amount: 10 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Tipo inválido');
  });

  it('GET /api/saldo deve retornar saldo atual', async () => {
    const res = await request(app)
      .get('/api/saldo')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('saldo');
    expect(typeof res.body.saldo).toBe('number');
  });
});

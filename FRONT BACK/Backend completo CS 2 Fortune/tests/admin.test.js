process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Admin Routes - GPT-5', () => {
  let adminToken;
  let freeUserToken;

  beforeAll(async () => {
    // Login como admin (do seed)
    const adminRes = await request(app)
      .post('/api/login/steam')
      .send({ steamId: 'admin-001', username: 'admin' });
    
    adminToken = adminRes.body.token;

    // Login como usuário free (não admin)
    const freeRes = await request(app)
      .post('/api/login/steam')
      .send({ steamId: 'free-test', username: 'Free User Test' });
    
    freeUserToken = freeRes.body.token;
  });

  it('POST /api/ai/admin/enable-gpt5 deve falhar sem ser admin', async () => {
    const res = await request(app)
      .post('/api/ai/admin/enable-gpt5')
      .set('Authorization', `Bearer ${freeUserToken}`)
      .send({ enabled: true });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Acesso negado');
  });

  it('POST /api/ai/admin/enable-gpt5 deve funcionar com admin', async () => {
    const res = await request(app)
      .post('/api/ai/admin/enable-gpt5')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ enabled: true });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.message).toContain('habilitado');
  });

  it('POST /api/ai/admin/enable-gpt5 deve habilitar para usuários específicos', async () => {
    // Buscar um usuário para testar
    const user = await prisma.user.findUnique({ where: { steamId: 'premium-001' } });

    const res = await request(app)
      .post('/api/ai/admin/enable-gpt5')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ 
        enabled: true,
        userIds: [user.id]
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('affectedUsers', 1);

    // Verificar que o usuário agora tem acesso
    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated.gpt5Access).toBe(true);
  });

  it('GET /api/ai/admin/usage-stats deve retornar estatísticas apenas para admin', async () => {
    const resAdmin = await request(app)
      .get('/api/ai/admin/usage-stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(resAdmin.status).toBe(200);
    expect(resAdmin.body).toHaveProperty('users');
    expect(resAdmin.body).toHaveProperty('flags');

    // Usuário free não deve ter acesso
    const resFree = await request(app)
      .get('/api/ai/admin/usage-stats')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(resFree.status).toBe(403);
  });

  it('Admin deve ter acesso a GPT-5 por padrão (seed)', async () => {
    const admin = await prisma.user.findUnique({ 
      where: { steamId: 'admin-001' },
      select: { gpt5Access: true, plan: true }
    });

    expect(admin.gpt5Access).toBe(true);
    expect(admin.plan).toBe('admin');
  });
});

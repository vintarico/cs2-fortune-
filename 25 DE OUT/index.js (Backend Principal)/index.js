const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Configuração CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// ============================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token necessário' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expirado ou inválido' });
    req.user = user;
    next();
  });
}

function authenticateAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  res.status(403).json({ error: "Acesso negado - Admin apenas" });
}

// ============================================
// ROTAS DE AUTENTICAÇÃO
// ============================================

// Login com Steam (simulado - integrar Steam OpenID real depois)
app.post('/api/login/steam', async (req, res) => {
  const { steamId, username } = req.body;
  
  if (!steamId) {
    return res.status(400).json({ error: 'SteamID requerido' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { steamId } });
    
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          steamId, 
          username: username || `User_${steamId.slice(-6)}`,
          saldo: 100.0 // Bônus inicial
        } 
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        steamId: user.steamId,
        isAdmin: user.isAdmin 
      }, 
      SECRET_KEY, 
      { expiresIn: '12h' }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        steamId: user.steamId,
        username: user.username,
        saldo: user.saldo,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROTAS DE USUÁRIO
// ============================================

// Obter saldo do usuário
app.get('/api/saldo', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      select: { saldo: true }
    });
    res.json({ saldo: user.saldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter perfil completo
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      include: {
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROTAS DE TRANSAÇÕES
// ============================================

// Criar transação (depósito, retirada, compra, venda)
app.post('/api/transaction', authenticateToken, async (req, res) => {
  const { type, amount } = req.body;
  
  if (!['deposito', 'retirada', 'compra', 'venda'].includes(type)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valor inválido' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    let newSaldo = user.saldo;

    if (type === 'deposito' || type === 'venda') {
      newSaldo += amount;
    } else if (type === 'retirada' || type === 'compra') {
      if (user.saldo < amount) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }
      newSaldo -= amount;
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        amount
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { saldo: newSaldo }
    });

    res.json({ 
      transaction, 
      saldoAtual: newSaldo,
      message: 'Transação realizada com sucesso'
    });
  } catch (error) {
    console.error('Erro na transação:', error);
    res.status(500).json({ error: error.message });
  }
});

// Listar transações do usuário
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROTAS DE PAGAMENTO
// ============================================

// Criar pagamento PIX via Mercado Pago
app.post('/api/payment/pix', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valor inválido' });
  }

  try {
    // Aqui você integraria com Mercado Pago SDK real
    // Exemplo simulado:
    const pixData = {
      qr_code: `00020126580014br.gov.bcb.pix013636${Date.now()}52040000530398654${amount}`,
      qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      payment_id: `PIX_${Date.now()}`,
      amount: amount,
      status: 'pending'
    };

    res.json(pixData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook Mercado Pago (receber confirmação de pagamento)
app.post('/api/webhook/mercadopago', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'payment') {
    // Processar pagamento confirmado
    console.log('Pagamento recebido:', data);
    // Atualizar saldo do usuário
  }
  
  res.status(200).send('OK');
});

// ============================================
// ROTAS DE 2FA
// ============================================

// Gerar QR Code para 2FA
app.post('/api/2fa/setup', authenticateToken, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ 
      length: 20, 
      name: `CS2Fortune (${req.user.steamId})` 
    });
    
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    
    // Salvar secret no usuário (temporariamente até confirmar)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { twoFactorSecret: secret.base32 }
    });
    
    res.json({ 
      secret: secret.base32, 
      qrCode: qrCodeUrl 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar token 2FA
app.post('/api/2fa/verify', authenticateToken, async (req, res) => {
  const { token } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id } 
    });
    
    if (!user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA não configurado' });
    }
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });
    
    if (verified) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { twoFactorEnabled: true }
      });
    }
    
    res.json({ verified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROTAS DE ADMIN
// ============================================

// Listar todos os usuários (admin)
app.get('/api/admin/users', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar todas as transações (admin)
app.get('/api/admin/transactions', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            steamId: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar saldo de usuário (admin)
app.patch('/api/admin/user/:id/saldo', authenticateToken, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { saldo } = req.body;
  
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { saldo: parseFloat(saldo) }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROTAS DE HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'CS 2 Fortune API',
    version: '1.0.0',
    endpoints: [
      '/api/login/steam',
      '/api/saldo',
      '/api/transaction',
      '/api/payment/pix',
      '/api/2fa/setup',
      '/api/admin/users'
    ]
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Backend CS 2 Fortune rodando na porta ${PORT}`);
  console.log(`🔗 URL: ${BASE_URL}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});

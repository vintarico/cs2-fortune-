// Atualize este arquivo para integrar as rotas de IA

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const SteamOpenID = require('steam-openid'); 
const axios = require('axios');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware para checar JWT
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

// Rota para login com Steam (simplificado)
app.post('/api/login/steam', async (req, res) => {
  const { steamId, username } = req.body;
  if (!steamId) {
    return res.status(400).json({ error: 'SteamID requerido' });
  }
  try {
    let user = await prisma.user.findUnique({ where: { steamId } });
    if (!user) {
      user = await prisma.user.create({ data: { steamId, username } });
    }
    const token = jwt.sign({ id: user.id, steamId: user.steamId }, SECRET_KEY, { expiresIn: '12h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter saldo do usuário
app.get('/api/saldo', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ saldo: user.saldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar transação (depósito, retirada)
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

    if (type === 'deposito') {
      newSaldo += amount;
    } else if (type === 'retirada') {
      if (user.saldo < amount) return res.status(400).json({ error: 'Saldo insuficiente' });
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

    res.json({ transaction, saldoAtual: newSaldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulação simples de pagamento Mercado Pago (criar preferência)
app.post('/api/payment/mercadopago', authenticateToken, async (req, res) => {
  const MercadoPago = require('mercadopago');
  MercadoPago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  });

  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Valor inválido' });

  const preference = {
    items: [{
      title: 'Depósito CS 2 Fortune',
      quantity: 1,
      unit_price: amount
    }],
    payer: {},
    back_urls: {
      success: `${BASE_URL}/success`,
      failure: `${BASE_URL}/failure`,
      pending: `${BASE_URL}/pending`
    },
    auto_return: 'approved'
  };

  try {
    const response = await MercadoPago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulação simples pagamento CoinPayments (gerar transação)
app.post('/api/payment/coinpayments', authenticateToken, async (req, res) => {
  const Coinpayments = require('coinpayments');
  const client = new Coinpayments({
    key: process.env.COINPAYMENTS_API_KEY,
    secret: process.env.COINPAYMENTS_API_SECRET
  });

  const { amount, currency } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Valor inválido' });
  if (!currency) return res.status(400).json({ error: 'Moeda não especificada' });

  try {
    const txn = await client.createTransaction({
      currency1: 'USD',
      currency2: currency,
      amount,
      buyer_email: 'user@example.com',
      custom: `UserID:${req.user.id}`
    });
    res.json(txn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 NOVAS ROTAS DE IA - ADICIONAR AQUI
const aiRoutes = require('./routes/ai');
app.use('/api/ai', authenticateToken, aiRoutes);

// Importar rotas admin (se existirem)
// const adminRoutes = require('./routes/admin');
// app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`🤖 Rotas de IA disponíveis em /api/ai/*`);
});

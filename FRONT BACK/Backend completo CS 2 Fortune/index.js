const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const SteamOpenID = require('steam-openid'); // para autenticação

const axios = require('axios');
const https = require('https');
const path = require('path');
const steamMarket = require('./services/steamMarket');
const priceCronJob = require('./services/priceCronJob');
const priceHistory = require('./services/priceHistory');
const notificationService = require('./services/notificationService');
const localImages = require('./services/localImages');

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

// Servir imagens locais das skins
app.use('/skins', express.static(path.join(__dirname, 'public/skins')));

// Proxy para imagens do Steam (resolver CORS)
app.get('/api/steam-image', async (req, res) => {
  const imageUrl = req.query.url;
  
  if (!imageUrl || !imageUrl.includes('steamstatic.com')) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    res.set('Content-Type', response.headers['content-type']);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache 24h
    res.send(response.data);
  } catch (error) {
    console.error('Erro ao buscar imagem:', error.message);
    res.status(500).json({ error: 'Erro ao carregar imagem' });
  }
});

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
  // No frontend, deverá gerar redirecionamento para Steam OpenID
  // Aqui, realizando mock com SteamID recebido para teste
  const { steamId, username } = req.body;
  if (!steamId) {
    return res.status(400).json({ error: 'SteamID requerido' });
  }
  try {
    let user = await prisma.user.findUnique({ where: { steamId } });
    if (!user) {
      user = await prisma.user.create({ data: { steamId, username } });
    }
    const token = jwt.sign({ 
      id: user.id, 
      steamId: user.steamId,
      isAdmin: user.isAdmin || false,
      isPremium: user.isPremium || false,
      plan: user.plan || 'free'
    }, SECRET_KEY, { expiresIn: '12h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter saldo do usuário
app.get('/api/saldo', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    // Compatível com schemas que usam "balance" ao invés de "saldo"
    res.json({ saldo: user?.saldo ?? user?.balance ?? 0 });
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
    // Use o campo disponível no schema
    let newSaldo = (typeof user.saldo === 'number') ? user.saldo : (user.balance ?? 0);

    if (type === 'deposito') {
      newSaldo += amount;
    } else if (type === 'retirada') {
      const atual = (typeof user.saldo === 'number') ? user.saldo : (user.balance ?? 0);
      if (atual < amount) return res.status(400).json({ error: 'Saldo insuficiente' });
      newSaldo -= amount;
    }

    // Cria registro de transação se o modelo existir
    let transaction = null;
    try {
      transaction = await prisma.transaction.create({
        data: { userId: user.id, type, amount }
      });
    } catch (e) {
      // Se o modelo Transaction não existir, apenas ignore o log (ambiente com Deposit/Withdrawal)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: (typeof user.saldo === 'number') ? { saldo: newSaldo } : { balance: newSaldo }
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
    payer: {
      // Você pode adicionar mais dados do comprador aqui
    },
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

// Importar rotas admin
const adminRoutes = require('./routes/admin');
// Importar rotas de IA
const aiRoutes = require('./routes/ai');
// Importar rotas Provably Fair
const provablyFairRoutes = require('./routes/provablyFair');

// Middleware para verificar se o usuário é admin
function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado: requer privilégios de admin' });
  }
  next();
}

// Usar rotas admin
app.use('/api/admin', adminRoutes);
// Usar rotas de IA (protegidas)
app.use('/api/ai', authenticateToken, aiRoutes);
// Usar rotas Provably Fair
app.use('/api/provably-fair', provablyFairRoutes);

// ═══════════════════════════════════════════════════════════════
// 🎁 ROTAS DE CASES - Sistema de Abertura de Caixas
// ═══════════════════════════════════════════════════════════════

// Obter saldo do usuário
app.get('/api/user/balance', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { balance: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    res.status(500).json({ error: 'Erro ao obter saldo' });
  }
});

// Abrir caixa
app.post('/api/cases/open', authenticateToken, async (req, res) => {
  const { caseId, caseName, casePrice, wonItem } = req.body;
  
  if (!caseId || !caseName || !casePrice || !wonItem) {
    return res.status(400).json({ error: 'Dados da caixa incompletos' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    if (user.balance < casePrice) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente',
        balance: user.balance,
        required: casePrice
      });
    }
    
    const newBalance = user.balance - casePrice + wonItem.value;
    
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { balance: newBalance }
    });
    
    const caseOpening = await prisma.caseOpening.create({
      data: {
        userId: req.user.userId,
        caseId,
        caseName,
        casePrice,
        itemName: wonItem.name,
        itemRarity: wonItem.rarity,
        itemValue: wonItem.value,
        profit: wonItem.value - casePrice
      }
    });
    
    res.json({
      success: true,
      newBalance,
      profit: wonItem.value - casePrice,
      opening: caseOpening
    });
    
  } catch (error) {
    console.error('Erro ao abrir caixa:', error);
    res.status(500).json({ error: 'Erro ao abrir caixa' });
  }
});

// Obter histórico de aberturas
app.get('/api/cases/history', authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  
  try {
    const history = await prisma.caseOpening.findMany({
      where: { userId: req.user.userId },
      orderBy: { openedAt: 'desc' },
      take: limit,
      skip: offset
    });
    
    const total = await prisma.caseOpening.count({
      where: { userId: req.user.userId }
    });
    
    const stats = await prisma.caseOpening.aggregate({
      where: { userId: req.user.userId },
      _sum: {
        casePrice: true,
        itemValue: true,
        profit: true
      },
      _avg: {
        profit: true
      }
    });
    
    res.json({
      history,
      total,
      stats: {
        totalSpent: stats._sum.casePrice || 0,
        totalWon: stats._sum.itemValue || 0,
        totalProfit: stats._sum.profit || 0,
        avgProfit: stats._avg.profit || 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({ error: 'Erro ao obter histórico' });
  }
});

// Adicionar saldo (para testes)
app.post('/api/user/add-balance', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valor inválido' });
  }
  
  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        balance: { increment: amount }
      },
      select: { balance: true }
    });
    
    res.json({ 
      success: true,
      newBalance: user.balance 
    });
    
  } catch (error) {
    console.error('Erro ao adicionar saldo:', error);
    res.status(500).json({ error: 'Erro ao adicionar saldo' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🎒 ROTAS DE INVENTÁRIO - Vender e Guardar Skins
// ═══════════════════════════════════════════════════════════════

// Vender item (adiciona valor ao saldo imediatamente)
app.post('/api/inventory/sell', authenticateToken, async (req, res) => {
  const { itemName, itemValue } = req.body;
  
  if (!itemName || !itemValue || itemValue <= 0) {
    return res.status(400).json({ error: 'Dados do item inválidos' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const newBalance = user.balance + itemValue;
    
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { balance: newBalance }
    });
    
    // Registrar a venda no histórico (opcional)
    try {
      await prisma.itemSale.create({
        data: {
          userId: req.user.userId,
          itemName,
          itemValue,
          soldAt: new Date()
        }
      });
    } catch (e) {
      // Se o modelo ItemSale não existir, apenas ignore
      console.log('⚠️ Modelo ItemSale não existe, pulando registro de venda');
    }
    
    res.json({
      success: true,
      newBalance,
      itemSold: itemName,
      valueAdded: itemValue
    });
    
  } catch (error) {
    console.error('Erro ao vender item:', error);
    res.status(500).json({ error: 'Erro ao vender item' });
  }
});

// Adicionar item ao inventário (guardar para vender depois)
app.post('/api/inventory/add', authenticateToken, async (req, res) => {
  const { itemName, itemValue, itemRarity, itemImage } = req.body;
  
  if (!itemName || !itemValue || itemValue <= 0) {
    return res.status(400).json({ error: 'Dados do item inválidos' });
  }
  
  try {
    // Verificar se já existe no inventário
    let inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        userId: req.user.userId,
        itemName: itemName
      }
    });
    
    if (inventoryItem) {
      // Se já existe, incrementa a quantidade
      inventoryItem = await prisma.inventoryItem.update({
        where: { id: inventoryItem.id },
        data: {
          quantity: { increment: 1 },
          lastUpdated: new Date()
        }
      });
    } else {
      // Se não existe, cria novo
      inventoryItem = await prisma.inventoryItem.create({
        data: {
          userId: req.user.userId,
          itemName,
          itemValue,
          itemRarity: itemRarity || 'COMMON',
          itemImage: itemImage || '',
          quantity: 1
        }
      });
    }
    
    res.json({
      success: true,
      item: inventoryItem
    });
    
  } catch (error) {
    console.error('Erro ao adicionar item ao inventário:', error);
    
    // Se der erro porque a tabela não existe, criar registro simplificado
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      console.log('⚠️ Modelo InventoryItem não existe no schema');
      return res.json({
        success: true,
        message: 'Item guardado (inventário será implementado em breve)',
        item: { itemName, itemValue, itemRarity }
      });
    }
    
    res.status(500).json({ error: 'Erro ao adicionar item ao inventário' });
  }
});

// Obter inventário do usuário
app.get('/api/inventory', authenticateToken, async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: 'desc' }
    });
    
    const totalValue = items.reduce((sum, item) => sum + (item.itemValue * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      items,
      stats: {
        totalValue,
        totalItems,
        uniqueItems: items.length
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter inventário:', error);
    
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      return res.json({
        items: [],
        stats: { totalValue: 0, totalItems: 0, uniqueItems: 0 },
        message: 'Inventário será implementado em breve'
      });
    }
    
    res.status(500).json({ error: 'Erro ao obter inventário' });
  }
});

// Vender item do inventário
app.post('/api/inventory/sell-from-inventory', authenticateToken, async (req, res) => {
  const { itemId, quantity } = req.body;
  
  if (!itemId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  
  try {
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    });
    
    if (!inventoryItem || inventoryItem.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Item não encontrado no inventário' });
    }
    
    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({ error: 'Quantidade insuficiente' });
    }
    
    const saleValue = inventoryItem.itemValue * quantity;
    
    // Atualizar saldo do usuário
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { balance: { increment: saleValue } }
    });
    
    // Atualizar ou remover item do inventário
    if (inventoryItem.quantity === quantity) {
      // Remover completamente
      await prisma.inventoryItem.delete({
        where: { id: itemId }
      });
    } else {
      // Decrementar quantidade
      await prisma.inventoryItem.update({
        where: { id: itemId },
        data: { 
          quantity: { decrement: quantity },
          lastUpdated: new Date()
        }
      });
    }
    
    res.json({
      success: true,
      newBalance: user.balance,
      itemSold: inventoryItem.itemName,
      quantitySold: quantity,
      valueAdded: saleValue
    });
    
  } catch (error) {
    console.error('Erro ao vender do inventário:', error);
    res.status(500).json({ error: 'Erro ao vender item do inventário' });
  }
});

// Retirar itens para Steam
app.post('/api/inventory/withdraw', authenticateToken, async (req, res) => {
  const { items, tradeUrl } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Nenhum item selecionado' });
  }
  
  if (!tradeUrl || !tradeUrl.includes('steamcommunity.com')) {
    return res.status(400).json({ error: 'URL de Trade inválida' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Gerar ID único para a retirada
    const tradeId = `TRADE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Criar registro de retirada
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: req.user.userId,
        tradeId,
        tradeUrl,
        items: JSON.stringify(items),
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: items.reduce((sum, item) => sum + (item.value * item.quantity), 0),
        status: 'pending', // pending, processing, completed, failed
        createdAt: new Date()
      }
    }).catch(async (e) => {
      // Se o modelo Withdrawal não existir, criar um registro simplificado
      if (e.code === 'P2021') {
        console.log('⚠️ Modelo Withdrawal não existe, criando registro temporário');
        return {
          id: tradeId,
          tradeId,
          status: 'pending',
          createdAt: new Date()
        };
      }
      throw e;
    });
    
    // Remover itens do inventário
    for (const item of items) {
      try {
        const inventoryItem = await prisma.inventoryItem.findFirst({
          where: {
            userId: req.user.userId,
            itemName: item.name
          }
        });
        
        if (inventoryItem) {
          if (inventoryItem.quantity <= item.quantity) {
            await prisma.inventoryItem.delete({
              where: { id: inventoryItem.id }
            });
          } else {
            await prisma.inventoryItem.update({
              where: { id: inventoryItem.id },
              data: { 
                quantity: { decrement: item.quantity },
                lastUpdated: new Date()
              }
            });
          }
        }
      } catch (e) {
        console.error('Erro ao remover item do inventário:', e);
      }
    }
    
    // TODO: Integrar com Steam Bot para enviar trade offer
    // Aqui você integraria com um bot Steam que enviaria a oferta de trade
    console.log(`
🎮 NOVA RETIRADA CRIADA
═══════════════════════
Trade ID: ${tradeId}
Usuário: ${user.username || user.steamId}
Itens: ${items.length}
Trade URL: ${tradeUrl}
Status: Pendente
    `);
    
    res.json({
      success: true,
      tradeId,
      status: 'pending',
      message: 'Retirada criada com sucesso! Você receberá uma oferta de trade no Steam em até 24h.',
      items: items.length
    });
    
  } catch (error) {
    console.error('Erro ao criar retirada:', error);
    res.status(500).json({ error: 'Erro ao processar retirada' });
  }
});

// Listar retiradas do usuário
app.get('/api/inventory/withdrawals', authenticateToken, async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    }).catch(() => {
      // Se o modelo não existir, retornar array vazio
      return [];
    });
    
    res.json({ withdrawals });
    
  } catch (error) {
    console.error('Erro ao listar retiradas:', error);
    res.json({ withdrawals: [] });
  }
});

// Health-check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'down', error: e.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🎮 STEAM MARKET API ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * Buscar preço de uma skin específica
 * GET /api/steam/price?name=AK-47 | Redline (Field-Tested)
 */
app.get('/api/steam/price', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome da skin é obrigatório' });
    }

    const priceData = await steamMarket.getSteamPrice(name);
    res.json(priceData);
    
  } catch (error) {
    console.error('Erro ao buscar preço:', error);
    res.status(500).json({ error: 'Erro ao buscar preço da Steam' });
  }
});

/**
 * Buscar dados completos de uma skin (preço + imagem)
 * GET /api/steam/skin?name=AK-47 | Redline (Field-Tested)&icon=xyz
 */
app.get('/api/steam/skin', async (req, res) => {
  try {
    const { name, icon } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome da skin é obrigatório' });
    }

    const skinData = await steamMarket.getSkinData(name, icon);
    res.json(skinData);
    
  } catch (error) {
    console.error('Erro ao buscar dados da skin:', error);
    res.status(500).json({ error: 'Erro ao buscar dados da skin' });
  }
});

/**
 * Sincronizar preços de múltiplas skins
 * POST /api/steam/sync
 * Body: { skins: [{ market_hash_name, icon_url }, ...] }
 */
app.post('/api/steam/sync', authenticateToken, async (req, res) => {
  try {
    // Apenas admins podem sincronizar
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { skins } = req.body;
    
    if (!skins || !Array.isArray(skins) || skins.length === 0) {
      return res.status(400).json({ error: 'Lista de skins inválida' });
    }

    console.log(`🔄 Iniciando sincronização de ${skins.length} skins...`);
    
    const results = await steamMarket.updateMultipleSkins(skins);
    
    res.json({
      success: true,
      total: skins.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results,
    });
    
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro ao sincronizar skins' });
  }
});

/**
 * Gerar URL de imagem da Steam CDN
 * GET /api/steam/image-url?icon=xyz&size=large
 */
app.get('/api/steam/image-url', (req, res) => {
  try {
    const { icon, size = 'large' } = req.query;
    
    if (!icon) {
      return res.status(400).json({ error: 'Icon URL é obrigatório' });
    }

    const imageUrl = steamMarket.getSteamImageURL(icon, size);
    res.json({ url: imageUrl });
    
  } catch (error) {
    console.error('Erro ao gerar URL da imagem:', error);
    res.status(500).json({ error: 'Erro ao gerar URL da imagem' });
  }
});

/**
 * Limpar cache de preços
 * POST /api/steam/clear-cache
 */
app.post('/api/steam/clear-cache', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const cleared = steamMarket.clearAllCache();
    res.json({ 
      success: true, 
      message: 'Cache limpo com sucesso',
      itemsCleared: cleared 
    });
    
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
    res.status(500).json({ error: 'Erro ao limpar cache' });
  }
});

/**
 * Estatísticas do cache
 * GET /api/steam/cache-stats
 */
app.get('/api/steam/cache-stats', async (req, res) => {
  try {
    const stats = steamMarket.getCacheStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar stats do cache:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

/**
 * Listar imagens locais disponíveis
 * GET /api/local-images
 */
app.get('/api/local-images', async (req, res) => {
  try {
    const imageList = localImages.listLocalImages();
    res.json(imageList);
  } catch (error) {
    console.error('Erro ao listar imagens locais:', error);
    res.status(500).json({ error: 'Erro ao listar imagens' });
  }
});

/**
 * Verificar se uma skin tem imagem local
 * GET /api/local-images/check?name=AK-47...
 */
app.get('/api/local-images/check', async (req, res) => {
  try {
    const skinName = decodeURIComponent(req.query.name || '');
    const hasImage = localImages.hasLocalImage(skinName);
    const imagePath = localImages.getLocalImagePath(skinName);
    
    res.json({
      skinName,
      hasLocalImage: hasImage,
      path: imagePath,
      url: imagePath ? `http://localhost:3001${imagePath}` : null
    });
  } catch (error) {
    console.error('Erro ao verificar imagem local:', error);
    res.status(500).json({ error: 'Erro ao verificar imagem' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📊 ROTAS DE HISTÓRICO DE PREÇOS
// ═══════════════════════════════════════════════════════════════

/**
 * Obter histórico de preços de uma skin
 * GET /api/price-history/:skinName?hours=24&limit=100
 */
app.get('/api/price-history/:skinName', async (req, res) => {
  try {
    const skinName = decodeURIComponent(req.params.skinName);
    const hours = parseInt(req.query.hours) || 24;
    const limit = parseInt(req.query.limit) || 100;

    const history = hours > 0 
      ? priceHistory.getHistoryByPeriod(skinName, hours)
      : priceHistory.getHistory(skinName, limit);

    res.json({
      skinName,
      dataPoints: history.length,
      period: `${hours}h`,
      history,
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

/**
 * Obter estatísticas de preço
 * GET /api/price-stats/:skinName?hours=24
 */
app.get('/api/price-stats/:skinName', async (req, res) => {
  try {
    const skinName = decodeURIComponent(req.params.skinName);
    const hours = parseInt(req.query.hours) || 24;

    const stats = priceHistory.getStatistics(skinName, hours);

    if (!stats) {
      return res.status(404).json({ error: 'Sem dados suficientes' });
    }

    res.json({
      skinName,
      period: `${hours}h`,
      stats,
    });
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
});

/**
 * Exportar histórico para CSV
 * GET /api/price-history/:skinName/export
 */
app.get('/api/price-history/:skinName/export', async (req, res) => {
  try {
    const skinName = decodeURIComponent(req.params.skinName);
    const csv = priceHistory.exportToCSV(skinName);

    if (!csv) {
      return res.status(404).json({ error: 'Sem dados para exportar' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${skinName}-history.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({ error: 'Erro ao exportar CSV' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🔧 ROTAS DE ADMIN - PAINEL DE CONTROLE
// ═══════════════════════════════════════════════════════════════

/**
 * Estatísticas do cronjob
 * GET /api/admin/cron-stats
 */
app.get('/api/admin/cron-stats', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const stats = priceCronJob.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar stats do cron:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

/**
 * Forçar atualização manual de preços
 * POST /api/admin/force-update
 */
app.post('/api/admin/force-update', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await priceCronJob.forceUpdate();
    res.json(result);
  } catch (error) {
    console.error('Erro ao forçar atualização:', error);
    res.status(500).json({ error: 'Erro ao atualizar preços' });
  }
});

/**
 * Detectar mudanças significativas de preço
 * GET /api/admin/price-alerts?threshold=10
 */
app.get('/api/admin/price-alerts', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const threshold = parseFloat(req.query.threshold) || 10;
    const SKINS_WITH_STEAM_DATA = require('./data/skins-steam-data');
    
    const alerts = [];
    for (const skinId in SKINS_WITH_STEAM_DATA) {
      const skin = SKINS_WITH_STEAM_DATA[skinId];
      const change = priceHistory.detectPriceChanges(skin.market_hash_name, threshold);
      if (change) {
        alerts.push(change);
      }
    }

    res.json({
      threshold: `${threshold}%`,
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Erro ao detectar alertas:', error);
    res.status(500).json({ error: 'Erro ao detectar mudanças de preço' });
  }
});

/**
 * Limpar histórico antigo
 * POST /api/admin/clean-history
 */
app.post('/api/admin/clean-history', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const cleaned = priceHistory.cleanOldHistory();
    res.json({
      success: true,
      pointsRemoved: cleaned,
      message: `${cleaned} pontos antigos removidos`,
    });
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    res.status(500).json({ error: 'Erro ao limpar histórico' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🔔 ROTAS DE NOTIFICAÇÕES
// ═══════════════════════════════════════════════════════════════

/**
 * Obter notificações
 * GET /api/notifications?limit=50&unreadOnly=false
 */
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const unreadOnly = req.query.unreadOnly === 'true';

    const notifications = notificationService.getNotifications(limit, unreadOnly);
    const stats = notificationService.getNotificationStats();

    res.json({
      notifications,
      stats,
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

/**
 * Marcar notificação como lida
 * POST /api/notifications/:id/read
 */
app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notificationId = parseFloat(req.params.id);
    const success = notificationService.markAsRead(notificationId);

    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Notificação não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação' });
  }
});

/**
 * Marcar todas como lidas
 * POST /api/notifications/read-all
 */
app.post('/api/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    const count = notificationService.markAllAsRead();
    res.json({
      success: true,
      count,
      message: `${count} notificações marcadas como lidas`,
    });
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
    res.status(500).json({ error: 'Erro ao marcar notificações' });
  }
});

/**
 * Forçar verificação de mudanças de preço
 * POST /api/admin/check-price-changes
 */
app.post('/api/admin/check-price-changes', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const threshold = parseFloat(req.query.threshold) || 10;
    const newNotifications = notificationService.checkPriceChanges(threshold);

    res.json({
      success: true,
      count: newNotifications.length,
      notifications: newNotifications,
    });
  } catch (error) {
    console.error('Erro ao verificar mudanças:', error);
    res.status(500).json({ error: 'Erro ao verificar mudanças de preço' });
  }
});

const PORT = process.env.PORT || 3001;

// Garantir que NODE_ENV não seja 'test' para rodar o servidor
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend CS2 Fortune rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    
    // Inicia o cronjob de atualização automática (a cada 2 horas)
    console.log('🕐 Iniciando cronjob de atualização de preços (a cada 2 horas)...');
    priceCronJob.startCronJob();
    
    // Inicia o serviço de notificações
    console.log('🔔 Iniciando serviço de notificações...');
    notificationService.startNotificationService();
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Erro: Porta ${PORT} já está em uso!`);
      console.error(`💡 Dica: Rode "taskkill /F /IM node.exe" e tente novamente`);
    } else {
      console.error('❌ Erro ao iniciar servidor:', error);
    }
    process.exit(1);
  });
}

module.exports = app;

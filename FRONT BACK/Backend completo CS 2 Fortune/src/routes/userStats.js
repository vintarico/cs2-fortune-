const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../../middleware/auth');

const prisma = new PrismaClient();

// Obter estatísticas completas do usuário
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const timeframe = req.query.timeframe || '7d';
    
    // Calcular data de início baseada no timeframe
    const now = new Date();
    let startDate = new Date(0); // Data muito antiga para 'all'
    
    switch (timeframe) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0);
        break;
    }

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        createdAt: true,
        level: true,
        totalXP: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Buscar histórico de cases no período
    const caseHistory = await prisma.caseOpening.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        case: true,
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Buscar inventário atual
    const inventory = await prisma.inventoryItem.findMany({
      where: { userId: userId },
      include: {
        item: true
      }
    });

    // Buscar transações de venda no período
    const soldItems = await prisma.transaction.findMany({
      where: {
        userId: userId,
        type: 'SALE',
        createdAt: {
          gte: startDate
        }
      }
    });

    // Calcular estatísticas básicas
    const totalCasesOpened = caseHistory.length;
    const totalSpent = caseHistory.reduce((sum, opening) => sum + opening.case.price, 0);
    const totalReceived = caseHistory.reduce((sum, opening) => sum + (opening.item?.price || 0), 0);
    const totalProfit = totalReceived - totalSpent;
    
    // Calcular maior ganho
    const biggestWin = Math.max(...caseHistory.map(opening => 
      (opening.item?.price || 0) - opening.case.price
    ), 0);

    // Calcular maior perda
    const biggestLoss = Math.min(...caseHistory.map(opening => 
      (opening.item?.price || 0) - opening.case.price
    ), 0);

    // Calcular valor médio por case
    const averageCaseValue = totalCasesOpened > 0 ? totalReceived / totalCasesOpened : 0;

    // Calcular taxa de lucro
    const profitRate = totalSpent > 0 ? totalProfit / totalSpent : 0;

    // Encontrar case favorita
    const casesByType = {};
    caseHistory.forEach(opening => {
      const caseName = opening.case.name;
      casesByType[caseName] = (casesByType[caseName] || 0) + 1;
    });
    
    const favoriteCaseName = Object.keys(casesByType).reduce((a, b) => 
      casesByType[a] > casesByType[b] ? a : b
    , '');

    // Encontrar melhor item obtido
    const bestItem = caseHistory.reduce((best, opening) => {
      if (!opening.item) return best;
      if (!best || opening.item.price > best.price) {
        return opening.item;
      }
      return best;
    }, null);

    // Calcular estatísticas de inventário
    const totalItemsOwned = inventory.length;
    const totalInventoryValue = inventory.reduce((sum, invItem) => 
      sum + (invItem.item?.price || 0), 0
    );
    const totalItemsSold = soldItems.length;
    const retentionRate = totalCasesOpened > 0 ? 
      (totalCasesOpened - totalItemsSold) / totalCasesOpened : 0;

    // Calcular itens por raridade
    const itemsByRarity = {};
    inventory.forEach(invItem => {
      if (invItem.item?.rarity) {
        const rarity = invItem.item.rarity;
        itemsByRarity[rarity] = (itemsByRarity[rarity] || 0) + 1;
      }
    });

    // Calcular sequências
    let currentStreak = 0;
    let currentStreakType = '';
    let bestStreak = 0;
    let worstStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;

    for (let i = caseHistory.length - 1; i >= 0; i--) {
      const opening = caseHistory[i];
      const profit = (opening.item?.price || 0) - opening.case.price;
      
      if (profit > 0) {
        tempWinStreak++;
        tempLossStreak = 0;
        if (i === 0) { // Último item (mais recente)
          currentStreak = tempWinStreak;
          currentStreakType = 'vitórias';
        }
      } else {
        tempLossStreak++;
        tempWinStreak = 0;
        if (i === 0) { // Último item (mais recente)
          currentStreak = tempLossStreak;
          currentStreakType = 'perdas';
        }
      }
      
      bestStreak = Math.max(bestStreak, tempWinStreak);
      worstStreak = Math.max(worstStreak, tempLossStreak);
    }

    // Calcular lucro médio
    const averageProfit = totalCasesOpened > 0 ? totalProfit / totalCasesOpened : 0;

    // Calcular melhor e pior dia (simulado - você pode implementar groupBy por dia)
    const bestDay = biggestWin;
    const worstDay = biggestLoss;

    // Calcular dias consecutivos (simulado)
    const daysSinceCreation = Math.floor((now - user.createdAt) / (1000 * 60 * 60 * 24));
    const consecutiveDays = Math.min(daysSinceCreation, 30); // Exemplo: máximo 30 dias

    // Montar resposta
    const statistics = {
      // Dados básicos
      currentBalance: user.balance,
      totalCasesOpened,
      totalSpent,
      totalReceived,
      totalProfit,
      
      // Performance
      biggestWin,
      biggestLoss: Math.abs(biggestLoss),
      averageCaseValue,
      profitRate,
      averageProfit,
      
      // Cases
      casesByType,
      favoriteCaseName: favoriteCaseName || null,
      bestItemName: bestItem?.name || null,
      bestItemValue: bestItem?.price || 0,
      
      // Inventário
      totalItemsOwned,
      totalInventoryValue,
      totalItemsSold,
      retentionRate,
      itemsByRarity,
      
      // Sequências e recordes
      currentStreak,
      currentStreakType,
      bestStreak,
      worstStreak,
      bestDay,
      worstDay: Math.abs(worstDay),
      
      // Nível e progressão
      level: user.level || 1,
      totalXP: user.totalXP || 0,
      consecutiveDays,
      firstGameDate: user.createdAt,
      
      // Metadados
      timeframe,
      dataUpdatedAt: new Date(),
      totalDaysPlaying: daysSinceCreation
    };

    res.json(statistics);

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas detalhadas por período
router.get('/statistics/detailed/:period', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const period = req.params.period; // 'daily', 'weekly', 'monthly'
    
    let groupByFormat;
    let days;
    
    switch (period) {
      case 'daily':
        groupByFormat = '%Y-%m-%d';
        days = 30;
        break;
      case 'weekly':
        groupByFormat = '%Y-%u';
        days = 84; // 12 semanas
        break;
      case 'monthly':
        groupByFormat = '%Y-%m';
        days = 365; // 12 meses
        break;
      default:
        return res.status(400).json({ error: 'Período inválido' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Esta é uma versão simplificada - em produção você faria GROUP BY com SQL raw
    const caseHistory = await prisma.caseOpening.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        case: true,
        item: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Agrupar dados por período
    const groupedData = {};
    
    caseHistory.forEach(opening => {
      const date = opening.createdAt;
      let key;
      
      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          casesOpened: 0,
          totalSpent: 0,
          totalReceived: 0,
          profit: 0
        };
      }
      
      groupedData[key].casesOpened++;
      groupedData[key].totalSpent += opening.case.price;
      groupedData[key].totalReceived += (opening.item?.price || 0);
      groupedData[key].profit = groupedData[key].totalReceived - groupedData[key].totalSpent;
    });

    const chartData = Object.values(groupedData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.json({
      period,
      data: chartData,
      summary: {
        totalPeriods: chartData.length,
        totalCases: chartData.reduce((sum, item) => sum + item.casesOpened, 0),
        totalProfit: chartData.reduce((sum, item) => sum + item.profit, 0),
        averagePerPeriod: chartData.length > 0 ? 
          chartData.reduce((sum, item) => sum + item.profit, 0) / chartData.length : 0
      }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas detalhadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter ranking de usuários (top players)
router.get('/statistics/ranking', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || 'profit'; // 'profit', 'cases', 'level'
    
    let orderBy;
    switch (type) {
      case 'cases':
        // Para cases, precisaríamos fazer uma query mais complexa
        // Por simplicidade, usando level como proxy
        orderBy = { level: 'desc' };
        break;
      case 'level':
        orderBy = { level: 'desc' };
        break;
      case 'profit':
      default:
        orderBy = { balance: 'desc' };
        break;
    }

    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        level: true,
        balance: true,
        totalXP: true,
        createdAt: true
      },
      orderBy,
      take: limit
    });

    // Para cada usuário, calcular estatísticas adicionais
    const ranking = await Promise.all(topUsers.map(async (user, index) => {
      const caseCount = await prisma.caseOpening.count({
        where: { userId: user.id }
      });

      const inventoryValue = await prisma.inventoryItem.aggregate({
        where: { userId: user.id },
        _sum: {
          price: true
        }
      });

      return {
        position: index + 1,
        userId: user.id,
        username: user.username,
        level: user.level || 1,
        balance: user.balance,
        totalXP: user.totalXP || 0,
        casesOpened: caseCount,
        inventoryValue: inventoryValue._sum.price || 0,
        memberSince: user.createdAt
      };
    }));

    res.json({
      type,
      ranking,
      updatedAt: new Date()
    });

  } catch (error) {
    console.error('Erro ao obter ranking:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware para verificar e controlar quota de uso de IA
 */

/**
 * Verifica se usuário tem quota disponível antes de processar requisição
 */
async function checkAIQuota(req, res, next) {
  try {
    const userId = req.user.id;
    const estimatedTokens = req.body.estimatedTokens || 1000; // Estimativa padrão

    // Buscar usuário com informações de quota
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isAdmin: true,
        isPremium: true,
        plan: true,
        aiQuota: true,
        aiUsage: true,
        aiUsageResetAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Admin tem quota ilimitada
    if (user.isAdmin) {
      req.user = user;
      return next();
    }

    // Verificar se precisa resetar quota mensal
    const now = new Date();
    const resetDate = user.aiUsageResetAt || new Date(0);
    
    if (now > resetDate) {
      // Resetar quota (novo mês)
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await prisma.user.update({
        where: { id: userId },
        data: {
          aiUsage: 0,
          aiUsageResetAt: nextMonth
        }
      });

      user.aiUsage = 0;
    }

    // Verificar quota disponível
    const quotaLimit = user.aiQuota || 10000; // 10k padrão para free
    const currentUsage = user.aiUsage || 0;

    if (currentUsage + estimatedTokens > quotaLimit) {
      return res.status(429).json({
        error: 'Quota de IA excedida',
        details: {
          used: currentUsage,
          limit: quotaLimit,
          remaining: Math.max(0, quotaLimit - currentUsage),
          resetAt: user.aiUsageResetAt
        },
        suggestion: 'Faça upgrade para um plano superior para mais quota'
      });
    }

    // Adicionar informações ao request
    req.user = user;
    req.quotaInfo = {
      limit: quotaLimit,
      used: currentUsage,
      remaining: quotaLimit - currentUsage
    };

    next();
  } catch (error) {
    console.error('Erro ao verificar quota:', error);
    res.status(500).json({ error: 'Erro ao verificar quota de IA' });
  }
}

/**
 * Atualiza o uso de tokens após requisição bem-sucedida
 */
async function updateAIUsage(userId, tokensUsed, cost = 0) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        aiUsage: {
          increment: tokensUsed
        },
        aiTotalCost: {
          increment: cost
        }
      }
    });

    // Registrar no histórico (opcional)
    await prisma.aIUsageLog.create({
      data: {
        userId,
        tokensUsed,
        cost,
        timestamp: new Date()
      }
    });

    return true;
  } catch (error) {
    console.error('Erro ao atualizar uso de IA:', error);
    return false;
  }
}

/**
 * Middleware para rate limiting de requisições de IA
 */
const rateLimitMap = new Map();

function rateLimitAI(maxRequests = 10, windowMs = 60000) {
  return (req, res, next) => {
    const userId = req.user.id;
    const now = Date.now();
    
    if (!rateLimitMap.has(userId)) {
      rateLimitMap.set(userId, []);
    }

    const userRequests = rateLimitMap.get(userId);
    
    // Remover requisições antigas
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Muitas requisições',
        details: {
          limit: maxRequests,
          window: `${windowMs / 1000}s`,
          retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
        }
      });
    }

    recentRequests.push(now);
    rateLimitMap.set(userId, recentRequests);

    next();
  };
}

module.exports = {
  checkAIQuota,
  updateAIUsage,
  rateLimitAI
};

const express = require('express');
const router = express.Router();
const openaiService = require('../services/openai');
const featureFlags = require('../config/features');
const { checkAIQuota, updateAIUsage, rateLimitAI } = require('../middleware/quota');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Rotas de IA para o CS2 Fortune
 * Suporta múltiplos modelos GPT com controle de acesso
 */

/**
 * POST /api/ai/chat
 * Chat geral com IA - análise de estratégias, dicas, etc
 */
router.post('/chat', checkAIQuota, rateLimitAI(20, 60000), async (req, res) => {
  try {
    const { message, context, modelPreference } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const user = req.user;

    // Determinar modelo a usar
    let model = modelPreference || openaiService.getModelForUser(user);

    // Verificar se usuário pode usar o modelo solicitado
    if (modelPreference && !featureFlags.canUseModel(user, modelPreference)) {
      return res.status(403).json({
        error: `Você não tem acesso ao modelo ${modelPreference}`,
        availableModels: openaiService.getAvailableModels(user)
      });
    }

    // Construir mensagens
    const messages = [
      {
        role: 'system',
        content: 'Você é um assistente especializado em CS2 Fortune. Ajude o usuário com estratégias, análises de probabilidade e decisões inteligentes.'
      },
      ...(context ? [{ role: 'system', content: `Contexto: ${context}` }] : []),
      {
        role: 'user',
        content: message
      }
    ];

    // Fazer requisição para OpenAI
    const result = await openaiService.chatCompletion(model, messages, {
      maxTokens: 500,
      temperature: 0.7
    });

    if (!result.success) {
      return res.status(500).json({
        error: 'Erro ao processar requisição',
        details: result.error
      });
    }

    // Atualizar uso de tokens
    await updateAIUsage(user.id, result.usage.total_tokens, result.cost);

    res.json({
      success: true,
      response: result.data.choices[0].message.content,
      model: model,
      usage: result.usage,
      cost: result.cost,
      quotaRemaining: req.quotaInfo.remaining - result.usage.total_tokens
    });

  } catch (error) {
    console.error('Erro em /api/ai/chat:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/ai/analyze-case
 * Analisa probabilidades de uma caixa específica
 */
router.post('/analyze-case', checkAIQuota, rateLimitAI(10, 60000), async (req, res) => {
  try {
    const { caseId, userBudget } = req.body;

    if (!caseId) {
      return res.status(400).json({ error: 'ID da caixa é obrigatório' });
    }

    // Buscar dados da caixa
    const caseData = await prisma.case.findUnique({
      // Nos schemas atuais, Case.id é String (uuid). Manter compatibilidade
      where: { id: String(caseId) },
      // No schema atual a relação é "items" (CaseItem[])
      include: { items: true }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Caixa não encontrada' });
    }

    const user = req.user;
    const model = openaiService.getModelForUser(user);

    const messages = [
      {
        role: 'system',
        content: 'Você é um analista especializado em probabilidades de CS2. Analise os dados e forneça recomendações.'
      },
      {
        role: 'user',
        content: `Analise esta caixa:
Nome: ${caseData.name}
Preço: R$ ${caseData.price}
Orçamento do usuário: R$ ${userBudget || 'não informado'}

Forneça uma análise de custo-benefício e recomendações.`
      }
    ];

    const result = await openaiService.chatCompletion(model, messages, {
      maxTokens: 400
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    await updateAIUsage(user.id, result.usage.total_tokens, result.cost);

    res.json({
      success: true,
      analysis: result.data.choices[0].message.content,
      caseInfo: {
        name: caseData.name,
        price: caseData.price
      },
      model: model,
      usage: result.usage
    });

  } catch (error) {
    console.error('Erro em /api/ai/analyze-case:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/ai/quota
 * Retorna informações de quota do usuário
 */
router.get('/quota', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        aiQuota: true,
        aiUsage: true,
        aiUsageResetAt: true,
        aiTotalCost: true,
        plan: true
      }
    });

    const quotaInfo = featureFlags.getQuotaInfo(user);

    res.json({
      quota: quotaInfo,
      plan: user.plan,
      totalCostAllTime: user.aiTotalCost,
      resetAt: user.aiUsageResetAt
    });

  } catch (error) {
    console.error('Erro ao buscar quota:', error);
    res.status(500).json({ error: 'Erro ao buscar informações de quota' });
  }
});

/**
 * GET /api/ai/models
 * Lista modelos disponíveis para o usuário
 */
router.get('/models', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const availableModels = openaiService.getAvailableModels(user);

    res.json({
      models: availableModels,
      currentPlan: user.plan,
      defaultModel: openaiService.getModelForUser(user)
    });

  } catch (error) {
    console.error('Erro ao listar modelos:', error);
    res.status(500).json({ error: 'Erro ao listar modelos' });
  }
});

/**
 * POST /api/ai/admin/enable-gpt5
 * [ADMIN ONLY] Habilita GPT-5 globalmente ou para usuários específicos
 */
router.post('/admin/enable-gpt5', async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { enabled, userIds } = req.body;

    // Atualizar flag global
    featureFlags.setGlobalFlag('gpt5Enabled', enabled);

    // Se userIds fornecidos, atualizar apenas esses usuários
    if (userIds && Array.isArray(userIds)) {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { gpt5Access: true }
      });
    }

    res.json({
      success: true,
      message: `GPT-5 ${enabled ? 'habilitado' : 'desabilitado'} com sucesso`,
      affectedUsers: userIds?.length || 'todos'
    });

  } catch (error) {
    console.error('Erro ao habilitar GPT-5:', error);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
});

/**
 * GET /api/ai/admin/usage-stats
 * [ADMIN ONLY] Estatísticas de uso de IA
 */
router.get('/admin/usage-stats', async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const stats = await prisma.aIUsageLog.groupBy({
      by: ['model'],
      _sum: {
        tokensUsed: true,
        cost: true
      },
      _count: {
        id: true
      }
    });

    const totalUsers = await prisma.user.count();
    const activeAIUsers = await prisma.user.count({
      where: {
        aiUsage: { gt: 0 }
      }
    });

    res.json({
      byModel: stats,
      users: {
        total: totalUsers,
        activeAI: activeAIUsers
      },
      flags: featureFlags.getAllFlags()
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;

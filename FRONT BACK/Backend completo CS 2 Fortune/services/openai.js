const axios = require('axios');

/**
 * Serviço de integração com OpenAI API
 * Suporta múltiplos modelos (GPT-3.5, GPT-4, GPT-5)
 * Configuração flexível via variáveis de ambiente
 */

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.organization = process.env.OPENAI_ORG_ID || null;
    
    // Configuração de modelos disponíveis
    this.models = {
      'gpt-3.5-turbo': {
        name: 'gpt-3.5-turbo',
        maxTokens: 4096,
        costPer1kTokens: { input: 0.0015, output: 0.002 },
        enabled: true
      },
      'gpt-4': {
        name: 'gpt-4',
        maxTokens: 8192,
        costPer1kTokens: { input: 0.03, output: 0.06 },
        enabled: true
      },
      'gpt-4-turbo': {
        name: 'gpt-4-turbo-preview',
        maxTokens: 128000,
        costPer1kTokens: { input: 0.01, output: 0.03 },
        enabled: true
      },
      'gpt-5': {
        name: 'gpt-5', // Nome será atualizado quando GPT-5 for lançado
        maxTokens: 200000, // Estimativa
        costPer1kTokens: { input: 0.05, output: 0.10 }, // Estimativa
        enabled: process.env.GPT5_ENABLED === 'true' // ⭐ FLAG PRINCIPAL
      }
    };

    // Modelo padrão (pode ser alterado via env)
    this.defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo';
  }

  /**
   * Retorna o modelo a ser usado com base nas permissões do usuário
   * @param {Object} user - Dados do usuário
   * @returns {string} - Nome do modelo
   */
  getModelForUser(user) {
    // Se usuário tem modelo específico configurado
    if (user.aiModel && this.models[user.aiModel]?.enabled) {
      return user.aiModel;
    }

    // Se usuário é admin ou VIP, pode usar GPT-4/GPT-5
    if (user.isAdmin && this.models['gpt-5']?.enabled) {
      return 'gpt-5';
    }

    if (user.isPremium && this.models['gpt-4']?.enabled) {
      return 'gpt-4';
    }

    // Padrão para usuários comuns
    return this.defaultModel;
  }

  /**
   * Envia requisição para chat completion
   * @param {string} model - Nome do modelo
   * @param {Array} messages - Array de mensagens
   * @param {Object} options - Opções adicionais
   * @returns {Promise<Object>} - Resposta da API
   */
  async chatCompletion(model, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const modelConfig = this.models[model];
    if (!modelConfig) {
      throw new Error(`Modelo ${model} não encontrado`);
    }

    if (!modelConfig.enabled) {
      throw new Error(`Modelo ${model} está desabilitado`);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: modelConfig.name,
          messages,
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 1,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...(this.organization && { 'OpenAI-Organization': this.organization })
          }
        }
      );

      return {
        success: true,
        data: response.data,
        usage: response.data.usage,
        model: model,
        cost: this.calculateCost(model, response.data.usage)
      };
    } catch (error) {
      console.error('Erro na OpenAI API:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        code: error.response?.status
      };
    }
  }

  /**
   * Calcula o custo estimado da requisição
   * @param {string} model - Nome do modelo
   * @param {Object} usage - Objeto de uso retornado pela API
   * @returns {number} - Custo em USD
   */
  calculateCost(model, usage) {
    const modelConfig = this.models[model];
    if (!modelConfig || !usage) return 0;

    const inputCost = (usage.prompt_tokens / 1000) * modelConfig.costPer1kTokens.input;
    const outputCost = (usage.completion_tokens / 1000) * modelConfig.costPer1kTokens.output;

    return inputCost + outputCost;
  }

  /**
   * Verifica se o usuário tem quota disponível
   * @param {Object} user - Dados do usuário
   * @param {number} estimatedTokens - Tokens estimados
   * @returns {boolean}
   */
  checkQuota(user, estimatedTokens = 1000) {
    if (user.isAdmin) return true; // Admin sem limite

    const quotaLimit = user.aiQuota || 10000; // 10k tokens padrão
    const usedTokens = user.aiUsage || 0;

    return (usedTokens + estimatedTokens) <= quotaLimit;
  }

  /**
   * Lista modelos disponíveis para o usuário
   * @param {Object} user - Dados do usuário
   * @returns {Array} - Lista de modelos
   */
  getAvailableModels(user) {
    const available = [];

    Object.entries(this.models).forEach(([key, config]) => {
      if (!config.enabled) return;

      // GPT-5 apenas para admins
      if (key === 'gpt-5' && !user.isAdmin) return;

      // GPT-4 para premium ou superior
      if (key.startsWith('gpt-4') && !user.isPremium && !user.isAdmin) return;

      available.push({
        id: key,
        name: config.name,
        maxTokens: config.maxTokens,
        cost: config.costPer1kTokens
      });
    });

    return available;
  }
}

module.exports = new OpenAIService();

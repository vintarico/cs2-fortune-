/**
 * Sistema de Feature Flags
 * Controla acesso a recursos por usuário/plano
 */

class FeatureFlags {
  constructor() {
    // Flags globais (via variáveis de ambiente)
    this.globalFlags = {
      gpt5Enabled: process.env.GPT5_ENABLED === 'true',
      gpt4Enabled: process.env.GPT4_ENABLED === 'true' || true, // Habilitado por padrão
      betaFeatures: process.env.BETA_FEATURES === 'true',
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
    };

    // Configuração de planos
    this.plans = {
      free: {
        name: 'Gratuito',
        aiQuota: 5000, // 5k tokens/mês
        allowedModels: ['gpt-3.5-turbo'],
        maxCasesPerDay: 5,
        features: ['basic-chat']
      },
      premium: {
        name: 'Premium',
        aiQuota: 50000, // 50k tokens/mês
        allowedModels: ['gpt-3.5-turbo', 'gpt-4'],
        maxCasesPerDay: 50,
        features: ['basic-chat', 'advanced-analytics', 'priority-support']
      },
      vip: {
        name: 'VIP',
        aiQuota: 200000, // 200k tokens/mês
        allowedModels: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
        maxCasesPerDay: 200,
        features: ['basic-chat', 'advanced-analytics', 'priority-support', 'custom-strategies']
      },
      admin: {
        name: 'Administrador',
        aiQuota: -1, // Ilimitado
        allowedModels: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-5'],
        maxCasesPerDay: -1, // Ilimitado
        features: ['all']
      }
    };
  }

  /**
   * Verifica se usuário tem acesso a uma feature
   * @param {Object} user - Dados do usuário
   * @param {string} featureName - Nome da feature
   * @returns {boolean}
   */
  hasAccess(user, featureName) {
    const userPlan = this.getUserPlan(user);
    
    if (!userPlan) return false;

    // Admin tem acesso a tudo
    if (userPlan.features.includes('all')) return true;

    return userPlan.features.includes(featureName);
  }

  /**
   * Verifica se usuário pode usar determinado modelo
   * @param {Object} user - Dados do usuário
   * @param {string} modelName - Nome do modelo
   * @returns {boolean}
   */
  canUseModel(user, modelName) {
    // Verificar flag global primeiro
    if (modelName === 'gpt-5' && !this.globalFlags.gpt5Enabled) {
      return false;
    }

    const userPlan = this.getUserPlan(user);
    if (!userPlan) return false;

    return userPlan.allowedModels.includes(modelName);
  }

  /**
   * Retorna o plano do usuário
   * @param {Object} user - Dados do usuário
   * @returns {Object} - Configuração do plano
   */
  getUserPlan(user) {
    if (user.isAdmin) return this.plans.admin;
    
    // Assumindo que user.plan contém o tipo de plano
    const planType = user.plan || 'free';
    return this.plans[planType] || this.plans.free;
  }

  /**
   * Retorna quota de IA disponível para o usuário
   * @param {Object} user - Dados do usuário
   * @returns {Object} - Informações de quota
   */
  getQuotaInfo(user) {
    const plan = this.getUserPlan(user);
    const used = user.aiUsage || 0;
    const limit = plan.aiQuota;

    return {
      limit: limit === -1 ? 'Ilimitado' : limit,
      used,
      remaining: limit === -1 ? 'Ilimitado' : Math.max(0, limit - used),
      percentage: limit === -1 ? 0 : Math.min(100, (used / limit) * 100)
    };
  }

  /**
   * Habilita/desabilita feature globalmente (apenas admin)
   * @param {string} flagName - Nome da flag
   * @param {boolean} value - true/false
   */
  setGlobalFlag(flagName, value) {
    if (this.globalFlags.hasOwnProperty(flagName)) {
      this.globalFlags[flagName] = value;
      // Em produção, salvar no banco de dados ou cache
      console.log(`Feature flag ${flagName} definida como ${value}`);
    }
  }

  /**
   * Retorna todas as flags para debug/admin
   * @returns {Object}
   */
  getAllFlags() {
    return {
      global: this.globalFlags,
      plans: this.plans
    };
  }
}

module.exports = new FeatureFlags();

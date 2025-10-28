// ═══════════════════════════════════════════════════════════════
// 🕐 CRONJOB - ATUALIZAÇÃO AUTOMÁTICA DE PREÇOS
// ═══════════════════════════════════════════════════════════════

const cron = require('node-cron');
const steamMarket = require('./steamMarket');
const SKINS_WITH_STEAM_DATA = require('../data/skins-steam-data');

// Configurações
const CRON_SCHEDULE = '0 */2 * * *'; // A cada 2 horas (evita rate limit do Steam)
const UPDATE_DELAY = 5000; // 5 segundos entre cada skin (evita rate limit)

// Estatísticas
let stats = {
  lastUpdate: null,
  nextUpdate: null,
  totalUpdates: 0,
  successfulUpdates: 0,
  failedUpdates: 0,
  isRunning: false,
  currentSkin: null,
};

/**
 * Atualiza os preços de todas as skins configuradas
 */
async function updateAllPrices() {
  if (stats.isRunning) {
    console.log('⏳ [CRON] Atualização já em andamento, ignorando...');
    return stats;
  }

  console.log('🚀 [CRON] Iniciando atualização automática de preços...');
  stats.isRunning = true;
  stats.lastUpdate = new Date();
  
  const skins = Object.entries(SKINS_WITH_STEAM_DATA);
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < skins.length; i++) {
    const [skinId, skinData] = skins[i];
    stats.currentSkin = skinData.market_hash_name;

    try {
      console.log(`📊 [CRON] [${i + 1}/${skins.length}] Atualizando: ${skinData.market_hash_name}`);
      
      const priceData = await steamMarket.getSteamPrice(skinData.market_hash_name);
      
      if (priceData && priceData.usd > 0) {
        successful++;
        console.log(`✅ [CRON] ${skinData.market_hash_name}: R$ ${priceData.brl.toFixed(2)}`);
      } else {
        failed++;
        console.log(`⚠️ [CRON] ${skinData.market_hash_name}: Preço não disponível`);
      }

      // Delay entre requisições
      if (i < skins.length - 1) {
        await new Promise(resolve => setTimeout(resolve, UPDATE_DELAY));
      }

    } catch (error) {
      failed++;
      console.error(`❌ [CRON] Erro ao atualizar ${skinData.market_hash_name}:`, error.message);
    }
  }

  stats.isRunning = false;
  stats.currentSkin = null;
  stats.totalUpdates++;
  stats.successfulUpdates += successful;
  stats.failedUpdates += failed;

  console.log(`\n✅ [CRON] Atualização concluída!`);
  console.log(`   Sucessos: ${successful}/${skins.length}`);
  console.log(`   Falhas: ${failed}/${skins.length}`);
  console.log(`   Próxima atualização: ${getNextUpdateTime()}\n`);

  return {
    success: true,
    total: skins.length,
    successful,
    failed,
    timestamp: stats.lastUpdate,
    nextUpdate: getNextUpdateTime(),
  };
}

/**
 * Calcula o horário da próxima atualização
 */
function getNextUpdateTime() {
  const next = new Date();
  next.setMinutes(next.getMinutes() + 30);
  return next;
}

/**
 * Inicia o cronjob
 */
function startCronJob() {
  console.log('🕐 [CRON] Cronjob iniciado: atualização de preços a cada 30 minutos');
  
  // Executa imediatamente na primeira vez
  setTimeout(() => {
    updateAllPrices();
  }, 5000); // Aguarda 5 segundos após iniciar o servidor

  // Agenda execuções futuras
  cron.schedule(CRON_SCHEDULE, () => {
    updateAllPrices();
  });

  stats.nextUpdate = getNextUpdateTime();
}

/**
 * Para o cronjob (se necessário)
 */
function stopCronJob() {
  // node-cron não precisa de stop explícito
  console.log('🛑 [CRON] Cronjob parado');
}

/**
 * Retorna estatísticas do cronjob
 */
function getStats() {
  return {
    ...stats,
    nextUpdate: getNextUpdateTime(),
    uptimeMinutes: stats.lastUpdate 
      ? Math.floor((new Date() - stats.lastUpdate) / 60000)
      : 0,
  };
}

/**
 * Força atualização manual (sem cronjob)
 */
async function forceUpdate() {
  return await updateAllPrices();
}

module.exports = {
  startCronJob,
  stopCronJob,
  getStats,
  forceUpdate,
  updateAllPrices,
};

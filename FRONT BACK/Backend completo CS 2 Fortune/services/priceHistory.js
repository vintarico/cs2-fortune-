// ═══════════════════════════════════════════════════════════════
// 📊 HISTÓRICO DE PREÇOS
// ═══════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

// Arquivo JSON para armazenar histórico
const HISTORY_FILE = path.join(__dirname, '../data/price-history.json');

// Cache em memória
let priceHistory = {};

/**
 * Carrega histórico do arquivo
 */
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      priceHistory = JSON.parse(data);
      console.log('📊 [HISTORY] Histórico carregado com sucesso');
    } else {
      priceHistory = {};
      saveHistory();
    }
  } catch (error) {
    console.error('❌ [HISTORY] Erro ao carregar histórico:', error.message);
    priceHistory = {};
  }
}

/**
 * Salva histórico no arquivo
 */
function saveHistory() {
  try {
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(priceHistory, null, 2));
  } catch (error) {
    console.error('❌ [HISTORY] Erro ao salvar histórico:', error.message);
  }
}

/**
 * Adiciona um ponto ao histórico
 */
function addPricePoint(marketHashName, priceData) {
  if (!priceHistory[marketHashName]) {
    priceHistory[marketHashName] = [];
  }

  const point = {
    timestamp: new Date().toISOString(),
    usd: priceData.usd,
    brl: priceData.brl,
    volume: priceData.volume,
  };

  priceHistory[marketHashName].push(point);

  // Limita a 1000 pontos por skin (aproximadamente 20 dias)
  if (priceHistory[marketHashName].length > 1000) {
    priceHistory[marketHashName].shift();
  }

  saveHistory();
  return point;
}

/**
 * Obtém histórico de uma skin
 */
function getHistory(marketHashName, limit = 100) {
  if (!priceHistory[marketHashName]) {
    return [];
  }

  const history = priceHistory[marketHashName];
  return history.slice(-limit);
}

/**
 * Obtém histórico com período específico
 */
function getHistoryByPeriod(marketHashName, hours = 24) {
  if (!priceHistory[marketHashName]) {
    return [];
  }

  const now = new Date();
  const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);

  return priceHistory[marketHashName].filter(point => {
    return new Date(point.timestamp) >= cutoff;
  });
}

/**
 * Calcula estatísticas de uma skin
 */
function getStatistics(marketHashName, hours = 24) {
  const history = getHistoryByPeriod(marketHashName, hours);

  if (history.length === 0) {
    return null;
  }

  const prices = history.map(p => p.brl);
  const current = prices[prices.length - 1];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Variação percentual
  const first = prices[0];
  const changePercent = first > 0 ? ((current - first) / first) * 100 : 0;

  return {
    current,
    min,
    max,
    avg: parseFloat(avg.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    dataPoints: history.length,
    period: `${hours}h`,
  };
}

/**
 * Detecta mudanças significativas de preço
 */
function detectPriceChanges(marketHashName, thresholdPercent = 10) {
  const recent = getHistoryByPeriod(marketHashName, 2); // Últimas 2 horas

  if (recent.length < 2) {
    return null;
  }

  const oldPrice = recent[0].brl;
  const newPrice = recent[recent.length - 1].brl;
  const changePercent = ((newPrice - oldPrice) / oldPrice) * 100;

  if (Math.abs(changePercent) >= thresholdPercent) {
    return {
      skinName: marketHashName,
      oldPrice,
      newPrice,
      changePercent: parseFloat(changePercent.toFixed(2)),
      direction: changePercent > 0 ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Limpa histórico antigo (mais de 30 dias)
 */
function cleanOldHistory() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias

  let cleaned = 0;

  for (const skinName in priceHistory) {
    const originalLength = priceHistory[skinName].length;
    
    priceHistory[skinName] = priceHistory[skinName].filter(point => {
      return new Date(point.timestamp) >= cutoff;
    });

    cleaned += originalLength - priceHistory[skinName].length;
  }

  if (cleaned > 0) {
    saveHistory();
    console.log(`🧹 [HISTORY] ${cleaned} pontos antigos removidos`);
  }

  return cleaned;
}

/**
 * Exporta dados para CSV
 */
function exportToCSV(marketHashName) {
  const history = getHistory(marketHashName, 1000);

  if (history.length === 0) {
    return null;
  }

  let csv = 'timestamp,usd,brl,volume\n';
  
  history.forEach(point => {
    csv += `${point.timestamp},${point.usd},${point.brl},${point.volume}\n`;
  });

  return csv;
}

// Inicializa
loadHistory();

// Limpeza automática a cada 24 horas
setInterval(() => {
  cleanOldHistory();
}, 24 * 60 * 60 * 1000);

module.exports = {
  addPricePoint,
  getHistory,
  getHistoryByPeriod,
  getStatistics,
  detectPriceChanges,
  cleanOldHistory,
  exportToCSV,
};

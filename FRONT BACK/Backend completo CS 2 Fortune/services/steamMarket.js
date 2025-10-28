/**
 * ═══════════════════════════════════════════════════════════════
 * 🎮 STEAM MARKET API SERVICE - CS2 FORTUNE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Integração com Steam Community Market para:
 * - Buscar preços reais das skins
 * - Obter imagens oficiais
 * - Sincronizar valores do mercado
 * - Cache para performance
 */

const axios = require('axios');
const priceHistory = require('./priceHistory');
const localImages = require('./localImages');

// ═══════════════════════════════════════════════════════════════
// 🔧 CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════════

const STEAM_API_BASE = 'https://steamcommunity.com/market';
const STEAM_CDN = 'https://community.cloudflare.steamstatic.com/economy/image';
const APP_ID = 730; // CS2 (Counter-Strike 2)
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos
const REQUEST_DELAY = 3000; // 3 segundos entre requisições (anti rate-limit)
const MAX_RETRIES = 2; // Tentativas em caso de erro 429

// Cache em memória
const priceCache = new Map();
const imageCache = new Map();

// Sistema de fila para evitar rate limit
let lastRequestTime = 0;
const requestQueue = [];

// ═══════════════════════════════════════════════════════════════
// 🛠️ FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════════

/**
 * Sistema de fila para controlar rate limit da Steam
 */
async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    const waitTime = REQUEST_DELAY - timeSinceLastRequest;
    console.log(`⏳ Aguardando ${waitTime}ms para evitar rate limit...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Faz requisição com retry em caso de rate limit
 */
async function makeRequestWithRetry(url, retries = MAX_RETRIES) {
  await waitForRateLimit();
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000,
      });
      
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        if (i < retries) {
          const backoffTime = (i + 1) * 5000; // 5s, 10s, 15s...
          console.log(`⚠️ Rate limit (429) - Tentativa ${i + 1}/${retries}. Aguardando ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }
      }
      throw error;
    }
  }
}

/**
 * Formata o nome da skin para a URL da Steam
 */
function formatSteamMarketName(skinName) {
  // Remove caracteres especiais e formata para URL
  return encodeURIComponent(skinName.trim());
}

/**
 * Converte preço da Steam (USD) para BRL
 */
function convertUSDtoBRL(usdPrice, exchangeRate = 5.0) {
  return (usdPrice * exchangeRate).toFixed(2);
}

/**
 * Extrai o preço do HTML da página do mercado Steam
 */
function extractPriceFromHTML(html) {
  try {
    // Regex para encontrar o preço no HTML
    const priceMatch = html.match(/market_listing_price_with_fee[^>]*>\s*\$?([\d,.]+)/i);
    if (priceMatch && priceMatch[1]) {
      return parseFloat(priceMatch[1].replace(',', ''));
    }
    return null;
  } catch (error) {
    console.error('Erro ao extrair preço:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// 📊 BUSCAR PREÇO DO MERCADO STEAM
// ═══════════════════════════════════════════════════════════════

/**
 * Busca o preço de uma skin no Steam Market
 */
async function getSteamPrice(marketHashName) {
  try {
    // Verifica cache
    const cached = priceCache.get(marketHashName);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`💰 Preço em cache: ${marketHashName}`);
      return cached.data;
    }

    console.log(`🔍 Buscando preço: ${marketHashName}`);

    // Busca preço na Steam Market API com rate limiting
    const url = `${STEAM_API_BASE}/priceoverview/?appid=${APP_ID}&currency=1&market_hash_name=${formatSteamMarketName(marketHashName)}`;
    
    const response = await makeRequestWithRetry(url);

    if (response.data && response.data.success) {
      const lowestPrice = response.data.lowest_price || response.data.median_price;
      
      if (lowestPrice) {
        // Extrai valor numérico (remove $, vírgulas, etc)
        const priceUSD = parseFloat(lowestPrice.replace(/[^0-9.]/g, ''));
        const priceBRL = convertUSDtoBRL(priceUSD);

        const priceData = {
          usd: priceUSD,
          brl: parseFloat(priceBRL),
          formatted_usd: lowestPrice,
          formatted_brl: `R$ ${priceBRL}`,
          volume: response.data.volume || '0',
          median_price: response.data.median_price,
          last_updated: new Date().toISOString(),
        };

        // Salva no cache
        priceCache.set(marketHashName, {
          data: priceData,
          timestamp: Date.now(),
        });

        // Adiciona ao histórico
        priceHistory.addPricePoint(marketHashName, priceData);

        return priceData;
      }
    }

    throw new Error('Preço não encontrado');
  } catch (error) {
    console.error(`❌ Erro ao buscar preço de ${marketHashName}:`, error.message);
    
    // Retorna preço padrão se falhar
    return {
      usd: 0,
      brl: 0,
      formatted_usd: '$0.00',
      formatted_brl: 'R$ 0.00',
      volume: '0',
      error: error.message,
      last_updated: new Date().toISOString(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 🖼️ BUSCAR IMAGEM DA SKIN
// ═══════════════════════════════════════════════════════════════

/**
 * Gera URL da imagem da skin na Steam CDN
 */
function getSteamImageURL(iconUrl, size = 'large') {
  if (!iconUrl) return null;

  // Se já for uma URL completa, retorna
  if (iconUrl.startsWith('http')) {
    return iconUrl;
  }

  // Tamanhos disponíveis: small (64px), medium (128px), large (256px), extralarge (512px)
  const sizeMap = {
    small: '',
    medium: '/128fx128f',
    large: '/256fx256f',
    extralarge: '/512fx512f',
  };

  return `${STEAM_CDN}/${iconUrl}${sizeMap[size] || sizeMap.large}`;
}

/**
 * Busca informações completas de uma skin (preço + imagem)
 * PRIORIDADE: Local → Steam CDN → Steam Scraping
 */
async function getSkinData(marketHashName, iconUrl = null) {
  try {
    const priceData = await getSteamPrice(marketHashName);
    
    // PRIORIDADE 1: Verifica se tem imagem local
    const localImageInfo = localImages.getImageUrl(marketHashName);
    if (localImageInfo.source === 'local') {
      console.log(`🖼️ [LOCAL] Usando imagem local: ${marketHashName}`);
      return {
        name: marketHashName,
        price: priceData,
        image: localImageInfo.url,
        imageSource: 'local',
        steam_url: `${STEAM_API_BASE}/listings/${APP_ID}/${formatSteamMarketName(marketHashName)}`,
      };
    }
    
    // PRIORIDADE 2: Se tiver iconUrl, usa Steam CDN
    let imageUrl = iconUrl ? getSteamImageURL(iconUrl) : null;
    
    // PRIORIDADE 3: Scraping da página do Steam (último recurso)
    if (!imageUrl) {
      imageUrl = await fetchImageFromSteamPage(marketHashName);
    }
    
    return {
      name: marketHashName,
      price: priceData,
      image: imageUrl,
      imageSource: imageUrl ? 'steam' : 'none',
      steam_url: `${STEAM_API_BASE}/listings/${APP_ID}/${formatSteamMarketName(marketHashName)}`,
    };
  } catch (error) {
    console.error(`❌ Erro ao buscar dados de ${marketHashName}:`, error);
    return null;
  }
}

/**
 * Busca a URL da imagem da skin na página do Steam Market
 */
async function fetchImageFromSteamPage(marketHashName) {
  try {
    // Verifica cache de imagens
    const cached = imageCache.get(marketHashName);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`🖼️ Imagem em cache: ${marketHashName}`);
      return cached.url;
    }

    console.log(`🔍 Buscando imagem: ${marketHashName}`);
    
    const url = `${STEAM_API_BASE}/listings/${APP_ID}/${formatSteamMarketName(marketHashName)}`;
    
    const response = await makeRequestWithRetry(url);

    // Extrai URL da imagem do HTML usando regex
    const html = response.data;
    
    // Procura pelo padrão de imagem do Steam
    const imageMatch = html.match(/https:\/\/community\.cloudflare\.steamstatic\.com\/economy\/image\/[^"'\s]+/i);
    
    if (imageMatch && imageMatch[0]) {
      const imageUrl = imageMatch[0];
      
      // Salva no cache
      imageCache.set(marketHashName, {
        url: imageUrl,
        timestamp: Date.now(),
      });
      
      console.log(`🖼️ Imagem encontrada: ${marketHashName}`);
      return imageUrl;
    }

    console.log(`⚠️ Imagem não encontrada para: ${marketHashName}`);
    return null;
  } catch (error) {
    console.error(`❌ Erro ao buscar imagem de ${marketHashName}:`, error.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔄 SINCRONIZAÇÃO EM LOTE
// ═══════════════════════════════════════════════════════════════

/**
 * Atualiza preços de múltiplas skins
 */
async function updateMultipleSkins(skins, delayMs = 3000) {
  console.log(`🔄 Atualizando ${skins.length} skins...`);
  
  const results = [];
  
  for (let i = 0; i < skins.length; i++) {
    const skin = skins[i];
    console.log(`[${i + 1}/${skins.length}] ${skin.market_hash_name}`);
    
    try {
      const data = await getSkinData(skin.market_hash_name, skin.icon_url);
      results.push({
        ...skin,
        steam_data: data,
        success: true,
      });
      
      // Delay entre requisições já é controlado pelo makeRequestWithRetry
    } catch (error) {
      console.error(`❌ Falha em ${skin.market_hash_name}:`, error.message);
      results.push({
        ...skin,
        steam_data: null,
        success: false,
        error: error.message,
      });
    }
  }
  
  console.log(`✅ Sincronização concluída: ${results.filter(r => r.success).length}/${skins.length} sucessos`);
  return results;
}

/**
 * Busca trending items (mais vendidos)
 */
async function getTrendingItems(limit = 10) {
  try {
    // Esta é uma função placeholder - a Steam não tem endpoint público para trending
    // Você pode implementar lógica própria baseada no seu banco de dados
    console.log('📈 Buscando itens em alta...');
    return [];
  } catch (error) {
    console.error('❌ Erro ao buscar trending items:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// 🧹 LIMPEZA DE CACHE
// ═══════════════════════════════════════════════════════════════

/**
 * Limpa cache expirado
 */
function clearExpiredCache() {
  const now = Date.now();
  let cleared = 0;

  for (const [key, value] of priceCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      priceCache.delete(key);
      cleared++;
    }
  }
  
  for (const [key, value] of imageCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      imageCache.delete(key);
      cleared++;
    }
  }

  if (cleared > 0) {
    console.log(`🧹 Cache limpo: ${cleared} itens removidos`);
  }
}

/**
 * Limpa TODO o cache manualmente
 */
function clearAllCache() {
  const total = priceCache.size + imageCache.size;
  priceCache.clear();
  imageCache.clear();
  console.log(`🗑️ Cache completo limpo: ${total} itens removidos`);
  return total;
}

/**
 * Obtém estatísticas do cache
 */
function getCacheStats() {
  return {
    prices: {
      total: priceCache.size,
      items: Array.from(priceCache.keys()),
    },
    images: {
      total: imageCache.size,
      items: Array.from(imageCache.keys()),
    },
    totalItems: priceCache.size + imageCache.size,
  };
}

// Limpa cache a cada 1 hora
setInterval(clearExpiredCache, 1000 * 60 * 60);

// ═══════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  getSteamPrice,
  getSteamImageURL,
  getSkinData,
  updateMultipleSkins,
  getTrendingItems,
  formatSteamMarketName,
  clearExpiredCache,
  clearAllCache,
  getCacheStats,
  fetchImageFromSteamPage,
  
  // Constantes
  STEAM_API_BASE,
  STEAM_CDN,
  APP_ID,
};

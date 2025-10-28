import crypto from 'crypto';

/**
 * Sistema Provably Fair para CS2 Fortune
 * Garante transparência e verificabilidade nos sorteios
 */

/**
 * Gera um server seed aleatório (hash SHA-256)
 */
export function generateServerSeed() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Gera um client seed aleatório
 */
export function generateClientSeed() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Gera um nonce (número que incrementa a cada rodada)
 */
export function generateNonce() {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Calcula o hash combinado (server seed + client seed + nonce)
 * Este hash determina o resultado do sorteio
 */
export function calculateHash(serverSeed, clientSeed, nonce) {
  const combined = `${serverSeed}-${clientSeed}-${nonce}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

/**
 * Converte hash em número decimal entre 0 e 1
 */
export function hashToDecimal(hash) {
  // Pega os primeiros 8 caracteres do hash
  const hexSubstring = hash.substring(0, 8);
  // Converte para decimal
  const decimal = parseInt(hexSubstring, 16);
  // Normaliza para 0-1
  return decimal / 0xFFFFFFFF;
}

/**
 * Seleciona item baseado no hash e nas probabilidades das raridades
 * @param {Array} items - Array de itens com propriedade 'rarity'
 * @param {Object} RARITY_CONFIG - Configuração de raridades com chances
 * @param {string} hash - Hash do provably fair
 * @returns {Object} Item selecionado
 */
export function selectItemByHash(items, RARITY_CONFIG, hash) {
  const randomValue = hashToDecimal(hash);
  
  // Criar array acumulativo de chances baseado nas RARIDADES
  let accumulated = 0;
  const ranges = items.map(item => {
    const rarityData = RARITY_CONFIG[item.rarity];
    const chance = rarityData?.chance || 1; // Chance da raridade
    const start = accumulated;
    accumulated += (chance / 100); // chance está em percentual
    return {
      item,
      start,
      end: accumulated,
      rarity: item.rarity,
      chance
    };
  });

  // Normalizar se total não for 100%
  const total = accumulated;
  const normalizedRanges = ranges.map(range => ({
    ...range,
    start: range.start / total,
    end: range.end / total
  }));

  // Encontrar item baseado no valor aleatório
  for (let range of normalizedRanges) {
    if (randomValue >= range.start && randomValue < range.end) {
      return range.item;
    }
  }

  // Fallback: retornar item COMMON mais provável
  const commonItems = items.filter(i => i.rarity === 'COMMON');
  if (commonItems.length > 0) {
    return commonItems[0];
  }
  
  return items[items.length - 1];
}

/**
 * Gera resultado completo do Provably Fair
 * @param {Array} items - Array de itens disponíveis
 * @param {Object} RARITY_CONFIG - Configuração de raridades
 * @returns {Object} Resultado com seeds, hash e item selecionado
 */
export function generateProvablyFairResult(items, RARITY_CONFIG) {
  const serverSeed = generateServerSeed();
  const clientSeed = generateClientSeed();
  const nonce = generateNonce();
  const hash = calculateHash(serverSeed, clientSeed, nonce);
  const selectedItem = selectItemByHash(items, RARITY_CONFIG, hash);

  return {
    serverSeed,
    clientSeed,
    nonce,
    hash,
    selectedItem,
    timestamp: Date.now()
  };
}

/**
 * Verifica se um resultado é válido
 * @param {Object} result - Resultado para verificar
 * @param {Array} items - Array de itens disponíveis
 * @param {Object} RARITY_CONFIG - Configuração de raridades
 * @returns {boolean} True se válido
 */
export function verifyResult(result, items, RARITY_CONFIG) {
  const { serverSeed, clientSeed, nonce, hash, selectedItem } = result;
  
  // Recalcular hash
  const calculatedHash = calculateHash(serverSeed, clientSeed, nonce);
  
  // Verificar se hash está correto
  if (calculatedHash !== hash) {
    return false;
  }

  // Verificar se item selecionado está correto baseado no hash
  const verifiedItem = selectItemByHash(items, RARITY_CONFIG, hash);
  
  return verifiedItem.name === selectedItem.name;
}

/**
 * Gera hash público do server seed (para mostrar antes da rodada)
 */
export function hashServerSeed(serverSeed) {
  return crypto.createHash('sha256').update(serverSeed).digest('hex');
}

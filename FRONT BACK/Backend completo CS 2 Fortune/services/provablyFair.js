const crypto = require('crypto');

/**
 * SISTEMA PROVABLY FAIR
 * 
 * Este sistema garante que os resultados são justos e verificáveis.
 * 
 * Funcionamento:
 * 1. Server Seed: Gerado pelo servidor antes da abertura
 * 2. Client Seed: Escolhido pelo jogador (pode ser alterado)
 * 3. Nonce: Contador incremental para cada abertura
 * 4. Resultado = Hash(ServerSeed + ClientSeed + Nonce)
 */

class ProvablyFairService {
  /**
   * Gera um seed aleatório
   */
  generateSeed() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Gera hash SHA256 de um valor
   */
  generateHash(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  /**
   * Gera o hash do server seed (público antes da abertura)
   */
  generateServerSeedHash(serverSeed) {
    return this.generateHash(serverSeed);
  }

  /**
   * Gera resultado baseado nos seeds e nonce
   * Retorna um número entre 0 e 9999 (10000 possibilidades)
   */
  generateResult(serverSeed, clientSeed, nonce) {
    // Combina todos os dados
    const combined = `${serverSeed}:${clientSeed}:${nonce}`;
    
    // Gera hash
    const hash = this.generateHash(combined);
    
    // Converte primeiros 8 caracteres do hash para número
    const hexValue = hash.substring(0, 8);
    const numValue = parseInt(hexValue, 16);
    
    // Normaliza para 0-9999
    const result = numValue % 10000;
    
    return {
      result,
      hash,
      combined
    };
  }

  /**
   * Verifica se um resultado é válido
   */
  verifyResult(serverSeed, clientSeed, nonce, expectedResult) {
    const generated = this.generateResult(serverSeed, clientSeed, nonce);
    return generated.result === expectedResult;
  }

  /**
   * Seleciona item baseado no resultado e probabilidades
   */
  selectItemFromResult(result, items) {
    // result vai de 0 a 9999
    // Cada item tem uma chance (porcentagem)
    
    let currentThreshold = 0;
    
    for (const item of items) {
      const chance = item.chance || 0;
      const threshold = currentThreshold + (chance * 100); // Converte % para base 10000
      
      if (result < threshold) {
        return item;
      }
      
      currentThreshold = threshold;
    }
    
    // Fallback para o último item
    return items[items.length - 1];
  }

  /**
   * Cria uma sessão de jogo com seeds
   */
  createGameSession(userId, clientSeed = null) {
    const serverSeed = this.generateSeed();
    const serverSeedHash = this.generateServerSeedHash(serverSeed);
    const finalClientSeed = clientSeed || this.generateSeed();
    
    return {
      userId,
      serverSeed, // Mantido em segredo até após a abertura
      serverSeedHash, // Hash público
      clientSeed: finalClientSeed,
      nonce: 0,
      createdAt: new Date()
    };
  }

  /**
   * Incrementa o nonce após cada abertura
   */
  incrementNonce(session) {
    return {
      ...session,
      nonce: session.nonce + 1
    };
  }

  /**
   * Revela o server seed após a abertura (para verificação)
   */
  revealServerSeed(session) {
    return {
      serverSeed: session.serverSeed,
      serverSeedHash: session.serverSeedHash,
      clientSeed: session.clientSeed,
      nonce: session.nonce
    };
  }

  /**
   * Gera dados completos para verificação pública
   */
  generateVerificationData(serverSeed, clientSeed, nonce, result, wonItem) {
    const generatedResult = this.generateResult(serverSeed, clientSeed, nonce);
    
    return {
      serverSeed,
      serverSeedHash: this.generateServerSeedHash(serverSeed),
      clientSeed,
      nonce,
      combinedString: `${serverSeed}:${clientSeed}:${nonce}`,
      resultHash: generatedResult.hash,
      result: generatedResult.result,
      wonItem,
      isValid: generatedResult.result === result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calcula a probabilidade real de cada item
   * Baseado no sistema CS:GO/CS2
   */
  calculateItemProbabilities(items) {
    const rarityProbabilities = {
      'Consumer Grade': 79.92,      // Branco
      'Industrial Grade': 15.98,    // Azul Claro
      'Mil-Spec': 3.20,             // Azul
      'Restricted': 0.64,           // Roxo
      'Classified': 0.32,           // Rosa
      'Covert': 0.64,               // Vermelho
      'Exceedingly Rare': 0.26      // Dourado (Facas/Luvas)
    };

    // Agrupa itens por raridade
    const itemsByRarity = {};
    items.forEach(item => {
      if (!itemsByRarity[item.rarity]) {
        itemsByRarity[item.rarity] = [];
      }
      itemsByRarity[item.rarity].push(item);
    });

    // Calcula chance individual
    const itemsWithChances = items.map(item => {
      const rarityChance = rarityProbabilities[item.rarity] || 1;
      const itemsInRarity = itemsByRarity[item.rarity].length;
      const individualChance = rarityChance / itemsInRarity;

      return {
        ...item,
        chance: individualChance,
        chanceFormatted: `${individualChance.toFixed(4)}%`
      };
    });

    // Ordena por raridade (mais comum primeiro)
    const rarityOrder = [
      'Consumer Grade',
      'Industrial Grade',
      'Mil-Spec',
      'Restricted',
      'Classified',
      'Covert',
      'Exceedingly Rare'
    ];

    return itemsWithChances.sort((a, b) => {
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    });
  }

  /**
   * Distribui resultado (0-9999) entre itens com base nas probabilidades
   */
  distributeResultToItems(items) {
    const itemsWithChances = this.calculateItemProbabilities(items);
    
    let currentThreshold = 0;
    const distribution = itemsWithChances.map(item => {
      const startRange = currentThreshold;
      const endRange = currentThreshold + (item.chance * 100); // Converte % para base 10000
      
      currentThreshold = endRange;

      return {
        ...item,
        rangeStart: Math.floor(startRange),
        rangeEnd: Math.floor(endRange)
      };
    });

    return distribution;
  }
}

module.exports = new ProvablyFairService();

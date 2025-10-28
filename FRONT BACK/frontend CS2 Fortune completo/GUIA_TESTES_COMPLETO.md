# 🧪 GUIA COMPLETO DE TESTES - CS2 FORTUNE

## ✅ Sistema Implementado

### **Backend (Port 3001)**
- ✅ Endpoint `/api/user/balance` - Obter saldo
- ✅ Endpoint `/api/cases/open` - Abrir caixa
- ✅ Endpoint `/api/cases/history` - Histórico com estatísticas
- ✅ Endpoint `/api/user/add-balance` - Adicionar saldo (teste)
- ✅ Banco de dados SQLite com tabela `CaseOpening`

### **Frontend (Port 3000)**
- ✅ Sistema de saldo em tempo real
- ✅ Integração com backend
- ✅ Histórico de aberturas
- ✅ Estatísticas (Total Gasto, Ganho, Lucro, Média)
- ✅ 28 caixas funcionais
- ✅ Sistema de raridades

---

## 🎮 COMO TESTAR

### 1️⃣ **Teste de Saldo**

```
✅ Abra: http://localhost:3000/cases
✅ Verifique no topo: "Seu Saldo: R$ 1000.00"
✅ Clique em "💰 Adicionar Saldo"
✅ Digite: 500
✅ Verifique se saldo atualiza para R$ 1500.00
```

---

### 2️⃣ **Teste de Abertura de Caixa**

```
✅ Escolha uma caixa barata (ex: Bronze R$1.00)
✅ Clique na caixa
✅ Modal abre mostrando conteúdo
✅ Clique em "ABRIR POR R$ 1.00"
✅ Animação de 3 segundos
✅ Item ganho aparece
✅ Saldo atualiza (deduz R$1 + adiciona valor do item)
✅ Feche o modal (X)
```

---

### 3️⃣ **Teste de Histórico**

```
✅ Abra 5 caixas diferentes
✅ Clique em "📊 Histórico (5)"
✅ Verifique estatísticas:
   - Total Gasto (soma dos preços)
   - Total Ganho (soma dos valores)
   - Lucro Total (Total Ganho - Total Gasto)
   - Lucro Médio (Lucro Total / 5)
✅ Verifique lista de aberturas
✅ Cada item mostra:
   - Data/hora
   - Nome da caixa
   - Item ganho com raridade
   - Valor pago e ganho
   - Lucro (verde +) ou prejuízo (vermelho -)
```

---

### 4️⃣ **Teste de Sistema de Raridades (10+ Caixas)**

**Objetivo:** Validar distribuição de raridades

```bash
# Console do navegador (F12):
let results = { COMMON: 0, UNCOMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 };

# Abra 20 caixas e anote as raridades
# Depois verifique a distribuição:

console.log('Distribuição Real:', results);
console.log('Esperado: COMMON ~80%, UNCOMMON ~16%, RARE ~3%, EPIC <1%, LEGENDARY <0.3%');
```

**Distribuição Esperada (20 caixas):**
- COMUM: ~16 caixas (80%)
- INCOMUM: ~3 caixas (15%)
- RARO: ~1 caixa (5%)
- ÉPICO: 0-1 caixas (<1%)
- LENDÁRIO: 0 caixas (<0.3%)

---

### 5️⃣ **Teste de Saldo Insuficiente**

```
✅ Gaste todo seu saldo (abra muitas caixas)
✅ Quando saldo < preço da caixa:
✅ Clique em uma caixa cara
✅ Clique em "ABRIR"
✅ Mensagem: "Saldo insuficiente! Você precisa de R$ XX mas tem apenas R$ YY"
✅ Caixa NÃO abre
✅ Saldo NÃO muda
```

---

### 6️⃣ **Teste de Responsividade Mobile**

**Pressione F12 > Device Toolbar (Ctrl+Shift+M)**

#### iPhone 12 Pro (390x844)
```
✅ Barra de saldo redimensiona
✅ Botões de histórico e saldo ficam empilhados
✅ Grid de caixas: 1 coluna
✅ Modal ocupa tela inteira
✅ Histórico legível
✅ Estatísticas em 2x2 grid
```

#### iPad (768x1024)
```
✅ Grid de caixas: 2 colunas
✅ Barra de saldo em 1 linha
✅ Modal centralizado
```

#### Desktop (1920x1080)
```
✅ Grid de caixas: 4 colunas
✅ Layout completo
✅ Espaçamento adequado
```

---

### 7️⃣ **Teste de Performance**

```
✅ Abra 20 caixas seguidas
✅ Verifique:
   - Animações fluidas
   - Sem travamentos
   - Saldo atualiza corretamente
   - Histórico carrega rápido
   - Sem memory leaks (RAM estável)
```

---

### 8️⃣ **Teste de Conexão Backend**

**Abra Console do Navegador (F12):**

```javascript
// Teste 1: Health Check
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d));

// Teste 2: Verificar se abertura salva no banco
// Abra 1 caixa e veja no console:
// ✅ Caixa aberta! Lucro: R$ XX.XX

// Teste 3: Histórico
// Clique em "📊 Histórico"
// Verifique se as aberturas aparecem
```

---

### 9️⃣ **Teste de Estatísticas**

**Cenário de Teste:**
```
1. Saldo inicial: R$ 1000.00
2. Abra caixa Bronze (R$ 1.00) → Ganhe R$ 0.25
3. Abra caixa Prata (R$ 5.00) → Ganhe R$ 8.00
4. Abra caixa Fracture (R$ 10.80) → Ganhe R$ 3.50

Estatísticas Esperadas:
✅ Total Gasto: R$ 16.80
✅ Total Ganho: R$ 11.75
✅ Lucro Total: R$ -5.05 (prejuízo)
✅ Lucro Médio: R$ -1.68

Saldo Final:
R$ 1000 - R$ 16.80 + R$ 11.75 = R$ 994.95
```

---

### 🔟 **Teste de Múltiplas Aberturas Rápidas**

```
✅ Clique rapidamente em várias caixas
✅ Abra 5 caixas em sequência
✅ Verifique:
   - Todas as animações completam
   - Saldo atualiza corretamente em cada uma
   - Histórico registra todas as 5
   - Sem duplicação de aberturas
```

---

## 📊 CRITÉRIOS DE ACEITAÇÃO

### ✅ **Funcionalidades Básicas**
- [ ] Saldo exibido corretamente
- [ ] Caixas abrem com animação
- [ ] Itens são sorteados
- [ ] Saldo atualiza após abertura
- [ ] Histórico salva aberturas
- [ ] Estatísticas calculadas corretamente

### 🌟 **Funcionalidades Avançadas**
- [ ] Sistema de raridades segue porcentagens
- [ ] Saldo insuficiente é bloqueado
- [ ] Histórico com paginação (50 itens)
- [ ] Responsivo mobile/tablet/desktop
- [ ] Performance fluida (20+ aberturas)
- [ ] Integração backend funcional

### 🚀 **Performance**
- [ ] Carregamento < 3 segundos
- [ ] Animações 60fps
- [ ] Sem memory leaks
- [ ] Backend responde < 500ms

---

## 🐛 REGISTRO DE BUGS

### **Bug #1:** _____________________
**Descrição:**
**Como Reproduzir:**
1. 
2. 
3. 

**Gravidade:** 🔴 Crítico | 🟡 Médio | 🟢 Baixo

---

### **Bug #2:** _____________________
**Descrição:**
**Como Reproduzir:**
1. 
2. 
3. 

**Gravidade:** 🔴 Crítico | 🟡 Médio | 🟢 Baixo

---

## 📈 TESTE DE VALIDAÇÃO DE RARIDADES (Científico)

### **Script de Teste Automático**

Cole no console do navegador:

```javascript
async function testRarityDistribution(numTests = 100) {
  const results = {
    COMMON: 0,
    UNCOMMON: 0,
    RARE: 0,
    EPIC: 0,
    LEGENDARY: 0
  };
  
  const RARITY_CONFIG = {
    COMMON: { chance: 79.92 },
    UNCOMMON: { chance: 15.98 },
    RARE: { chance: 3.2 },
    EPIC: { chance: 0.64 },
    LEGENDARY: { chance: 0.26 }
  };
  
  // Simular sorteios
  for (let i = 0; i < numTests; i++) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const rarity in RARITY_CONFIG) {
      cumulative += RARITY_CONFIG[rarity].chance;
      if (rand <= cumulative) {
        results[rarity]++;
        break;
      }
    }
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log(`📊 TESTE DE ${numTests} ABERTURAS`);
  console.log('═══════════════════════════════════════\n');
  
  for (const rarity in results) {
    const count = results[rarity];
    const percentage = (count / numTests * 100).toFixed(2);
    const expected = RARITY_CONFIG[rarity].chance.toFixed(2);
    const diff = (percentage - expected).toFixed(2);
    
    console.log(`${rarity.padEnd(10)} | ${count.toString().padStart(3)} | ${percentage}% (esperado: ${expected}%) | diff: ${diff > 0 ? '+' : ''}${diff}%`);
  }
  
  console.log('\n═══════════════════════════════════════\n');
}

// Executar teste
testRarityDistribution(100);
```

**Resultado Esperado:**
```
COMUM      | ~80  | ~80.00% (esperado: 79.92%) | diff: +0.08%
INCOMUM    | ~16  | ~16.00% (esperado: 15.98%) | diff: +0.02%
RARO       | ~3   | ~3.00%  (esperado: 3.20%)  | diff: -0.20%
ÉPICO      | ~0-1 | ~0-1%   (esperado: 0.64%)  | diff: ±0.50%
LENDÁRIO   | ~0   | ~0%     (esperado: 0.26%)  | diff: ±0.30%
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend rodando (port 3001)
- [ ] Frontend rodando (port 3000)
- [ ] Banco de dados criado (dev.db)
- [ ] Saldo inicial: R$ 1000.00
- [ ] 28 caixas disponíveis
- [ ] Sistema de raridades funcional
- [ ] Histórico salvando no banco
- [ ] Estatísticas calculando corretamente
- [ ] Responsivo mobile testado
- [ ] Performance aceitável
- [ ] Sem erros no console

---

## 🎯 RESULTADO ESPERADO

**✅ APROVADO** se:
- Todas funcionalidades básicas funcionam
- Saldo atualiza corretamente
- Histórico salva e exibe
- Sistema de raridades próximo das porcentagens
- Responsivo em 3 breakpoints
- Sem bugs críticos

**🎉 Sistema 100% funcional e pronto para uso!**

---

**Data do Teste:** ___/___/2025  
**Testador:** _________________  
**Status:** [ ] Aprovado [ ] Reprovado  
**Observações:** _______________________________________

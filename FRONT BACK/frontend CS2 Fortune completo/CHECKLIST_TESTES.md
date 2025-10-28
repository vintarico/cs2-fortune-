# ✅ CHECKLIST DE TESTES - CS2 FORTUNE

## 🎯 URL de Teste
**Frontend:** http://localhost:3000/cases  
**Backend:** http://localhost:3001/health

---

## 📋 TESTES MANUAIS

### ✅ 1. Carregamento da Página

- [ ] A página carrega em menos de 3 segundos
- [ ] Título "🎁 Caixas CS2 Fortune" aparece
- [ ] Contador mostra "28 caixas disponíveis"
- [ ] Não há erros no console (F12)

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 2. Grid de Caixas

- [ ] Exatamente 28 caixas aparecem no grid
- [ ] Cada caixa tem:
  - [ ] Imagem (da Steam CDN ou emoji 🎁)
  - [ ] Nome
  - [ ] Descrição
  - [ ] Preço em R$
  - [ ] Botão "Abrir"
- [ ] Hover nas caixas mostra zoom suave
- [ ] Borda colorida aparece no hover

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 3. Filtros de Preço

#### Filtro "Todas"
- [ ] Clique mostra 28 caixas
- [ ] Botão fica roxo quando selecionado

#### Filtro "Baratas (até R$50)"
- [ ] Mostra apenas caixas com preço ≤ R$50
- [ ] Caixas esperadas: Bronze (R$1), Prata (R$5), Fracture (R$10.80), Kilowatt (R$10.80), etc.

#### Filtro "Médias (R$50-R$200)"
- [ ] Mostra apenas caixas entre R$50 e R$200
- [ ] Caixas esperadas: Empress (R$89), Howl (R$125), Dragon Lore (R$195), etc.

#### Filtro "Caras (R$200+)"
- [ ] Mostra apenas caixas com preço > R$200
- [ ] Caixas esperadas: Prince (R$650), Wild Lotus (R$890), Printstream (R$1200), etc.

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 4. Abertura de Caixa (Modal)

#### Abrir Modal
- [ ] Clicar em qualquer caixa abre o modal
- [ ] Fundo escuro (overlay) aparece
- [ ] Modal centralizado aparece
- [ ] Botão X (fechar) visível no canto superior direito

#### Conteúdo do Modal
- [ ] Nome da caixa aparece
- [ ] Descrição da caixa aparece
- [ ] Botão "ABRIR POR R$ XX.XX" aparece
- [ ] Lista de itens possíveis aparece
- [ ] Cada item mostra:
  - [ ] Ícone/gradiente colorido
  - [ ] Nome do item
  - [ ] Raridade (com cor)
  - [ ] Porcentagem de chance
  - [ ] Valor em R$
  - [ ] Multiplicador (quantas vezes vale)

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 5. Animação de Abertura

- [ ] Clicar em "ABRIR" inicia animação
- [ ] Emoji 🎁 girando aparece
- [ ] Texto "Abrindo..." aparece
- [ ] Animação dura ~3 segundos
- [ ] Após 3 segundos, item ganho aparece

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 6. Item Ganho (Resultado)

- [ ] Card verde com borda aparece
- [ ] Texto "🎉 PARABÉNS! VOCÊ GANHOU! 🎉" aparece
- [ ] Imagem grande do item com gradiente aparece
- [ ] Ícone do tipo de arma correto:
  - [ ] 🗡️ para facas
  - [ ] 🎯 para AWP
  - [ ] ⚡ para AK-47
  - [ ] 🔫 para M4A4/M4A1-S
  - [ ] 🔰 para pistolas
- [ ] Nome do item com cor da raridade
- [ ] Badge de raridade (Comum, Incomum, Raro, Épico, Lendário)
- [ ] Porcentagem de chance
- [ ] Valor do item em R$
- [ ] Cálculo de lucro/prejuízo
- [ ] Animação de brilho (shine)
- [ ] Ícone com animação bounce

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 7. Sistema de Raridades

Abra 10 caixas e verifique:

- [ ] Maioria dos itens são COMUM (~80%)
- [ ] Alguns itens INCOMUM (~16%)
- [ ] Poucos itens RARO (~3%)
- [ ] Muito raro ÉPICO (<1%)
- [ ] Extremamente raro LENDÁRIO (<0.3%)

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 8. Responsividade Mobile

Redimensione a janela ou use F12 > Device Toolbar:

#### Mobile (375px - 480px)
- [ ] Grid muda para 1 coluna
- [ ] Caixas ficam em coluna vertical
- [ ] Filtros quebram em 2 linhas
- [ ] Modal ocupa quase toda a tela
- [ ] Texto legível
- [ ] Botões fáceis de clicar

#### Tablet (768px - 1024px)
- [ ] Grid com 2 colunas
- [ ] Layout equilibrado
- [ ] Filtros em 1 linha

#### Desktop (>1024px)
- [ ] Grid com 3-4 colunas
- [ ] Espaçamento adequado
- [ ] Uso completo da largura

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 9. Imagens das Caixas

Verifique as imagens Steam CDN:

- [ ] Fracture Case - imagem carrega
- [ ] Kilowatt Case - imagem carrega
- [ ] Recoil Case - imagem carrega
- [ ] Revolution Case - imagem carrega
- [ ] Dreams & Nightmares - imagem carrega
- [ ] Se imagem falhar, emoji 🎁 aparece

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 10. Performance

- [ ] Scroll suave sem travamentos
- [ ] Hover responde instantaneamente
- [ ] Modal abre/fecha sem lag
- [ ] Animações fluidas (60fps)
- [ ] Sem memory leaks (testar abrindo 20+ caixas)

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 11. Fechar Modal

- [ ] Clicar no X fecha o modal
- [ ] Clicar fora do modal fecha
- [ ] ESC fecha o modal (se implementado)
- [ ] Estado reseta (sem item ganho na próxima abertura)

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

### ✅ 12. Dados das Caixas

Verifique se os preços estão corretos:

**Caixas Baratas:**
- [ ] Bronze: R$1.00
- [ ] Prata: R$5.00
- [ ] Fracture: R$10.80

**Caixas Médias:**
- [ ] Empress: R$89.00
- [ ] Howl: R$125.00
- [ ] Dragon Lore: R$195.00

**Caixas Caras:**
- [ ] Prince: R$650.00
- [ ] Printstream: R$1200.00
- [ ] Fire & Ice: R$1800.00
- [ ] Blue Gem: R$2500.00
- [ ] Souvenir DLore: R$3000.00

**Status:** ⬜ Pendente | ✅ Passou | ❌ Falhou

---

## 🧪 TESTES AUTOMATIZADOS

Para executar testes automáticos:

1. Abra http://localhost:3000/cases
2. Pressione F12 (DevTools)
3. Vá na aba "Console"
4. Cole o script de `/public/test-script.js`
5. Ou digite: `runAllTests()`

---

## 📊 CRITÉRIOS DE ACEITAÇÃO

### ✅ Mínimo para Aprovação:
- [ ] 28 caixas carregam
- [ ] Filtros funcionam
- [ ] Modal abre e fecha
- [ ] Abertura de caixa funciona
- [ ] Item é sorteado e exibido
- [ ] Responsivo mobile

### 🌟 Excelência:
- [ ] Todas as imagens carregam
- [ ] Performance > 60fps
- [ ] Sem erros no console
- [ ] Animações suaves
- [ ] Sistema de raridades preciso

---

## 🐛 REGISTRO DE BUGS

Se encontrar bugs, anote aqui:

**Bug #1:**
- Descrição:
- Como reproduzir:
- Gravidade: 🔴 Crítico | 🟡 Médio | 🟢 Baixo

**Bug #2:**
- Descrição:
- Como reproduzir:
- Gravidade:

---

## ✅ CONCLUSÃO

**Data do Teste:** ___/___/2025  
**Testador:** _________________  
**Ambiente:** Windows / Mac / Linux  
**Navegador:** Chrome / Firefox / Edge  
**Resolução:** _______ x _______

**Resultado Final:**
- [ ] ✅ APROVADO - Sistema pronto para produção
- [ ] ⚠️ APROVADO COM RESSALVAS - Pequenos ajustes necessários
- [ ] ❌ REPROVADO - Correções críticas necessárias

**Observações:**
_______________________________________
_______________________________________
_______________________________________

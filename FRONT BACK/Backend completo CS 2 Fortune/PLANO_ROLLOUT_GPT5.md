# 📋 PLANO DE ROLLOUT GPT-5 - CS2 Fortune

## 🎯 Objetivo
Implementar suporte ao GPT-5 no CS2 Fortune com rollout controlado, garantindo qualidade, custo-efetividade e experiência premium para usuários selecionados.

---

## 📊 FASE 1: PREPARAÇÃO (Semana 1-2)

### 1.1 Configuração de Infraestrutura

#### Variáveis de Ambiente
Adicione ao arquivo `.env` do backend:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_ORG_ID=org-your-org-id # (Opcional)
OPENAI_DEFAULT_MODEL=gpt-3.5-turbo

# Feature Flags
GPT5_ENABLED=false          # ⭐ FLAG PRINCIPAL - Mude para 'true' quando GPT-5 estiver disponível
GPT4_ENABLED=true
BETA_FEATURES=false
MAINTENANCE_MODE=false

# Configuração de custos (ajustar conforme pricing real do GPT-5)
GPT5_MAX_COST_PER_USER=10.00  # USD por mês por usuário
GPT5_ROLLOUT_PERCENTAGE=0     # Começa em 0%, aumenta gradualmente
```

#### Instalação de Dependências

```bash
cd "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\Backend completo CS 2 Fortune"
npm install axios --save
npm install openai --save  # SDK oficial da OpenAI (opcional, mas recomendado)
```

#### Migração do Banco de Dados

```bash
# 1. Aplicar alterações no schema Prisma
npx prisma migrate dev --name add_ai_fields

# 2. Gerar cliente Prisma atualizado
npx prisma generate

# 3. Verificar migração
npx prisma studio  # Abre interface visual do banco
```

---

### 1.2 Integração no Backend

#### Atualizar `index.js` principal

Adicione as rotas de IA:

```javascript
// ... imports existentes ...
const aiRoutes = require('./routes/ai');

// ... configurações existentes ...

// Adicionar rotas de IA (protegidas por autenticação)
app.use('/api/ai', authenticateToken, aiRoutes);

// ... resto do código ...
```

#### Estrutura de Arquivos Criada

```
Backend completo CS 2 Fortune/
├── index.js                    # ✅ Atualizar com rotas /api/ai
├── services/
│   └── openai.js              # ✅ CRIADO - Serviço de integração OpenAI
├── config/
│   └── features.js            # ✅ CRIADO - Sistema de feature flags
├── middleware/
│   └── quota.js               # ✅ CRIADO - Controle de quota e rate limiting
├── routes/
│   └── ai.js                  # ✅ CRIADO - Rotas de IA
└── prisma/
    └── schema.prisma          # ✅ ATUALIZADO - Campos de IA adicionados
```

---

## 🚀 FASE 2: ROLLOUT CONTROLADO (Semana 3-6)

### 2.1 Estratégia de Rollout Gradual

#### Etapa 1: Testes Internos (5% - Semana 3)
- **Público**: Apenas admins e desenvolvedores
- **Ação**: Definir `GPT5_ROLLOUT_PERCENTAGE=5`
- **Quota**: Ilimitada para admins
- **Monitoramento**: Logs detalhados de todas as requisições

```sql
-- Habilitar GPT-5 apenas para admins
UPDATE "User" SET "gpt5Access" = true WHERE "isAdmin" = true;
```

#### Etapa 2: Beta Testers (15% - Semana 4)
- **Público**: Usuários VIP + beta testers selecionados
- **Ação**: Definir `GPT5_ROLLOUT_PERCENTAGE=15`
- **Quota**: 50k tokens/mês
- **Critério**: Usuários mais ativos com saldo > R$100

```sql
-- Habilitar para VIPs
UPDATE "User" 
SET "gpt5Access" = true, 
    "aiQuota" = 50000,
    "plan" = 'vip'
WHERE "saldo" > 100 AND "isPremium" = true;
```

#### Etapa 3: Premium Users (40% - Semana 5)
- **Público**: Todos os usuários Premium
- **Ação**: Definir `GPT5_ROLLOUT_PERCENTAGE=40`
- **Quota**: 30k tokens/mês
- **Preço**: Incluído no plano Premium

```sql
-- Habilitar para todos Premium
UPDATE "User" 
SET "gpt5Access" = true,
    "aiQuota" = 30000
WHERE "plan" IN ('premium', 'vip');
```

#### Etapa 4: Público Geral (100% - Semana 6)
- **Público**: Todos os usuários
- **Ação**: Definir `GPT5_ENABLED=true` e `GPT5_ROLLOUT_PERCENTAGE=100`
- **Quota Free**: 5k tokens/mês (limitado a GPT-3.5)
- **Quota Paga**: Acesso a GPT-5 apenas para Premium+

```bash
# Atualizar .env
GPT5_ENABLED=true
GPT5_ROLLOUT_PERCENTAGE=100
```

---

### 2.2 Matriz de Permissões por Plano

| Plano        | Quota Mensal | Modelos Disponíveis                    | Custo Adicional |
|--------------|--------------|----------------------------------------|-----------------|
| **Free**     | 5.000 tokens | gpt-3.5-turbo                          | Gratuito        |
| **Premium**  | 30.000 tokens| gpt-3.5-turbo, gpt-4                   | R$ 29,90/mês    |
| **VIP**      | 100.000 tokens| gpt-3.5-turbo, gpt-4, gpt-4-turbo     | R$ 79,90/mês    |
| **Admin**    | Ilimitado    | Todos (incluindo gpt-5)                | N/A             |

---

## 📈 FASE 3: MONITORAMENTO E OTIMIZAÇÃO (Semana 7+)

### 3.1 Métricas para Monitorar

#### Dashboard de Administração

Crie rota para visualizar estatísticas:

```http
GET /api/ai/admin/usage-stats
Authorization: Bearer <admin-token>
```

**Resposta Esperada:**
```json
{
  "byModel": [
    {
      "model": "gpt-3.5-turbo",
      "_sum": { "tokensUsed": 1500000, "cost": 3.00 },
      "_count": { "id": 2500 }
    },
    {
      "model": "gpt-5",
      "_sum": { "tokensUsed": 50000, "cost": 5.00 },
      "_count": { "id": 100 }
    }
  ],
  "users": {
    "total": 1000,
    "activeAI": 250
  }
}
```

#### KPIs Chave
- **Taxa de Adoção**: % de usuários usando recursos de IA
- **Custo por Usuário**: Média de custo USD/mês
- **Taxa de Erro**: % de requisições com falha
- **Tempo de Resposta**: Latência média das requisições
- **Satisfação**: Feedback dos usuários (pesquisa NPS)

### 3.2 Alertas e Limites

Configure alertas no backend:

```javascript
// Em services/openai.js - adicionar ao método chatCompletion

// Alerta se custo diário ultrapassar $100
if (dailyCost > 100) {
  sendAdminAlert('Custo diário de IA excedeu $100');
}

// Alerta se taxa de erro > 5%
if (errorRate > 0.05) {
  sendAdminAlert('Taxa de erro de IA acima de 5%');
}
```

---

## 💰 FASE 4: GESTÃO DE CUSTOS

### 4.1 Estimativa de Custos

#### Cenário Conservador (1000 usuários)
- **Free (800 users)**: 800 × 5k tokens × $0.0015/1k = **$6/mês** (só GPT-3.5)
- **Premium (150 users)**: 150 × 30k tokens × $0.03/1k = **$135/mês** (GPT-4)
- **VIP (50 users)**: 50 × 100k tokens × $0.05/1k = **$250/mês** (GPT-5)
- **Total**: ~**$391/mês**

#### Cenário Realista (5000 usuários)
- **Total Estimado**: ~**$1.955/mês**
- **Receita de Premium (150 × R$29,90)**: R$ 4.485/mês (~$900 USD)
- **Receita de VIP (50 × R$79,90)**: R$ 3.995/mês (~$800 USD)
- **Margem**: Positiva se taxa de conversão > 4%

### 4.2 Otimizações de Custo

1. **Cache de Respostas**: Armazenar respostas comuns
2. **Batching**: Agrupar requisições similares
3. **Model Downgrading**: Usar GPT-3.5 para tarefas simples automaticamente
4. **Hard Limits**: Desabilitar se custo mensal > $2000

```javascript
// Em middleware/quota.js - adicionar limite global
const GLOBAL_MONTHLY_LIMIT_USD = 2000;

async function checkGlobalBudget() {
  const monthCost = await calculateMonthCost();
  if (monthCost > GLOBAL_MONTHLY_LIMIT_USD) {
    throw new Error('Orçamento mensal de IA excedido');
  }
}
```

---

## 🔧 FASE 5: ATIVAÇÃO PASSO A PASSO

### Checklist de Implementação

#### ✅ Backend Setup

```bash
# 1. Navegar para pasta do backend
cd "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\Backend completo CS 2 Fortune"

# 2. Instalar dependências
npm install axios openai

# 3. Atualizar .env (adicionar variáveis acima)
# Editar manualmente o arquivo .env

# 4. Migrar banco de dados
npx prisma migrate dev --name add_ai_fields
npx prisma generate

# 5. Testar rotas
node index.js
# Servidor deve iniciar sem erros
```

#### ✅ Atualizar index.js

Adicione no arquivo `index.js`:

```javascript
// Após as importações existentes
const aiRoutes = require('./routes/ai');

// Após app.use(express.json())
app.use('/api/ai', authenticateToken, aiRoutes);
```

#### ✅ Testar Endpoints

```bash
# 1. Fazer login e obter token
POST http://localhost:3001/api/login/steam
Body: { "steamId": "test123", "username": "TestUser" }
# Copiar o token da resposta

# 2. Testar chat de IA
POST http://localhost:3001/api/ai/chat
Headers: { "Authorization": "Bearer <seu-token>" }
Body: {
  "message": "Qual a melhor estratégia para abrir caixas?",
  "modelPreference": "gpt-3.5-turbo"
}

# 3. Verificar quota
GET http://localhost:3001/api/ai/quota
Headers: { "Authorization": "Bearer <seu-token>" }

# 4. Listar modelos disponíveis
GET http://localhost:3001/api/ai/models
Headers: { "Authorization": "Bearer <seu-token>" }
```

#### ✅ Habilitar GPT-5 (Quando Disponível)

```bash
# 1. Atualizar .env
GPT5_ENABLED=true

# 2. Via API (Admin)
POST http://localhost:3001/api/ai/admin/enable-gpt5
Headers: { "Authorization": "Bearer <admin-token>" }
Body: {
  "enabled": true,
  "userIds": [1, 2, 3]  # IDs específicos, ou omitir para todos admins
}

# 3. Reiniciar servidor
# CTRL+C no terminal
node index.js
```

---

## 🎨 FASE 6: INTEGRAÇÃO FRONTEND

### 6.1 Criar Hook de IA no Frontend

```javascript
// hooks/useAI.js
import { useState } from 'react';
import api from '../services/api';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chat = async (message, modelPreference = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/ai/chat', {
        message,
        modelPreference
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao processar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeCase = async (caseId, userBudget) => {
    setLoading(true);
    try {
      const response = await api.post('/ai/analyze-case', {
        caseId,
        userBudget
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuota = async () => {
    const response = await api.get('/ai/quota');
    return response.data;
  };

  return { chat, analyzeCase, getQuota, loading, error };
}
```

### 6.2 Componente de Chat com IA

```javascript
// components/AIAssistant.js
import { useState } from 'react';
import { useAI } from '../hooks/useAI';

export default function AIAssistant() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const { chat, loading, error } = useAI();

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { role: 'user', content: message };
    setConversation(prev => [...prev, userMsg]);
    setMessage('');

    try {
      const result = await chat(message);
      const aiMsg = { role: 'assistant', content: result.response };
      setConversation(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Erro no chat:', err);
    }
  };

  return (
    <div className="ai-assistant">
      <div className="messages">
        {conversation.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte ao assistente..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

---

## 📧 FASE 7: TEMPLATE DE EMAIL/TICKET PARA OPENAI

### Template para Solicitar Acesso ao GPT-5

```
Assunto: Solicitação de Acesso ao GPT-5 API - CS2 Fortune

Prezada Equipe OpenAI,

Gostaria de solicitar acesso ao modelo GPT-5 via API para nosso projeto CS2 Fortune.

INFORMAÇÕES DO PROJETO:
- Nome: CS2 Fortune
- Website: [seu-dominio.com]
- Organization ID: [seu-org-id]
- Caso de Uso: Assistente de IA para análise de probabilidades em jogos CS2

JUSTIFICATIVA:
- Volume Estimado: ~50.000 tokens/dia inicialmente
- Orçamento Mensal: $500 - $2000 USD
- Número de Usuários: ~5.000 usuários ativos
- Rollout Planejado: Gradual (5% → 100% em 4 semanas)

CASOS DE USO ESPECÍFICOS:
1. Chat de estratégias para usuários premium
2. Análise de probabilidades de caixas/casos
3. Recomendações personalizadas baseadas em histórico

INFRAESTRUTURA:
- Backend: Node.js + Express
- Banco de Dados: PostgreSQL
- Controles implementados: Rate limiting, quotas por usuário, monitoramento de custos

Já implementamos toda a infraestrutura necessária e estamos prontos para iniciar testes assim que o acesso for concedido.

Agradeço pela atenção!

Atenciosamente,
[Seu Nome]
[Seu Email]
[Empresa/Projeto]
```

---

## 🛡️ FASE 8: SEGURANÇA E COMPLIANCE

### 8.1 Proteções Implementadas

- ✅ **Autenticação JWT** em todas as rotas
- ✅ **Rate Limiting** (20 req/min por usuário)
- ✅ **Quotas de Tokens** por plano
- ✅ **Validação de Input** em todas as mensagens
- ✅ **Logs de Auditoria** (AIUsageLog)
- ✅ **Controle de Custos** (limites diários/mensais)

### 8.2 Recomendações Adicionais

```javascript
// Content Filtering - Adicionar em services/openai.js
function filterContent(message) {
  const blockedWords = ['hack', 'cheat', 'exploit'];
  
  for (const word of blockedWords) {
    if (message.toLowerCase().includes(word)) {
      throw new Error('Conteúdo não permitido detectado');
    }
  }
  
  return message;
}
```

---

## 📊 RESUMO EXECUTIVO

### Onde Atualizar os Nomes dos Modelos

**1. Variável de Ambiente** (`.env`)
```bash
GPT5_ENABLED=true  # Ativar/desativar globalmente
```

**2. services/openai.js** (linha ~25)
```javascript
'gpt-5': {
  name: 'gpt-5',  // ⬅️ ATUALIZAR AQUI quando GPT-5 for lançado oficialmente
  maxTokens: 200000,
  costPer1kTokens: { input: 0.05, output: 0.10 },
  enabled: process.env.GPT5_ENABLED === 'true'
}
```

**3. Banco de Dados** (via SQL ou Prisma)
```sql
UPDATE "User" SET "aiModel" = 'gpt-5' WHERE "isAdmin" = true;
```

### Estimativa de Custo Total

- **Setup Inicial**: $0 (código já implementado)
- **Custos Mensais de API**: $390 - $2.000 (baseado em uso)
- **Potencial de Receita**: $1.700+ (150 premium + 50 VIP)
- **Margem Esperada**: 40-80% dependendo da taxa de conversão

### Cronograma Sugerido

| Semana | Fase | Ação Principal |
|--------|------|----------------|
| 1-2 | Preparação | Setup completo + testes internos |
| 3 | Beta (5%) | Admins apenas |
| 4 | Beta (15%) | VIPs + beta testers |
| 5 | Premium (40%) | Todos premium |
| 6 | Público (100%) | Liberação geral |
| 7+ | Otimização | Monitorar e ajustar |

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Adicionar variáveis ao `.env`
2. ✅ Executar migração do Prisma
3. ✅ Atualizar `index.js` com rotas de IA
4. ✅ Reiniciar backend e testar endpoints
5. ⏳ Enviar email para OpenAI solicitando acesso GPT-5
6. ⏳ Criar componente de chat no frontend
7. ⏳ Configurar monitoramento de custos
8. ⏳ Iniciar rollout gradual

---

**Documentação criada em:** ${new Date().toLocaleDateString('pt-BR')}
**Versão:** 1.0
**Autor:** GitHub Copilot para CS2 Fortune

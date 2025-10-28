# 🎨 COMPONENTES AI - DOCUMENTAÇÃO

## 📦 Componentes Criados

### 1. **hooks/useAI.js**

Hook customizado para integração com API de IA.

#### Funcionalidades:
- ✅ `fetchModels()` - Lista modelos disponíveis
- ✅ `fetchQuota()` - Verifica quota restante
- ✅ `sendChatMessage(message, history)` - Envia mensagens para chat
- ✅ `analyzeCase(caseId)` - Analisa probabilidades de cases
- ✅ `hasQuota` - Indica se usuário tem quota disponível
- ✅ `quotaPercentage` - Percentual de quota restante

#### Exemplo de Uso:
```javascript
import { useAI } from '../hooks/useAI';

function MeuComponente() {
  const { quota, sendChatMessage, loading, error } = useAI();
  
  const handleChat = async () => {
    const response = await sendChatMessage('Olá AI!');
    console.log(response.message);
  };
  
  return (
    <div>
      <p>Quota: {quota?.remaining} tokens</p>
      <button onClick={handleChat}>Enviar</button>
    </div>
  );
}
```

---

### 2. **hooks/useAI.js - useAIAdmin**

Hook para funcionalidades administrativas.

#### Funcionalidades:
- ✅ `fetchUsageStats()` - Estatísticas de uso global
- ✅ `enableGPT5(userIds)` - Habilita GPT-5 para usuários

#### Exemplo de Uso:
```javascript
import { useAIAdmin } from '../hooks/useAI';

function AdminPanel() {
  const { stats, enableGPT5, fetchUsageStats } = useAIAdmin();
  
  useEffect(() => {
    fetchUsageStats();
  }, []);
  
  return (
    <div>
      <p>Total Users: {stats?.totalUsers}</p>
      <button onClick={() => enableGPT5()}>Enable GPT-5 Globally</button>
    </div>
  );
}
```

---

### 3. **components/AIAssistant.js**

Componente de chat AI flutuante com interface completa.

#### Props:
- `context` (string): Contexto do assistente
  - `"general"` - Assistência geral
  - `"cases"` - Análise de cases
  - `"deposit"` - Ajuda com depósitos
  - `"withdraw"` - Ajuda com retiradas
- `caseId` (string, opcional): ID do case para análise automática

#### Funcionalidades:
- ✅ Chat interativo com histórico
- ✅ Análise de cases com um clique
- ✅ Indicador de quota em tempo real
- ✅ Auto-scroll para última mensagem
- ✅ Botão flutuante minimizável
- ✅ Mensagens de erro amigáveis
- ✅ Indicador de digitação (loading dots)

#### Exemplo de Uso:

**Página Inicial (geral)**:
```javascript
import AIAssistant from '../components/AIAssistant';

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo</h1>
      <AIAssistant context="general" />
    </div>
  );
}
```

**Página de Cases (com análise)**:
```javascript
import { useState } from 'react';
import AIAssistant from '../components/AIAssistant';

export default function Cases() {
  const [selectedCase, setSelectedCase] = useState(null);
  
  return (
    <div>
      <button onClick={() => setSelectedCase('case-123')}>
        Selecionar Case
      </button>
      <AIAssistant context="cases" caseId={selectedCase} />
    </div>
  );
}
```

---

## 🎨 Estilo Visual

### Cores Usadas:
- **Primária**: Purple 600 (`bg-purple-600`)
- **Secundária**: Blue 600 (`bg-blue-600`)
- **Background**: Gray 900/800 (`bg-gray-900`)
- **Texto**: White/Gray 100

### Animações:
- ✅ Hover scale no botão flutuante
- ✅ Bounce animation no loading
- ✅ Smooth scroll para mensagens
- ✅ Transições em botões

---

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Dependências

Já instaladas no projeto:
- `react` ^18.0.0
- `axios` ^1.4.0
- `next` ^13.0.0

### 3. Autenticação

O componente usa `localStorage.getItem('token')` para autenticação.
Certifique-se de que o login salva o token:

```javascript
// No login
localStorage.setItem('token', response.data.token);
```

---

## 📊 Estados do Componente

### Loading States:
- `loading`: Requisição em andamento
- `isAnalyzing`: Análise de case em andamento

### Error States:
- `error`: Mensagem de erro da API
- `msg.error`: Mensagem individual com erro

### Quota States:
- `hasQuota`: Boolean indicando se tem quota
- `quotaPercentage`: Número 0-100

---

## 🚀 Integração Completa

### Arquivo: pages/_app.js

Para usar em todas as páginas:

```javascript
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

### Páginas Integradas:

1. ✅ **pages/index.js** - Context: "general"
2. ✅ **pages/cases.js** - Context: "cases" + caseId
3. ✅ **pages/deposit.js** - Context: "deposit"

### Páginas Sugeridas para Integrar:

4. **pages/withdraw.js**:
```javascript
import AIAssistant from '../components/AIAssistant';

export default function Withdraw() {
  return (
    <>
      {/* Seu conteúdo */}
      <AIAssistant context="withdraw" />
    </>
  );
}
```

5. **pages/admin.js** (com useAIAdmin):
```javascript
import { useAIAdmin } from '../hooks/useAI';

export default function Admin() {
  const { stats, enableGPT5 } = useAIAdmin();
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => enableGPT5()}>Enable GPT-5</button>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
```

---

## 🔒 Controle de Acesso

### Por Plano:

O backend já controla automaticamente:

- **Free**: Apenas GPT-3.5, 5k tokens/mês
- **Premium**: GPT-3.5 + GPT-4, 50k tokens/mês
- **VIP**: Todos modelos GPT-4, 200k tokens/mês
- **Admin**: GPT-5 (quando habilitado), unlimited

### No Frontend:

```javascript
// Mostrar AI apenas para premium+
import { useAuth } from '../hooks/useAuth';

function MeuComponente() {
  const { user } = useAuth();
  
  return (
    <>
      {user?.isPremium && <AIAssistant />}
    </>
  );
}
```

---

## 🧪 Testes

### Testar Localmente:

1. **Iniciar backend**:
```bash
cd "Backend completo CS 2 Fortune"
npm start
```

2. **Iniciar frontend**:
```bash
cd "frontend CS2 Fortune completo"
npm run dev
```

3. **Acessar**: http://localhost:3000

4. **Fazer login** (obter token)

5. **Clicar no botão flutuante** (canto inferior direito)

6. **Testar chat**: "Olá! Como funciona a plataforma?"

7. **Testar análise**: Ir em `/cases` e clicar em uma caixa

---

## 📱 Responsividade

### Desktop (> 768px):
- Largura fixa: 384px (w-96)
- Altura fixa: 600px
- Posição: bottom-4 right-4

### Mobile (< 768px):

Adicione media queries se necessário:

```javascript
// Em AIAssistant.js
className="fixed bottom-4 right-4 w-96 md:w-full md:max-w-md h-[600px]"
```

---

## 🎯 Próximos Passos

### Melhorias Sugeridas:

1. **Persistência de Chat**:
   - Salvar histórico no localStorage
   - Carregar conversas anteriores

2. **Markdown Support**:
   - Renderizar respostas com formatação
   - Suporte a código, listas, etc.

3. **Voice Input** (futuro):
   - Speech-to-text para mensagens
   - Text-to-speech para respostas

4. **Sugestões Rápidas**:
   - Botões com perguntas comuns
   - Templates de análise

5. **Análise em Tempo Real**:
   - Stream de respostas (SSE/WebSockets)
   - Typing indicator mais realista

---

## 🆘 Troubleshooting

### Erro: "Cannot read property 'remaining' of null"

**Causa**: Usuário não autenticado

**Solução**: Verificar se token existe antes de renderizar:
```javascript
const token = localStorage.getItem('token');
if (!token) return null;
```

### Erro: "Network Error"

**Causa**: Backend offline ou CORS

**Solução**: 
1. Verificar se backend está rodando
2. Verificar CORS_ORIGIN no backend

### Quota não atualiza

**Causa**: Cache do hook

**Solução**: Forçar refresh após cada mensagem:
```javascript
// Após sendChatMessage
await fetchQuota();
```

---

## 📚 Referências

- **Backend API Docs**: Ver `routes/ai.js`
- **Rollout Plan**: Ver `PLANO_ROLLOUT_GPT5.md`
- **Deploy Guide**: Ver `GUIA_DEPLOY_PRODUCAO.md`

---

**Criado em**: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
**Versão**: 1.0

# 🏗️ ARQUITETURA COMPLETA - CS2 Fortune Frontend

## 📋 ÍNDICE
1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Fluxo de Renderização](#fluxo-de-renderização)
3. [Relacionamento entre Arquivos](#relacionamento-entre-arquivos)
4. [Roteamento Next.js](#roteamento-nextjs)
5. [Componentes e Hierarquia](#componentes-e-hierarquia)

---

## 📁 ESTRUTURA DE PASTAS

```
📦 frontend CS2 Fortune completo/
│
├── 📁 pages/                           # ✨ ROTAS AUTOMÁTICAS (Next.js Router)
│   │
│   ├── 📄 _document.js                 # 🌐 HTML Base (head, body, scripts)
│   │   └── Define: Meta tags, favicon, fonts, theme
│   │
│   ├── 📄 _app.js                      # 🎁 Wrapper Global
│   │   └── Importa: globals.css
│   │   └── Envolve: Todas as páginas
│   │
│   ├── 📄 index.js                     # 🏠 Rota: / (Página Inicial)
│   │   └── Componentes:
│   │       ├── Navbar
│   │       ├── ParticlesBackground
│   │       ├── Card3D (vários)
│   │       └── AIAssistant
│   │
│   ├── 📄 cases.js                     # 🎁 Rota: /cases
│   │   └── Componentes:
│   │       ├── Navbar
│   │       ├── ParticlesBackground
│   │       ├── Card3D
│   │       ├── CaseOpeningAnimation
│   │       ├── ResultModal
│   │       └── AIAssistant
│   │
│   ├── 📄 deposit.js                   # 💰 Rota: /deposit
│   │   └── Componentes:
│   │       ├── Navbar
│   │       ├── ParticlesBackground
│   │       ├── Card3D
│   │       └── AIAssistant
│   │
│   ├── 📄 withdraw.js                  # 💸 Rota: /withdraw
│   │   └── Componentes:
│   │       ├── Navbar
│   │       ├── ParticlesBackground
│   │       └── Card3D
│   │
│   └── 📄 login.js                     # 🔐 Rota: /login
│       └── Componentes:
│           ├── ParticlesBackground
│           └── Card3D
│
├── 📁 components/                      # ♻️ COMPONENTES REUTILIZÁVEIS
│   │
│   ├── 📄 Navbar.js                    # Menu de navegação
│   │   └── Links: Home, Cases, Deposit, Withdraw, Login
│   │   └── Estado: Saldo do usuário
│   │   └── Estilo: Fixed top, glassmorphism
│   │
│   ├── 📄 ParticlesBackground.js       # Background animado
│   │   └── Tech: Canvas API
│   │   └── Partículas: 80 unidades
│   │   └── Features: Conexões, física, resize
│   │
│   ├── 📄 Card3D.js                    # Card com efeito 3D
│   │   └── Props: gradient, borderColor, glowColor
│   │   └── Features: Hover transform, shimmer
│   │
│   ├── 📄 CaseOpeningAnimation.js      # Animação de abertura
│   │   └── Estágios: Spinning → Reveal → Complete
│   │   └── Duração: 3 segundos
│   │
│   ├── 📄 ResultModal.js               # Modal de resultado
│   │   └── Features: Confete (50 peças), fade-in
│   │   └── Botões: Ver Inventário, Abrir Outra
│   │
│   └── 📄 AIAssistant.js               # Assistente de IA
│       └── Service: api.js
│       └── Features: Chat, análise, estratégias
│
├── 📁 styles/                          # 🎨 ESTILOS GLOBAIS
│   │
│   └── 📄 globals.css                  # CSS principal
│       ├── @tailwind base
│       ├── @tailwind components
│       ├── @tailwind utilities
│       ├── 10 @keyframes (animações)
│       ├── Utility classes (.card-3d, .btn-glow)
│       └── Custom scrollbar
│
├── 📁 services/                        # 🔌 INTEGRAÇÕES EXTERNAS
│   │
│   └── 📄 api.js                       # Cliente HTTP
│       └── Base URL: http://localhost:3001
│       └── Endpoints: /api/login, /api/cases, etc.
│
├── 📁 hooks/                           # 🪝 REACT HOOKS CUSTOMIZADOS
│   │
│   └── 📄 useAI.js                     # Hook para AI
│       └── Estado: messages, loading
│       └── Funções: sendMessage, clearChat
│
├── 📁 public/                          # 📦 ARQUIVOS ESTÁTICOS
│   │
│   ├── 📁 images/                      # Imagens
│   │   └── (vazias - usando emojis Unicode)
│   │
│   ├── favicon.ico                     # (futuro)
│   └── robots.txt                      # (futuro)
│
├── 📁 .next/                           # ⚙️ BUILD DO NEXT.JS (auto-gerado)
│   ├── cache/                          # Cache de build
│   ├── server/                         # Código server-side
│   └── static/                         # Assets otimizados
│
├── 📄 package.json                     # 📦 Dependências
│   ├── next: ^13.0.0
│   ├── react: ^18.0.0
│   ├── tailwindcss: ^3.3.0
│   └── axios: ^1.4.0
│
├── 📄 next.config.js                   # ⚙️ Config Next.js
├── 📄 tailwind.config.js               # 🎨 Config Tailwind
├── 📄 postcss.config.js                # 🔧 Config PostCSS
├── 📄 .env.local                       # 🔐 Variáveis de ambiente
│   └── NEXT_PUBLIC_API_URL=http://localhost:3001
│
└── 📄 .gitignore                       # 🚫 Arquivos ignorados
    ├── node_modules/
    ├── .next/
    └── .env.local
```

---

## 🔄 FLUXO DE RENDERIZAÇÃO

### **Quando o usuário acessa `http://localhost:3000`:**

```mermaid
┌─────────────────────────────────────────────────────────────┐
│  1. Usuário acessa http://localhost:3000                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Next.js Server recebe requisição                        │
│     - Identifica rota: / → pages/index.js                   │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Next.js renderiza _document.js                          │
│     - Cria estrutura HTML base:                             │
│       <html lang="pt-BR">                                   │
│         <head>                                              │
│           <meta charset="UTF-8" />                          │
│           <title>CS2 Fortune</title>                        │
│           <meta name="description" content="..." />         │
│           <link rel="icon" href="/favicon.ico" />          │
│         </head>                                             │
│         <body>                                              │
│           {/* Conteúdo aqui */}                             │
│         </body>                                             │
│       </html>                                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Next.js renderiza _app.js                               │
│     - Importa globals.css (Tailwind + animações)            │
│     - Envolve a página com layout global                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Next.js renderiza pages/index.js                        │
│     - Componente principal: Home()                          │
│     - Hooks: useState, useEffect                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  6. React renderiza componentes filhos:                     │
│     ┌─────────────────────────────────────────────┐         │
│     │ <Navbar />                                  │         │
│     │  └── Links, Logo, Saldo                     │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ <ParticlesBackground />                     │         │
│     │  └── Canvas API, 80 partículas              │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ Hero Section                                │         │
│     │  ├── Título neon-gradient                   │         │
│     │  ├── Botões CTA                             │         │
│     │  └── 3x <Card3D /> (Stats)                  │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ Casos Populares                             │         │
│     │  └── 3x <Card3D /> (Starter, Premium, Elite)│         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ Vitórias Recentes (Feed)                    │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ Benefícios (6 features)                     │         │
│     │  └── 6x <Card3D />                          │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ Depoimentos (Carousel)                      │         │
│     │  └── Auto-rotate a cada 5s                  │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ Footer                                      │         │
│     └─────────────────────────────────────────────┘         │
│     ┌─────────────────────────────────────────────┐         │
│     │ <AIAssistant context="general" />           │         │
│     │  └── Chat flutuante                         │         │
│     └─────────────────────────────────────────────┘         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  7. CSS aplicado (globals.css)                              │
│     - Tailwind utilities                                    │
│     - Custom animations                                     │
│     - Responsive breakpoints                                │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  8. JavaScript interativo                                   │
│     - Event listeners                                       │
│     - useState/useEffect                                    │
│     - Animations trigger                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  9. Página completamente renderizada e interativa! 🎉       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 RELACIONAMENTO ENTRE ARQUIVOS

### **Hierarquia de Importação:**

```
_document.js (HTML base)
    │
    └──> _app.js (Wrapper global)
            │
            ├──> globals.css (Estilos)
            │
            └──> pages/index.js (Página específica)
                    │
                    ├──> components/Navbar.js
                    │       └──> Nenhuma dependência
                    │
                    ├──> components/ParticlesBackground.js
                    │       └──> React: useEffect, useRef
                    │
                    ├──> components/Card3D.js
                    │       └──> Props: gradient, borderColor, etc.
                    │
                    └──> components/AIAssistant.js
                            ├──> hooks/useAI.js
                            │       └──> services/api.js
                            │               └──> axios
                            └──> React: useState
```

### **Dependências de Cada Página:**

#### **pages/index.js**
```javascript
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'
import { useState, useEffect } from 'react'
```

#### **pages/cases.js**
```javascript
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'
import CaseOpeningAnimation from '../components/CaseOpeningAnimation'
import ResultModal from '../components/ResultModal'
import { useState } from 'react'
```

#### **pages/deposit.js**
```javascript
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'
```

#### **pages/withdraw.js**
```javascript
import Navbar from '../components/Navbar'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'
import { useState } from 'react'
```

#### **pages/login.js**
```javascript
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'
import { useState } from 'react'
import { useRouter } from 'next/router'
```

---

## 🗺️ ROTEAMENTO NEXT.JS

### **Rotas Automáticas:**

| Arquivo             | URL                | Descrição                |
|---------------------|--------------------|-----------------------|
| `pages/index.js`    | `/`                | Página inicial        |
| `pages/cases.js`    | `/cases`           | Lista de casos        |
| `pages/deposit.js`  | `/deposit`         | Página de depósito    |
| `pages/withdraw.js` | `/withdraw`        | Página de saque       |
| `pages/login.js`    | `/login`           | Login/Registro        |

### **Navegação entre Páginas:**

```javascript
// Método 1: Link do Next.js (recomendado)
import Link from 'next/link'
<Link href="/cases">Ver Casos</Link>

// Método 2: Router programático
import { useRouter } from 'next/router'
const router = useRouter()
router.push('/cases')

// Método 3: Tag <a> tradicional (recarrega página - NÃO recomendado)
<a href="/cases">Ver Casos</a>
```

---

## 🧩 COMPONENTES E HIERARQUIA

### **Árvore de Componentes (Home Page):**

```
<Html>
  <Head>
    {/* Meta tags, favicon, fonts */}
  </Head>
  <body>
    <App>
      <Home>
        <Navbar />
        <ParticlesBackground />
        
        <main>
          {/* Hero Section */}
          <section className="hero-gradient">
            <h1 className="neon-gradient">CS 2 Fortune</h1>
            <div className="grid">
              <Card3D gradient="purple">
                <div>50K+ Caixas</div>
              </Card3D>
              <Card3D gradient="blue">
                <div>10K+ Jogadores</div>
              </Card3D>
              <Card3D gradient="green">
                <div>$2M+ Prêmios</div>
              </Card3D>
            </div>
          </section>

          {/* Casos Populares */}
          <section>
            <Card3D gradient="gray">Starter $5</Card3D>
            <Card3D gradient="blue">Premium $10</Card3D>
            <Card3D gradient="purple">Elite $25</Card3D>
          </section>

          {/* Vitórias Recentes */}
          <section>
            {recentWins.map(win => <div>{win}</div>)}
          </section>

          {/* Benefícios */}
          <section>
            <Card3D gradient="purple">⚡ Instantâneo</Card3D>
            <Card3D gradient="pink">🔒 Seguro</Card3D>
            <Card3D gradient="blue">🎁 Exclusivo</Card3D>
            <Card3D gradient="green">💰 Rápido</Card3D>
            <Card3D gradient="yellow">🤖 IA</Card3D>
            <Card3D gradient="red">🏆 Bônus</Card3D>
          </section>

          {/* Depoimentos */}
          <section>
            <Card3D>
              {testimonials[activeIndex]}
            </Card3D>
          </section>

          {/* Footer */}
          <footer>
            <div>Links</div>
            <div>Suporte</div>
            <div>Social</div>
          </footer>
        </main>

        <AIAssistant context="general" />
      </Home>
    </App>
  </body>
</Html>
```

### **Árvore de Componentes (Cases Page):**

```
<Html>
  <body>
    <App>
      <Cases>
        <Navbar />
        <ParticlesBackground />
        
        <main>
          {/* Lista de Casos */}
          <section>
            {cases.map(case => (
              <Card3D gradient={case.gradient}>
                <div onClick={() => openCase(case.id)}>
                  {case.name} - {case.price}
                </div>
              </Card3D>
            ))}
          </section>

          {/* Animação de Abertura */}
          {isOpening && (
            <CaseOpeningAnimation
              items={caseItems}
              onComplete={handleComplete}
            />
          )}

          {/* Modal de Resultado */}
          {showResult && (
            <ResultModal
              item={wonItem}
              onClose={() => setShowResult(false)}
            />
          )}
        </main>

        <AIAssistant context="cases" />
      </Cases>
    </App>
  </body>
</Html>
```

---

## 🎨 SISTEMA DE ESTADOS

### **Estados Globais (potencial):**
```javascript
// Futuro: Context API ou Redux
const GlobalContext = {
  user: {
    id: 123,
    username: "Player",
    balance: 100.50,
    isAuthenticated: true
  },
  theme: "dark",
  language: "pt-BR"
}
```

### **Estados Locais (páginas):**

#### **pages/index.js:**
```javascript
const [isMobile, setIsMobile] = useState(false)
const [activeTestimonial, setActiveTestimonial] = useState(0)
```

#### **pages/cases.js:**
```javascript
const [selectedCase, setSelectedCase] = useState(null)
const [isOpening, setIsOpening] = useState(false)
const [showResult, setShowResult] = useState(false)
const [wonItem, setWonItem] = useState(null)
```

#### **pages/withdraw.js:**
```javascript
const [withdrawAmount, setWithdrawAmount] = useState('')
const [selectedMethod, setSelectedMethod] = useState(null)
```

#### **pages/login.js:**
```javascript
const [isLogin, setIsLogin] = useState(true)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
```

---

## 🔌 INTEGRAÇÃO COM BACKEND

### **Fluxo de Comunicação:**

```
Frontend (React)
    ↓
services/api.js (axios)
    ↓
HTTP Request → http://localhost:3001/api/*
    ↓
Backend (Express)
    ↓
Database (SQLite/PostgreSQL)
    ↓
Response JSON
    ↓
Frontend atualiza UI
```

### **Exemplo de Chamada API:**

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
})

export const login = async (email, password) => {
  const response = await api.post('/api/login', { email, password })
  return response.data
}

export const getCases = async () => {
  const response = await api.get('/api/cases')
  return response.data
}

export const openCase = async (caseId, userId) => {
  const response = await api.post('/api/cases/open', { caseId, userId })
  return response.data
}
```

---

## 📊 PERFORMANCE E OTIMIZAÇÕES

### **Build Otimizado:**
```bash
npm run build
# Resultado:
Page                              Size     First Load JS
┌ ○ /                            5.2 kB          85 kB
├ ○ /cases                       4.8 kB          84.6 kB
├ ○ /deposit                     3.9 kB          83.7 kB
├ ○ /withdraw                    4.1 kB          83.9 kB
└ ○ /login                       3.5 kB          83.3 kB

○  (Static)  automatically rendered as static HTML
```

### **Estratégias de Performance:**
1. ✅ **Code Splitting** - Cada página carrega apenas seu JS
2. ✅ **Tree Shaking** - Remove código não usado
3. ✅ **CSS Purging** - Tailwind remove classes não usadas
4. ✅ **Image Optimization** - Usando emojis Unicode (0 KB)
5. ✅ **Lazy Loading** - Componentes carregam sob demanda
6. ✅ **Memoization** - React.memo em componentes pesados
7. ✅ **SSR/SSG** - Renderização server-side

---

## 🚀 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev                # Inicia servidor dev (port 3000)

# Build de Produção
npm run build              # Cria build otimizado
npm start                  # Inicia servidor prod

# Análise de Bundle
npm run build -- --profile # Build com análise

# Limpar cache
rm -rf .next               # Remove build cache
npm run dev                # Rebuild automático
```

---

## 📝 RESUMO

### **Não existe `index.html` porque:**
- ✅ Next.js gera HTML automaticamente
- ✅ `_document.js` é o equivalente
- ✅ Cada página tem seu próprio HTML renderizado
- ✅ SSR/SSG cria HTML otimizado no build

### **Estrutura Final:**
```
_document.js  →  HTML base (<html>, <head>, <body>)
_app.js       →  Layout global (globals.css)
index.js      →  Conteúdo da página (/)
components/   →  Blocos reutilizáveis
styles/       →  CSS global + animações
services/     →  APIs externas
```

### **Vantagens desta Arquitetura:**
1. ✅ **Modular** - Componentes reutilizáveis
2. ✅ **Escalável** - Fácil adicionar novas páginas
3. ✅ **Performático** - Code splitting automático
4. ✅ **SEO-friendly** - SSR/SSG built-in
5. ✅ **Manutenível** - Código organizado
6. ✅ **Moderno** - React 18 + Next.js 13

**Esta é uma arquitetura profissional e pronta para produção! 🚀**

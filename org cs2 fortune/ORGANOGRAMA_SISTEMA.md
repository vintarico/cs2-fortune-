# 🎮 ORGANOGRAMA COMPLETO - CS2 FORTUNE

## 📊 ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    CS2 FORTUNE SYSTEM                        │
│                  (Plataforma de Cases CS2)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         ┌──────▼──────┐         ┌─────▼──────┐
         │  FRONTEND   │         │  BACKEND   │
         │  Next.js    │◄───────►│  Node.js   │
         │  Port 3000  │   API   │  Port 3001 │
         └─────────────┘         └────────────┘
                                      │
                              ┌───────┴────────┐
                              │                │
                       ┌──────▼─────┐   ┌─────▼──────┐
                       │ PostgreSQL │   │ Steam API  │
                       │  Database  │   │  External  │
                       └────────────┘   └────────────┘
```

---

## 🎨 FRONTEND (Next.js 13.5.11)

### 📁 Estrutura de Pastas

```
frontend CS2 Fortune completo/
│
├── 📄 pages/                      # Páginas do site
│   ├── _app.js                    # App wrapper principal
│   ├── index.js                   # Homepage
│   ├── login.js                   # Página de login/registro
│   ├── cases.js                   # Listagem de cases
│   ├── deposit.js                 # Depósito de saldo
│   ├── withdraw.js                # Saque de saldo
│   ├── inventory.js               # Inventário do usuário
│   ├── profile.js                 # Perfil e bônus diário
│   ├── upgrade.js                 # Sistema de upgrade de skins
│   ├── contract.js                # Trade-up contract
│   ├── leaderboard.js             # Ranking de jogadores
│   ├── affiliate.js               # Sistema de afiliados
│   ├── admin.js                   # Painel administrativo
│   ├── battles.js                 # Listagem de batalhas
│   └── battles/
│       └── [id].js                # Página individual de batalha
│
├── 🧩 components/                 # Componentes reutilizáveis
│   ├── Navbar.js                  # Barra de navegação
│   ├── LiveFeed.js                # Feed ao vivo de drops
│   ├── SkinImage.js               # Componente de imagem de skin
│   ├── CaseCard.js                # Card de case
│   └── NotificationModal.js       # Modal de notificações
│
├── 🔧 contexts/                   # Contextos React
│   ├── UserContext.js             # Contexto de usuário (auth, saldo)
│   └── NotificationContext.js     # Contexto de notificações
│
├── 🎣 hooks/                      # Custom hooks
│   └── useAuth.js                 # Hook de autenticação
│
├── 📊 data/                       # Dados estáticos
│   ├── cases-original.js          # Cases originais CS2
│   ├── cases-new.js               # Novos cases customizados
│   └── rarities.js                # Configuração de raridades
│
├── 🎨 styles/                     # Estilos
│   └── globals.css                # CSS global
│
├── 🖼️ public/                     # Arquivos estáticos
│   └── images/
│       └── background/
│           └── home-bg.jpg        # Imagem de fundo da homepage
│
└── ⚙️ Configuração
    ├── package.json               # Dependências
    ├── next.config.js             # Configuração Next.js
    └── tailwind.config.js         # Configuração Tailwind
```

### 🔄 Fluxo de Páginas

```
┌──────────────┐
│   Homepage   │ (index.js)
└──────┬───────┘
       │
       ├──► Login/Registro (login.js)
       │         │
       │         ├──► Steam OAuth
       │         └──► Email/Senha
       │
       ├──► Cases (cases.js)
       │         │
       │         └──► Abrir Case
       │                 │
       │                 └──► Animação de roleta
       │                          │
       │                          └──► Item recebido → Inventário
       │
       ├──► Battles (battles.js)
       │         │
       │         ├──► Criar Batalha
       │         ├──► Entrar em Batalha
       │         └──► [id].js (Batalha específica)
       │                 │
       │                 ├──► Animação vertical
       │                 └──► Resultado → Vencedor
       │
       ├──► Upgrade (upgrade.js)
       │         │
       │         ├──► Selecionar skin alvo
       │         ├──► Selecionar skins para upgrade
       │         └──► Tentar upgrade (% de sucesso)
       │
       ├──► Contract (contract.js)
       │         │
       │         ├──► Selecionar 10 skins mesma raridade
       │         └──► Receber 1 skin raridade superior
       │
       ├──► Deposit (deposit.js)
       │         │
       │         ├──► PIX
       │         ├──► Cartão de Crédito
       │         └──► Crypto
       │
       ├──► Withdraw (withdraw.js)
       │         │
       │         ├──► PIX
       │         └──► Transferência bancária
       │
       ├──► Inventory (inventory.js)
       │         │
       │         ├──► Ver itens
       │         ├──► Vender itens
       │         └──► Usar em upgrade/contract
       │
       ├──► Profile (profile.js)
       │         │
       │         ├──► Dados do usuário
       │         ├──► Histórico
       │         └──► Bônus diário
       │
       ├──► Leaderboard (leaderboard.js)
       │         │
       │         ├──► Top casos abertos
       │         ├──► Top valor ganho
       │         └──► Top batalhas vencidas
       │
       ├──► Affiliate (affiliate.js)
       │         │
       │         ├──► Gerar link de afiliado
       │         ├──► Ver estatísticas
       │         └──► Sacar comissões
       │
       └──► Admin (admin.js)
                 │
                 ├──► Gerenciar usuários
                 ├──► Gerenciar cases
                 ├──► Ver transações
                 └──► Configurações do site
```

---

## 🔧 BACKEND (Node.js + Express)

### 📁 Estrutura

```
Backend completo CS 2 Fortune/
│
├── 📄 index.js                    # Servidor principal
├── 📦 package.json                # Dependências
└── 🗄️ prisma/
    └── schema.prisma              # Schema do banco de dados
```

### 🛣️ API Routes (Rotas)

```
┌─────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                         │
└─────────────────────────────────────────────────────────┘

📍 AUTENTICAÇÃO
├── POST   /api/auth/register              # Registro de usuário
├── POST   /api/auth/login                 # Login de usuário
├── GET    /api/auth/steam                 # Login via Steam OAuth
└── GET    /api/auth/me                    # Dados do usuário logado

📍 CASES
├── GET    /api/cases                      # Listar todos os cases
├── GET    /api/cases/:id                  # Detalhes de um case
├── POST   /api/cases/open                 # Abrir um case
│          Body: { caseId, userId }
│          Return: { item, value, rarity }
└── GET    /api/cases/history              # Histórico de aberturas

📍 INVENTÁRIO
├── GET    /api/inventory                  # Inventário do usuário
├── POST   /api/inventory/sell             # Vender item
│          Body: { itemId }
└── GET    /api/inventory/stats            # Estatísticas do inventário

📍 UPGRADE
├── POST   /api/upgrade/attempt            # Tentar upgrade
│          Body: { targetSkin, skinIds[] }
│          Return: { success, item }
└── GET    /api/upgrade/calculate          # Calcular % de sucesso
           Body: { targetValue, totalValue }

📍 CONTRACT
├── POST   /api/contract/execute           # Executar trade-up contract
│          Body: { skinIds[] }             # 10 skins mesma raridade
│          Return: { item }                # 1 skin raridade superior
└── POST   /api/contract/validate          # Validar skins para contract
           Body: { skinIds[] }

📍 BATTLES
├── GET    /api/battles                    # Listar batalhas ativas
├── POST   /api/battles/create             # Criar batalha
│          Body: { caseId, mode, rounds, isPrivate }
├── GET    /api/battles/:id                # Detalhes de uma batalha
├── POST   /api/battles/:id/join           # Entrar em batalha
├── POST   /api/battles/:id/start          # Iniciar batalha
└── GET    /api/battles/:id/results        # Resultados da batalha

📍 PAGAMENTOS
├── POST   /api/payments/deposit           # Criar depósito
│          Body: { amount, method }
├── POST   /api/payments/withdraw          # Solicitar saque
│          Body: { amount, method, pixKey }
├── GET    /api/payments/history           # Histórico de transações
└── POST   /api/payments/webhook           # Webhook de pagamento

📍 USUÁRIO
├── GET    /api/user/profile               # Perfil do usuário
├── PUT    /api/user/profile               # Atualizar perfil
├── POST   /api/user/daily-bonus           # Resgatar bônus diário
└── GET    /api/user/stats                 # Estatísticas do usuário

📍 LEADERBOARD
├── GET    /api/leaderboard/cases          # Top casos abertos
├── GET    /api/leaderboard/winnings       # Top valor ganho
└── GET    /api/leaderboard/battles        # Top batalhas vencidas

📍 AFILIADOS
├── GET    /api/affiliate/code             # Gerar código de afiliado
├── GET    /api/affiliate/stats            # Estatísticas de afiliado
└── POST   /api/affiliate/withdraw         # Sacar comissões

📍 ADMIN
├── GET    /api/admin/users                # Listar usuários
├── PUT    /api/admin/users/:id            # Editar usuário
├── GET    /api/admin/transactions         # Ver transações
├── POST   /api/admin/cases                # Criar/editar cases
└── GET    /api/admin/statistics           # Estatísticas do site

📍 STEAM
├── GET    /api/steam/price                # Buscar preço de skin
│          Query: name=AK-47 | Redline
├── GET    /api/steam/skin                 # Buscar dados completos
│          Query: name, icon
├── POST   /api/steam/sync                 # Sincronizar preços
└── GET    /api/steam/image-url            # Gerar URL de imagem
```

### 🗄️ DATABASE SCHEMA (PostgreSQL + Prisma)

```
┌─────────────────────────────────────────────────────────┐
│                   DATABASE MODELS                        │
└─────────────────────────────────────────────────────────┘

👤 User
├── id              (Int, Primary Key)
├── email           (String, Unique)
├── username        (String, Unique)
├── password        (String, Hashed)
├── balance         (Decimal)
├── steamId         (String, Optional)
├── role            (String: user/admin)
├── affiliateCode   (String, Unique)
├── referrerId      (Int, Foreign Key)
├── lastDailyBonus  (DateTime)
├── createdAt       (DateTime)
└── updatedAt       (DateTime)

📦 Case
├── id              (Int, Primary Key)
├── name            (String)
├── price           (Decimal)
├── image           (String)
├── category        (String)
├── items           (JSON Array)
│   └── { name, rarity, chance, value, image }
├── createdAt       (DateTime)
└── updatedAt       (DateTime)

🎁 Item
├── id              (Int, Primary Key)
├── name            (String)
├── rarity          (String)
├── value           (Decimal)
├── image           (String)
├── category        (String)
├── float           (Decimal, Optional)
├── statTrak        (Boolean)
├── createdAt       (DateTime)
└── updatedAt       (DateTime)

🎒 Inventory
├── id              (Int, Primary Key)
├── userId          (Int, Foreign Key → User)
├── itemId          (Int, Foreign Key → Item)
├── caseId          (Int, Foreign Key → Case)
├── acquiredFrom    (String: case/battle/upgrade/contract)
├── sold            (Boolean)
├── soldAt          (DateTime, Optional)
├── soldPrice       (Decimal, Optional)
├── createdAt       (DateTime)
└── updatedAt       (DateTime)

⚔️ Battle
├── id              (Int, Primary Key)
├── creator         (Int, Foreign Key → User)
├── caseId          (Int, Foreign Key → Case)
├── caseName        (String)
├── casePrice       (Decimal)
├── mode            (String: 1v1, 2v2, 1v1v1v1)
├── rounds          (Int)
├── maxPlayers      (Int)
├── costPerPlayer   (Decimal)
├── isPrivate       (Boolean)
├── status          (String: waiting/in_progress/finished)
├── participants    (JSON Array)
│   └── { userId, username, joinedAt }
├── results         (JSON Array, Optional)
│   └── { userId, items[], totalValue }
├── winnerId        (Int, Foreign Key → User, Optional)
├── createdAt       (DateTime)
├── startedAt       (DateTime, Optional)
└── finishedAt      (DateTime, Optional)

📈 Upgrade
├── id              (Int, Primary Key)
├── userId          (Int, Foreign Key → User)
├── targetItemId    (Int, Foreign Key → Item)
├── inputItems      (JSON Array)
│   └── { itemId, value }
├── totalValue      (Decimal)
├── successChance   (Decimal)
├── success         (Boolean)
├── createdAt       (DateTime)
└── updatedAt       (DateTime)

📜 Contract
├── id              (Int, Primary Key)
├── userId          (Int, Foreign Key → User)
├── inputItems      (JSON Array) # 10 items
│   └── { itemId, rarity, value }
├── outputItemId    (Int, Foreign Key → Item)
├── createdAt       (DateTime)
└── updatedAt       (DateTime)

💰 Transaction
├── id              (Int, Primary Key)
├── userId          (Int, Foreign Key → User)
├── type            (String: deposit/withdraw)
├── method          (String: pix/credit_card/crypto)
├── amount          (Decimal)
├── status          (String: pending/completed/failed)
├── referenceId     (String, Unique)
├── pixKey          (String, Optional)
├── createdAt       (DateTime)
└── completedAt     (DateTime, Optional)

🤝 Referral
├── id              (Int, Primary Key)
├── referrerId      (Int, Foreign Key → User)
├── referredId      (Int, Foreign Key → User)
├── commission      (Decimal)
├── paid            (Boolean)
├── createdAt       (DateTime)
└── paidAt          (DateTime, Optional)

🔔 Notification
├── id              (Int, Primary Key)
├── userId          (Int, Foreign Key → User)
├── type            (String: info/success/warning/error)
├── message         (String)
├── read            (Boolean)
├── createdAt       (DateTime)
└── readAt          (DateTime, Optional)

📊 CaseOpening (Histórico)
├── id              (Int, Primary Key)
├── userId          (Int, Foreign Key → User)
├── caseId          (Int, Foreign Key → Case)
├── itemId          (Int, Foreign Key → Item)
├── itemValue       (Decimal)
├── createdAt       (DateTime)
└── updatedAt       (DateTime)
```

---

## 🔄 FLUXO DE DADOS

### 1️⃣ Abertura de Case

```
USER ACTION                    FRONTEND                    BACKEND                    DATABASE
    │                             │                          │                           │
    ├──► Clica "Abrir Case"      │                          │                           │
    │                             │                          │                           │
    │                             ├──► POST /api/cases/open │                           │
    │                             │    { caseId, userId }    │                           │
    │                             │                          │                           │
    │                             │                          ├──► Verifica saldo        │
    │                             │                          │                           │
    │                             │                          ├──► Deduz valor do case   │
    │                             │                          │                           │
    │                             │                          ├──► Gera item aleatório   │
    │                             │                          │    (baseado em %)         │
    │                             │                          │                           │
    │                             │                          ├──► Salva no inventário ─►│
    │                             │                          │                           │
    │                             │◄─── Return item data ────┤                           │
    │                             │                          │                           │
    │◄─── Animação de roleta ────┤                          │                           │
    │                             │                          │                           │
    │◄─── Mostra item ganho ─────┤                          │                           │
```

### 2️⃣ Batalha de Cases

```
CRIADOR                        PARTICIPANTE                  BACKEND
    │                              │                            │
    ├──► Cria batalha              │                            │
    │    (case, modo, rodadas)     │                            │
    │                              │                            │
    │    POST /api/battles/create ────────────────────────────►│
    │                              │                            │
    │                              │                            ├──► Salva batalha
    │                              │                            │    status: waiting
    │◄──────────────────────────── Return battleId ────────────┤
    │                              │                            │
    │                              ├──► Entra na batalha        │
    │                              │    POST /battles/:id/join  │
    │                              │                            │
    │                              │───────────────────────────►│
    │                              │                            │
    │                              │                            ├──► Adiciona participante
    │                              │◄─────────────────────────────┤
    │                              │                            │
    │◄──── Atualização (polling) ──────────────────────────────┤
    │      GET /battles/:id        │                            │
    │                              │                            │
    │                              │                            ├──► Quando cheio:
    │                              │                            │    status: in_progress
    │                              │                            │
    │                              │                            ├──► Para cada rodada:
    │                              │                            │    - Abre case para cada player
    │                              │                            │    - Salva resultados
    │                              │                            │
    │◄──── Animação vertical ──────────────────────────────────┤
    │      (para cada jogador)     │                            │
    │                              │                            │
    │                              │                            ├──► Calcula vencedor
    │                              │                            │    (maior valor total)
    │                              │                            │
    │◄──────────────────────────── Resultado ───────────────────┤
    │                              │                            │
    │    Itens → Inventário do vencedor                         │
```

### 3️⃣ Upgrade de Skin

```
USER                           FRONTEND                    BACKEND
  │                               │                          │
  ├──► Seleciona skin alvo        │                          │
  │                               │                          │
  ├──► Seleciona skins para usar │                          │
  │                               │                          │
  │                               ├──► POST /api/upgrade/calculate
  │                               │    { targetValue, totalValue }
  │                               │                          │
  │                               │◄─── Return { chance: 65% }
  │                               │                          │
  │◄─── Mostra % de sucesso ─────┤                          │
  │                               │                          │
  ├──► Confirma upgrade           │                          │
  │                               │                          │
  │                               ├──► POST /api/upgrade/attempt
  │                               │    { targetSkin, skinIds[] }
  │                               │                          │
  │                               │                          ├──► Remove skins do inventário
  │                               │                          │
  │                               │                          ├──► Gera número aleatório
  │                               │                          │    (0-100)
  │                               │                          │
  │                               │                          ├──► Se < chance%: SUCESSO
  │                               │                          │    - Adiciona skin alvo
  │                               │                          │
  │                               │                          ├──► Se >= chance%: FALHA
  │                               │                          │    - Não adiciona nada
  │                               │                          │
  │                               │◄─── Return { success, item }
  │                               │                          │
  │◄─── Animação de resultado ───┤                          │
```

---

## 🔐 SEGURANÇA

```
CAMADAS DE SEGURANÇA

1️⃣ AUTENTICAÇÃO
   ├── JWT Tokens (Bearer)
   ├── Senhas hasheadas (bcrypt)
   ├── Steam OAuth
   └── Refresh tokens

2️⃣ AUTORIZAÇÃO
   ├── Middleware de verificação de token
   ├── Role-based access (user/admin)
   └── Verificação de ownership (user pode mexer apenas em seus items)

3️⃣ VALIDAÇÃO
   ├── Validação de inputs (Joi/Zod)
   ├── Sanitização de dados
   ├── Rate limiting
   └── CORS configurado

4️⃣ TRANSAÇÕES
   ├── Database transactions (Prisma)
   ├── Verificação de saldo antes de operações
   ├── Logs de todas as transações
   └── Rollback em caso de erro

5️⃣ PAGAMENTOS
   ├── Webhooks assinados
   ├── Verificação de status
   ├── Idempotência (evita duplicação)
   └── Timeout de transações pendentes
```

---

## 📊 CONFIGURAÇÕES DE RARIDADES

```
SISTEMA DE RARIDADES (CS2)

Consumer Grade (Cinza)
├── Cor: #B0C3D9
├── Chance: 79.92%
└── Valor médio: R$ 0.03 - R$ 1.00

Industrial Grade (Azul Claro)
├── Cor: #5E98D9
├── Chance: 15.98%
└── Valor médio: R$ 0.05 - R$ 3.00

Mil-Spec (Azul)
├── Cor: #4B69FF
├── Chance: 3.20%
└── Valor médio: R$ 0.10 - R$ 10.00

Restricted (Roxo)
├── Cor: #8847FF
├── Chance: 0.64%
└── Valor médio: R$ 1.00 - R$ 50.00

Classified (Rosa/Magenta)
├── Cor: #D32CE6
├── Chance: 0.13%
└── Valor médio: R$ 5.00 - R$ 200.00

Covert (Vermelho)
├── Cor: #EB4B4B
├── Chance: 0.026%
└── Valor médio: R$ 20.00 - R$ 5.000.00

⭐ Exceedingly Rare (Ouro) - Special Items
├── Cor: #FFD700
├── Chance: 0.0026%
└── Valor médio: R$ 100.00 - R$ 50.000.00+
```

---

## 🚀 DEPLOY & INFRAESTRUTURA

```
AMBIENTE DE PRODUÇÃO

Frontend (Vercel)
├── URL: https://cs2fortune.vercel.app
├── Auto-deploy from GitHub
├── Edge Functions
└── CDN Global

Backend (Railway/Heroku)
├── URL: https://api-cs2fortune.railway.app
├── Node.js Container
├── Auto-scaling
└── Health checks

Database (Railway/Heroku PostgreSQL)
├── PostgreSQL 14+
├── Automated backups
├── Connection pooling
└── SSL enabled

Storage (Cloudinary/S3)
├── Imagens de skins
├── CDN
└── Otimização automática

Monitoramento
├── Sentry (Error tracking)
├── LogRocket (Session replay)
└── Google Analytics
```

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### Frontend
```json
{
  "next": "13.5.11",
  "react": "18.2.0",
  "tailwindcss": "3.4.1",
  "axios": "^1.6.0",
  "socket.io-client": "^4.6.0"
}
```

### Backend
```json
{
  "express": "^4.18.0",
  "prisma": "^5.0.0",
  "@prisma/client": "^5.0.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "axios": "^1.6.0",
  "cors": "^2.8.5"
}
```

---

## 🎯 RESUMO DE FEATURES

✅ **IMPLEMENTADO**
- [x] Sistema de autenticação (JWT + Steam OAuth)
- [x] Abertura de cases com animação
- [x] Inventário de skins
- [x] Sistema de upgrade
- [x] Trade-up contract
- [x] Case battles (1v1, 2v2, 1v1v1v1)
- [x] Live feed de drops
- [x] Sistema de pagamentos (PIX, Cartão, Crypto)
- [x] Bônus diário
- [x] Painel administrativo
- [x] Integração com Steam Market API

⏳ **PENDENTE**
- [ ] Sistema de notificações completo
- [ ] Leaderboard funcional
- [ ] Sistema de afiliados completo
- [ ] Chat ao vivo
- [ ] Sistema de conquistas/badges
- [ ] Provably fair system
- [ ] Modo escuro/claro

---

## 📝 NOTAS TÉCNICAS

### Performance
- Lazy loading de componentes
- Image optimization (Next.js Image)
- Code splitting automático
- API response caching
- Database connection pooling

### SEO
- Meta tags dinâmicas
- Sitemap.xml
- Robots.txt
- Open Graph tags
- Structured data (JSON-LD)

### Responsividade
- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Progressive Web App (PWA) ready

---

**📅 Última atualização:** 27 de Outubro de 2025
**🔖 Versão:** 1.0.0
**👨‍💻 Stack:** Next.js 13 + Node.js + PostgreSQL + Prisma

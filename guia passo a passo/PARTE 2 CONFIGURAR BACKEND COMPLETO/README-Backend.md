# 🔧 CS 2 Fortune - Backend API

API REST para sistema de abertura de caixas e troca de skins CS2 com autenticação, pagamentos e painel admin.

![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4-lightgrey?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)

## 🚀 Funcionalidades

- ✅ Autenticação JWT + Steam OpenID
- ✅ Sistema de saldo e transações
- ✅ Pagamentos PIX (Mercado Pago)
- ✅ Pagamentos Cripto (CoinPayments)
- ✅ Bot de trade Steam
- ✅ 2FA (Google Authenticator)
- ✅ Painel administrativo
- ✅ Webhook para confirmação de pagamentos
- ✅ Rate limiting e segurança

## 📋 Requisitos

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/cs2-fortune-backend.git
cd cs2-fortune-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie um banco PostgreSQL:

```sql
CREATE DATABASE cs2fortune;
```

### 4. Configure variáveis de ambiente

Crie o arquivo `.env`:

```env
# Database
DATABASE_URL=postgresql://usuario:senha@localhost:5432/cs2fortune

# JWT
SECRET_KEY=sua_chave_secreta_muito_forte_123456789

# URLs
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Mercado Pago (opcional)
MERCADO_PAGO_ACCESS_TOKEN=seu_token

# CoinPayments (opcional)
COINPAYMENTS_API_KEY=sua_key
COINPAYMENTS_API_SECRET=seu_secret

# Steam Bot (opcional)
STEAM_USERNAME=seu_usuario
STEAM_PASSWORD=sua_senha
STEAM_SHARED_SECRET=seu_shared_secret
STEAM_IDENTITY_SECRET=seu_identity_secret

# Server
PORT=3001
NODE_ENV=development
```

### 5. Execute migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Inicie o servidor

```bash
npm start
```

API rodando em: [http://localhost:3001](http://localhost:3001)

## 🌐 Deploy no Railway

### 1. Crie conta no Railway

Acesse [railway.app](https://railway.app) e faça login com GitHub.

### 2. Crie novo projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha este repositório

### 3. Adicione PostgreSQL

1. No projeto, clique em **"New"**
2. Selecione **"Database"** → **"PostgreSQL"**

### 4. Configure variáveis

Adicione em **"Variables"**:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=sua_chave_aqui
FRONTEND_URL=https://seu-frontend.vercel.app
BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
```

### 5. Configure build

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command:**
```bash
npm start
```

### 6. Gere domínio público

1. Vá em **"Settings"** → **"Networking"**
2. Clique em **"Generate Domain"**
3. Copie a URL gerada

## 📡 Endpoints da API

### Autenticação

#### `POST /api/login/steam`
Login com Steam

**Body:**
```json
{
  "steamId": "76561198000000001",
  "username": "Player1"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "steamId": "76561198000000001",
    "username": "Player1",
    "saldo": 100.0,
    "isAdmin": false
  }
}
```

### Usuário

#### `GET /api/saldo`
Obter saldo atual (requer autenticação)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "saldo": 150.50
}
```

### Transações

#### `POST /api/transaction`
Criar transação

**Body:**
```json
{
  "type": "deposito",
  "amount": 50.00
}
```

Tipos: `deposito`, `retirada`, `compra`, `venda`

### Pagamentos

#### `POST /api/payment/pix`
Gerar QR Code PIX

**Body:**
```json
{
  "amount": 100.00
}
```

### Admin

#### `GET /api/admin/users`
Listar todos os usuários (requer admin)

#### `GET /api/admin/transactions`
Listar todas as transações (requer admin)

## 📁 Estrutura do Projeto

```
cs2-fortune-backend/
├── prisma/
│   └── schema.prisma          # Schema do banco
├── index.js                   # Servidor principal
├── steamBot.js                # Bot de trade Steam
├── .env                       # Variáveis de ambiente
├── .gitignore
└── package.json
```

## 🗄️ Schema do Banco

### User
```prisma
model User {
  id                Int
  steamId           String  @unique
  username          String?
  saldo             Float   @default(0)
  isAdmin           Boolean @default(false)
  twoFactorSecret   String?
  twoFactorEnabled  Boolean @default(false)
  transactions      Transaction[]
}
```

### Transaction
```prisma
model Transaction {
  id        Int
  userId    Int
  type      String
  amount    Float
  status    String  @default("completed")
  createdAt DateTime
}
```

## 🔐 Segurança

- Tokens JWT expiram em 12 horas
- CORS configurado para domínio específico
- Variáveis sensíveis em .env
- Middleware de autenticação em rotas protegidas

## 🐛 Troubleshooting

### Erro: "Prisma Client não encontrado"
```bash
npx prisma generate
```

### Erro: "Tabela não existe"
```bash
npx prisma migrate dev
```

### Porta 3001 já em uso
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

## 📝 License

MIT License

## 👨‍💻 Autor

Seu Nome - [GitHub](https://github.com/SEU_USUARIO)

---

**⭐ Deixe uma estrela se este projeto foi útil!**

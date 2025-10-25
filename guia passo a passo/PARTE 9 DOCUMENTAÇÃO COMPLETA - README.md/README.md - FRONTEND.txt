# 🎮 CS 2 Fortune - Frontend

Site de abertura de caixas e troca de skins de CS2 com sistema de pagamentos integrado.

![CS2 Fortune](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-cyan?style=for-the-badge&logo=tailwindcss)

## 🚀 Funcionalidades

- ✅ Login via Steam (simulado)
- ✅ Sistema de saldo e transações
- ✅ Abertura de caixas com skins
- ✅ Mercado de troca de skins
- ✅ Depósito via PIX e Criptomoedas
- ✅ Retirada de saldo
- ✅ Painel administrativo
- ✅ Sistema 2FA (Google Authenticator)
- ✅ Design responsivo e moderno

## 📋 Requisitos

- Node.js 16+ 
- npm ou yarn
- Backend rodando (veja repositório backend)

## 🔧 Instalação Local

### 1. Clone o repositório

git clone https://github.com/SEU_USUARIO/cs2-fortune-frontend.git
cd cs2-fortune-frontend


### 2. Instale as dependências

npm install

text

### 3. Configure variáveis de ambiente

Crie o arquivo `.env.local`:

NEXT_PUBLIC_API_URL=http://localhost:3001

text

Para produção, use a URL do seu backend:
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app

text

### 4. Execute o projeto

npm run dev

text

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📦 Build para Produção

npm run build
npm start

text

## 🌐 Deploy no Vercel

### Método 1: Via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione este repositório
5. Configure a variável de ambiente:
   - `NEXT_PUBLIC_API_URL` = URL do backend
6. Clique em **"Deploy"**

### Método 2: Via CLI

npm i -g vercel
vercel login
vercel --prod

text

## 📁 Estrutura do Projeto

cs2-fortune-frontend/
├── components/
│ └── Navbar.js # Barra de navegação
├── pages/
│ ├── _app.js # Configuração global
│ ├── index.js # Página inicial
│ ├── login.js # Login Steam
│ ├── saldo.js # Visualizar saldo
│ ├── cases.js # Abrir caixas
│ ├── deposit.js # Depositar
│ ├── withdraw.js # Retirar
│ ├── trade.js # Mercado de skins
│ └── admin.js # Painel admin
├── styles/
│ └── globals.css # Estilos globais + Tailwind
├── public/
│ └── images/ # Imagens e assets
├── .env.local # Variáveis de ambiente
└── package.json

text

## 🎨 Personalização

### Cores (Tailwind)

Edite `tailwind.config.js`:

theme: {
extend: {
colors: {
primary: '#6a0dad', // Roxo neon
secondary: '#00ffff' // Ciano
}
}
}

text

### Logo

Substitua `public/images/logo.png` pela sua logo.

## 🔐 Autenticação

O sistema usa JWT armazenado no `localStorage`:

// Salvar token
localStorage.setItem('token', token);

// Usar em requisições
headers: { Authorization: Bearer ${token} }

text

## 📱 Páginas Disponíveis

| Rota | Descrição | Autenticação |
|------|-----------|--------------|
| `/` | Página inicial | Não |
| `/login` | Login Steam | Não |
| `/saldo` | Ver saldo | ✅ Sim |
| `/cases` | Abrir caixas | Não |
| `/deposit` | Depositar | ✅ Sim |
| `/withdraw` | Retirar | ✅ Sim |
| `/trade` | Mercado | Não |
| `/admin` | Painel admin | ✅ Admin |

## 🐛 Troubleshooting

### Erro: "Network Error"
- Verifique se o backend está rodando
- Confirme a URL em `NEXT_PUBLIC_API_URL`
- Verifique CORS no backend

### Erro: "Token inválido"
- Faça logout e login novamente
- Limpe o localStorage: `localStorage.clear()`

### Página em branco
- Verifique o console do navegador (F12)
- Execute `npm run build` para verificar erros

## 📝 License

MIT License - use livremente!

## 👨‍💻 Autor

Seu Nome - [GitHub](https://github.com/SEU_USUARIO)

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro.

---

**⭐ Se este projeto te ajudou, deixe uma estrela!**
README.md - BACKEND
text
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

git clone https://github.com/SEU_USUARIO/cs2-fortune-backend.git
cd cs2-fortune-backend

text

### 2. Instale as dependências

npm install

text

### 3. Configure o banco de dados

Crie um banco PostgreSQL:

CREATE DATABASE cs2fortune;

text

### 4. Configure variáveis de ambiente

Crie o arquivo `.env`:

Database
DATABASE_URL=postgresql://usuario:senha@localhost:5432/cs2fortune

JWT
SECRET_KEY=sua_chave_secreta_muito_forte_123456789

URLs
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

Mercado Pago (opcional)
MERCADO_PAGO_ACCESS_TOKEN=seu_token

CoinPayments (opcional)
COINPAYMENTS_API_KEY=sua_key
COINPAYMENTS_API_SECRET=seu_secret

Steam Bot (opcional)
STEAM_USERNAME=seu_usuario
STEAM_PASSWORD=sua_senha
STEAM_SHARED_SECRET=seu_shared_secret
STEAM_IDENTITY_SECRET=seu_identity_secret

Server
PORT=3001
NODE_ENV=development

text

### 5. Execute migrations

npx prisma generate
npx prisma migrate dev --name init

text

### 6. Inicie o servidor

npm start

text

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

DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=sua_chave_aqui
FRONTEND_URL=https://seu-frontend.vercel.app
BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production

text

### 5. Configure build

**Build Command:**
npm install && npx prisma generate && npx prisma migrate deploy

text

**Start Command:**
npm start

text

### 6. Gere domínio público

1. Vá em **"Settings"** → **"Networking"**
2. Clique em **"Generate Domain"**
3. Copie a URL gerada

## 📡 Endpoints da API

### Autenticação

#### `POST /api/login/steam`
Login com Steam (simulado)

**Body:**
{
"steamId": "76561198000000001",
"username": "Player1"
}

text

**Response:**
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

text

---

### Usuário

#### `GET /api/saldo`
Obter saldo atual (autenticado)

**Headers:**
Authorization: Bearer {token}

text

**Response:**
{
"saldo": 150.50
}

text

#### `GET /api/profile`
Obter perfil completo

**Response:**
{
"id": 1,
"steamId": "76561198000000001",
"username": "Player1",
"saldo": 150.50,
"transactions": [...]
}

text

---

### Transações

#### `POST /api/transaction`
Criar transação (autenticado)

**Body:**
{
"type": "deposito",
"amount": 50.00
}

text

Tipos: `deposito`, `retirada`, `compra`, `venda`

**Response:**
{
"transaction": {...},
"saldoAtual": 200.50,
"message": "Transação realizada com sucesso"
}

text

#### `GET /api/transactions`
Listar transações do usuário

---

### Pagamentos

#### `POST /api/payment/pix`
Gerar QR Code PIX (autenticado)

**Body:**
{
"amount": 100.00
}

text

**Response:**
{
"qr_code": "00020126580014br.gov.bcb.pix...",
"qr_code_base64": "data:image/png;base64...",
"payment_id": "PIX_1698456789",
"amount": 100.00,
"status": "pending"
}

text

---

### 2FA

#### `POST /api/2fa/setup`
Configurar 2FA (autenticado)

**Response:**
{
"secret": "JBSWY3DPEHPK3PXP",
"qrCode": "data:image/png;base64,iVBORw0K..."
}

text

#### `POST /api/2fa/verify`
Verificar código 2FA

**Body:**
{
"token": "123456"
}

text

---

### Admin

#### `GET /api/admin/users`
Listar todos os usuários (admin)

#### `GET /api/admin/transactions`
Listar todas as transações (admin)

#### `PATCH /api/admin/user/:id/saldo`
Atualizar saldo de usuário (admin)

**Body:**
{
"saldo": 500.00
}

text

---

### Health Check

#### `GET /health`
Verificar status da API

**Response:**
{
"status": "OK",
"timestamp": "2025-10-25T01:00:00.000Z"
}

text

## 📁 Estrutura do Projeto

cs2-fortune-backend/
├── prisma/
│ └── schema.prisma # Schema do banco
├── index.js # Servidor principal
├── steamBot.js # Bot de trade Steam
├── .env # Variáveis de ambiente
├── .gitignore
└── package.json

text

## 🗄️ Schema do Banco

### User
model User {
id Int
steamId String @unique
username String?
saldo Float @default(0)
isAdmin Boolean @default(false)
twoFactorSecret String?
twoFactorEnabled Boolean @default(false)
transactions Transaction[]
}

text

### Transaction
model Transaction {
id Int
userId Int
type String
amount Float
status String @default("completed")
createdAt DateTime
}

text

## 🔐 Segurança

### JWT
Tokens expiram em 12 horas. Renovar via login.

### CORS
Apenas o domínio do frontend pode acessar a API:
cors({
origin: process.env.FRONTEND_URL,
credentials: true
})

text

### Variáveis Sensíveis
Nunca commite `.env` no Git!

## 🐛 Troubleshooting

### Erro: "Prisma Client não encontrado"
npx prisma generate

text

### Erro: "Tabela não existe"
npx prisma migrate dev

text

### Erro de conexão com banco
- Verifique `DATABASE_URL` no `.env`
- Confirme que o PostgreSQL está rodando
- Teste conexão: `npx prisma studio`

### Porta 3001 já está em uso
Linux/Mac
lsof -ti:3001 | xargs kill

Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

text

## 🧪 Testes

### Teste manual com cURL

Login
curl -X POST http://localhost:3001/api/login/steam
-H "Content-Type: application/json"
-d '{"steamId":"76561198000000001","username":"Test"}'

Obter saldo
curl http://localhost:3001/api/saldo
-H "Authorization: Bearer SEU_TOKEN"

text

### Teste com Postman/Insomnia

Importe a collection:
{
"name": "CS2 Fortune API",
"requests": [
{
"name": "Login",
"method": "POST",
"url": "{{baseUrl}}/api/login/steam",
"body": {
"steamId": "76561198000000001",
"username": "Test"
}
}
]
}

text

## 📊 Monitoramento

### Logs do Railway
railway logs

text

### Prisma Studio (visualizar banco)
npx prisma studio

text

## 🔄 Atualizações

### Adicionar nova migration
npx prisma migrate dev --name nome_da_migration

text

### Deploy migration em produção
npx prisma migrate deploy

text

## 📝 License

MIT License

## 👨‍💻 Autor

Seu Nome - [GitHub](https://github.com/SEU_USUARIO)

## 🤝 Contribuindo

Issues e PRs são bem-vindos!

---

**⭐ Deixe uma estrela se este projeto foi útil!**
📄 ARQUIVO EXTRA: GUIA RÁPIDO DE DEPLOY
Vou criar um guia super condensado para você imprimir ou ter aberto durante o deploy.

text
# ⚡ GUIA RÁPIDO - DEPLOY EM 10 MINUTOS

## 1️⃣ GITHUB (5 min)

Frontend
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USER/cs2-fortune-frontend.git
git push -u origin main

Backend
cd ../backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USER/cs2-fortune-backend.git
git push -u origin main

text

## 2️⃣ RAILWAY - Backend (3 min)

1. railway.app → Login GitHub
2. New Project → Deploy from GitHub → `cs2-fortune-backend`
3. New → Database → PostgreSQL
4. Backend → Variables:
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=abc123xyz
FRONTEND_URL=https://seu-site.vercel.app

text
5. Settings → Networking → Generate Domain
6. **Copie a URL**

## 3️⃣ VERCEL - Frontend (2 min)

1. vercel.com → Login GitHub
2. New Project → `cs2-fortune-frontend`
3. Environment Variables:
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app

text
4. Deploy
5. **Copie a URL**

## 4️⃣ ATUALIZAR CORS

1. Volte ao Railway
2. Atualize `FRONTEND_URL` com URL do Vercel
3. Redeploy

## ✅ PRONTO!

Acesse seu site e teste o login!


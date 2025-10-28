# 🚀 GUIA COMPLETO DE DEPLOY - CS2 FORTUNE

## 📋 Visão Geral

Este guia cobre o deploy completo do CS2 Fortune:
- **Backend**: Railway (Node.js + PostgreSQL)
- **Frontend**: Vercel (Next.js)
- **Banco de Dados**: PostgreSQL (Railway ou Render)

---

## 🎯 PARTE 1: PREPARAÇÃO

### 1.1 Checklist Pré-Deploy

- [ ] Código testado localmente (npm test passando)
- [ ] Arquivo `.env.example` criado
- [ ] `.gitignore` configurado (não commitar .env, node_modules, dev.db)
- [ ] Conta GitHub criada
- [ ] Repositório Git inicializado

### 1.2 Criar Repositório Git

```bash
# No diretório do backend
cd "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\Backend completo CS 2 Fortune"

# Inicializar Git
git init
git add .
git commit -m "Initial commit - CS2 Fortune Backend"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/cs2-fortune-backend.git
git branch -M main
git push -u origin main
```

### 1.3 Verificar .gitignore

```
node_modules/
.env
.env.local
.env.production
dev.db
dev.db-journal
prisma/*.db
*.log
.DS_Store
```

---

## 🐘 PARTE 2: DEPLOY DO BANCO DE DADOS (PostgreSQL)

### Opção A: Railway (Recomendado - Simples)

1. **Acesse**: https://railway.app/
2. **Login** com GitHub
3. **New Project** → **Provision PostgreSQL**
4. **Copiar** a `DATABASE_URL`:
   ```
   postgresql://postgres:senha@containers-us-west-123.railway.app:5432/railway
   ```
5. **Salvar** esta URL (você vai usar no backend)

### Opção B: Render (Gratuito até 90 dias)

1. **Acesse**: https://render.com/
2. **New** → **PostgreSQL**
3. **Nome**: `cs2-fortune-db`
4. **Região**: Oregon (US West)
5. **Plano**: Free
6. **Copiar** Internal Database URL

### Opção C: Supabase (Gratuito)

1. **Acesse**: https://supabase.com/
2. **New Project**
3. **Settings** → **Database** → **Connection String**
4. **Modo**: Transaction (recomendado para Prisma)

---

## 🔧 PARTE 3: DEPLOY DO BACKEND (Railway)

### 3.1 Preparar Backend

**Atualizar `package.json`** para incluir scripts de produção:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest --detectOpenHandles",
    "build": "npx prisma generate",
    "postinstall": "npx prisma generate",
    "db:migrate": "npx prisma migrate deploy",
    "db:seed": "npx prisma db seed"
  }
}
```

### 3.2 Deploy no Railway

1. **Acesse**: https://railway.app/
2. **New Project** → **Deploy from GitHub repo**
3. **Selecionar** repositório `cs2-fortune-backend`
4. **Configure Variáveis de Ambiente**:

   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=seu-secret-forte-aqui-min-32-chars
   OPENAI_API_KEY=sk-proj-seu-key
   OPENAI_ORG_ID=org-seu-id
   GPT5_ENABLED=false
   GPT4_ENABLED=true
   CORS_ORIGIN=https://seu-frontend.vercel.app
   STEAM_API_KEY=seu-steam-key
   STEAM_RETURN_URL=https://seu-backend.railway.app/api/login/steam/return
   STEAM_REALM=https://seu-backend.railway.app
   ```

5. **Conectar ao PostgreSQL**:
   - **Variables** → **Add Reference** → Selecionar PostgreSQL
   - Railway vai auto-preencher `DATABASE_URL`

6. **Deploy**:
   - Railway detecta `package.json` e roda `npm install`
   - Depois roda `npm run build` (gera Prisma Client)
   - Depois roda `npm start`

### 3.3 Rodar Migrations

No Railway Dashboard:
1. **Abrir Terminal** (ícone >_)
2. **Executar**:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 3.4 Verificar Deploy

**Testar Health Check**:
```bash
curl https://seu-backend.railway.app/health
# Deve retornar: {"status":"ok","db":"up"}
```

---

## ⚡ PARTE 4: DEPLOY DO FRONTEND (Vercel)

### 4.1 Preparar Frontend

**Atualizar `.env.local`** no frontend:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
NEXT_PUBLIC_STEAM_LOGIN_URL=https://seu-backend.railway.app/api/login/steam
```

**Criar repositório Git**:

```bash
cd "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo"
git init
git add .
git commit -m "Initial commit - CS2 Fortune Frontend"
git remote add origin https://github.com/seu-usuario/cs2-fortune-frontend.git
git push -u origin main
```

### 4.2 Deploy na Vercel

1. **Acesse**: https://vercel.com/
2. **Login** com GitHub
3. **New Project** → **Import** repositório `cs2-fortune-frontend`
4. **Framework Preset**: Next.js (auto-detectado)
5. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
   NEXT_PUBLIC_STEAM_LOGIN_URL=https://seu-backend.railway.app/api/login/steam
   ```
6. **Deploy**

### 4.3 Atualizar CORS no Backend

Volte no Railway e atualize:
```
CORS_ORIGIN=https://seu-projeto.vercel.app
```

---

## 🔐 PARTE 5: VARIÁVEIS DE AMBIENTE CRÍTICAS

### Backend (Railway)

| Variável | Exemplo | Obrigatória |
|----------|---------|-------------|
| DATABASE_URL | postgresql://... | ✅ Sim |
| JWT_SECRET | openssl rand -base64 32 | ✅ Sim |
| OPENAI_API_KEY | sk-proj-... | ✅ Sim |
| CORS_ORIGIN | https://app.vercel.app | ✅ Sim |
| GPT5_ENABLED | false | ❌ Não (padrão: false) |
| STEAM_API_KEY | ABC123... | ✅ Sim (se usar Steam) |
| NODE_ENV | production | ✅ Sim |

### Frontend (Vercel)

| Variável | Exemplo | Obrigatória |
|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | https://backend.railway.app | ✅ Sim |

---

## 🧪 PARTE 6: TESTES PÓS-DEPLOY

### 6.1 Backend Health Check

```bash
curl https://seu-backend.railway.app/health
# Esperado: {"status":"ok","db":"up"}
```

### 6.2 Testar Login Steam

```bash
curl https://seu-backend.railway.app/api/login/steam
# Deve redirecionar para Steam OpenID
```

### 6.3 Testar AI Endpoints

```bash
# Fazer login e obter token
TOKEN="seu-jwt-token-aqui"

# Listar modelos
curl -H "Authorization: Bearer $TOKEN" \
  https://seu-backend.railway.app/api/ai/models

# Verificar quota
curl -H "Authorization: Bearer $TOKEN" \
  https://seu-backend.railway.app/api/ai/quota
```

### 6.4 Testar Frontend

1. Abrir: `https://seu-projeto.vercel.app`
2. Clicar em **Login com Steam**
3. Autenticar
4. Verificar saldo/perfil

---

## 📊 PARTE 7: MONITORAMENTO

### 7.1 Railway Logs

```bash
# No dashboard Railway
Deployments → View Logs
```

### 7.2 Vercel Logs

```bash
# No dashboard Vercel
Deployments → Function Logs
```

### 7.3 PostgreSQL Stats

**Railway**:
- Dashboard → PostgreSQL → Metrics
- Monitorar: Connections, Storage, CPU

**Render**:
- Dashboard → Database → Metrics

---

## 🔧 PARTE 8: TROUBLESHOOTING

### Erro: "P1001: Can't reach database"

**Causa**: DATABASE_URL incorreta ou PostgreSQL offline

**Solução**:
```bash
# Verificar conexão
npx prisma db push --preview-feature
```

### Erro: "JWT_SECRET is not defined"

**Causa**: Variável não configurada no Railway

**Solução**:
1. Railway Dashboard → Variables
2. Adicionar `JWT_SECRET=seu-secret-aqui`
3. Redeploy

### Erro: "CORS policy blocked"

**Causa**: CORS_ORIGIN não inclui domínio do frontend

**Solução**:
```env
# Backend Railway
CORS_ORIGIN=https://seu-projeto.vercel.app
```

### Erro: "Module not found: 'prisma'"

**Causa**: Prisma Client não foi gerado

**Solução**:
```json
// package.json
{
  "scripts": {
    "postinstall": "npx prisma generate"
  }
}
```

---

## 🚀 PARTE 9: OTIMIZAÇÕES DE PRODUÇÃO

### 9.1 Conexões de Banco de Dados

**Configurar Connection Pooling**:

```javascript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Adicionar connection pooling
  directUrl = env("DIRECT_URL")
}
```

**Railway**: Usar `DATABASE_PRIVATE_URL` para pooling

### 9.2 Rate Limiting Global

**Adicionar em `index.js`**:

```javascript
const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Too many requests, please try again later.'
});

app.use('/api/', globalLimiter);
```

### 9.3 Caching (Redis - Opcional)

**Railway**: Adicionar Redis plugin

```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache quota checks
app.use('/api/ai/', async (req, res, next) => {
  const cached = await client.get(`quota:${req.user.id}`);
  if (cached) {
    req.cachedQuota = JSON.parse(cached);
  }
  next();
});
```

---

## 📈 PARTE 10: CUSTOS ESTIMADOS

### Plano Free (Desenvolvimento)

| Serviço | Custo | Limites |
|---------|-------|---------|
| Railway | $0 | $5 crédito/mês, 512MB RAM |
| Vercel | $0 | 100GB bandwidth/mês |
| PostgreSQL (Railway) | $0 | 1GB storage |
| OpenAI GPT-3.5 | ~$5-20 | Depende do uso |

**Total**: ~$5-20/mês

### Plano Produção (Escalado)

| Serviço | Custo | Recursos |
|---------|-------|----------|
| Railway Pro | $20/mês | 8GB RAM, 100GB storage |
| Vercel Pro | $20/mês | 1TB bandwidth |
| PostgreSQL (Dedicated) | $15/mês | 10GB storage |
| OpenAI GPT-4 | $50-500 | 50k-500k tokens/mês |

**Total**: ~$105-555/mês

---

## ✅ CHECKLIST FINAL

### Antes do Deploy
- [ ] Testes locais passando (npm test)
- [ ] .env.example criado
- [ ] .gitignore configurado
- [ ] README.md atualizado
- [ ] Código commitado no Git

### Deploy Backend
- [ ] PostgreSQL provisionado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Health check respondendo

### Deploy Frontend
- [ ] Repositório criado
- [ ] Variáveis configuradas na Vercel
- [ ] Build passando
- [ ] Site acessível

### Pós-Deploy
- [ ] Steam login funcionando
- [ ] AI endpoints respondendo
- [ ] Transações sendo gravadas
- [ ] Logs sendo monitorados
- [ ] CORS configurado corretamente

---

## 🆘 SUPORTE

**Documentação Oficial**:
- Railway: https://docs.railway.app/
- Vercel: https://vercel.com/docs
- Prisma: https://www.prisma.io/docs/

**Problemas Comuns**: Ver seção TROUBLESHOOTING acima

---

**Última atualização**: ${new Date().toLocaleDateString('pt-BR')}
**Versão**: 1.0

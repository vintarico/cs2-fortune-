# 🔧 TROUBLESHOOTING COMPLETO - CS 2 Fortune

Soluções para problemas comuns no deploy e execução do projeto.

---

## 🚨 PROBLEMAS NO FRONTEND

### ❌ Erro: "Network Error"

**Sintomas:**
- Login não funciona
- Saldo não carrega
- Console: `Network Error` ou `ERR_CONNECTION_REFUSED`

**Soluções:**

✅ **1. Verificar se backend está online**
```bash
# Teste no navegador
https://seu-backend.up.railway.app/health

# Deve retornar:
{"status":"OK","timestamp":"..."}
```

✅ **2. Verificar .env.local**
```env
# SEM barra no final!
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
```

✅ **3. Rebuild do frontend**
```bash
rm -rf .next
npm run build
npm run dev
```

✅ **4. Verificar CORS no Railway**
```env
FRONTEND_URL=https://seu-site.vercel.app
```

---

### ❌ Erro: "Token inválido" ou 403

**Sintomas:**
- Logout automático
- Acesso negado
- Console: `403 Forbidden`

**Soluções:**

✅ **1. Limpar localStorage**
```javascript
// Console do navegador (F12)
localStorage.clear()
// Fazer login novamente
```

✅ **2. Verificar SECRET_KEY**
```env
# Railway deve ter a MESMA chave
SECRET_KEY=sua_chave_secreta_123
```

⚠️ Se mudar SECRET_KEY, todos os tokens ficam inválidos!

---

### ❌ Erro: Build falha no Vercel

**Sintomas:**
```
Error: Module not found: Can't resolve 'axios'
```

**Soluções:**

✅ **1. Verificar package.json**
```json
{
  "dependencies": {
    "axios": "^1.4.0",
    "next": "^13.0.0",
    "react": "^18.0.0"
  }
}
```

✅ **2. Limpar cache**
- Settings → Advanced → Clear Cache
- Redeploy

✅ **3. Verificar Node version**
```json
{
  "engines": {
    "node": ">=16.x"
  }
}
```

---

### ❌ Página em branco

**Soluções:**

✅ **1. Verificar console (F12)**
- Procure erros em vermelho
- Anote linha e arquivo

✅ **2. Testar build local**
```bash
npm run build
npm start
```

✅ **3. Verificar importações**
```javascript
// ✅ Correto (case-sensitive)
import Navbar from '../components/Navbar'

// ❌ Errado
import navbar from '../components/navbar'
```

---

## 🚨 PROBLEMAS NO BACKEND

### ❌ Erro: "Prisma Client não inicializado"

**Sintomas:**
```
PrismaClientInitializationError: Prisma Client could not locate binaries
```

**Soluções:**

✅ **1. Gerar cliente**
```bash
npx prisma generate
```

✅ **2. Adicionar ao Build Command (Railway)**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

✅ **3. Reinstalar**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Erro: "Table does not exist"

**Sintomas:**
```
Error: Table 'User' does not exist
```

**Soluções:**

✅ **1. Executar migrations**
```bash
# Local
npx prisma migrate dev

# Railway
railway run npx prisma migrate deploy
```

✅ **2. Reset completo (⚠️ APAGA DADOS)**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

✅ **3. Verificar DATABASE_URL**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
```

---

### ❌ Erro: "Port 3001 already in use"

**Sintomas:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Soluções:**

✅ **Linux/Mac:**
```bash
# Matar processo
lsof -ti:3001 | xargs kill -9

# Ou usar outra porta
PORT=3002 npm start
```

✅ **Windows:**
```cmd
# Encontrar PID
netstat -ano | findstr :3001

# Matar (substitua 12345 pelo PID)
taskkill /PID 12345 /F
```

---

### ❌ Erro: Railway build falha

**Sintomas:**
```
Error: Cannot find module '@prisma/client'
```

**Soluções:**

✅ **1. Build Command correto**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

✅ **2. Start Command correto**
```bash
npm start
```

✅ **3. Verificar package.json**
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

---

### ❌ Erro: Database connection timeout

**Sintomas:**
```
Error: Can't reach database server
```

**Soluções:**

✅ **1. Verificar URL**
```bash
# Railway → PostgreSQL → Variables → DATABASE_URL
# Copiar exatamente
```

✅ **2. Testar conexão**
```bash
npx prisma db pull
```

✅ **3. Reiniciar banco**
- Railway → PostgreSQL → Settings → Restart

---

## 🚨 PROBLEMAS DE CORS

### ❌ Erro: "CORS policy blocked"

**Sintomas:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Soluções:**

✅ **1. Verificar FRONTEND_URL no Railway**
```env
FRONTEND_URL=https://seu-site.vercel.app
```

✅ **2. Código CORS (index.js)**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

✅ **3. Múltiplas origens**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://seu-site.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
```

---

## 🚨 PROBLEMAS DE AUTENTICAÇÃO

### ❌ Admin não acessa painel

**Sintomas:**
```json
{"error":"Acesso negado - Admin apenas"}
```

**Soluções:**

✅ **1. Via Prisma Studio**
```bash
npx prisma studio
# Edite User → isAdmin = true
```

✅ **2. Via SQL direto**
```sql
UPDATE "User" SET "isAdmin" = true WHERE "steamId" = 'SEU_STEAM_ID';
```

✅ **3. Via rota temporária**
```javascript
// Adicionar ao index.js (REMOVER DEPOIS!)
app.post('/api/setup-admin', async (req, res) => {
  const { steamId } = req.body;
  const user = await prisma.user.update({
    where: { steamId },
    data: { isAdmin: true }
  });
  res.json(user);
});
```

Testar:
```bash
curl -X POST https://seu-backend.up.railway.app/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"steamId":"76561198000000001"}'
```

---

## 🚨 PROBLEMAS COM IMAGENS

### ❌ Imagens não carregam

**Sintomas:**
- Ícones quebrados
- 404 em `/images/...`

**Soluções:**

✅ **1. Estrutura correta**
```
frontend/
└── public/
    └── images/
        ├── logo.png
        └── case-skins/
```

✅ **2. Caminho correto**
```jsx
// ✅ Correto
<img src="/images/logo.png" alt="Logo" />

// ❌ Errado
<img src="./images/logo.png" alt="Logo" />
```

✅ **3. Next.js Image**
```jsx
import Image from 'next/image'

<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
/>
```

---

## 🐛 DEBUG AVANÇADO

### Habilitar logs detalhados

**Backend:**
```javascript
// index.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

**Prisma:**
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Testar endpoints manualmente

```bash
# Login
curl -X POST https://seu-backend.up.railway.app/api/login/steam \
  -H "Content-Type: application/json" \
  -d '{"steamId":"76561198000000001","username":"Test"}'

# Salvar token
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Obter saldo
curl https://seu-backend.up.railway.app/api/saldo \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de abrir suporte:

- [ ] Backend responde em `/health`
- [ ] `NEXT_PUBLIC_API_URL` está correta
- [ ] `FRONTEND_URL` no Railway está correta
- [ ] `DATABASE_URL` está conectada
- [ ] Migrations foram executadas
- [ ] Token JWT está no localStorage
- [ ] CORS configurado
- [ ] Console sem erros (F12)
- [ ] Build local funciona

---

## 📞 SUPORTE ADICIONAL

**Ver logs:**
- Railway: `railway logs`
- Vercel: Dashboard → Deployments → View Function Logs

**Testar conexão:**
```bash
# Backend
curl https://seu-backend.up.railway.app/health

# Frontend
curl https://seu-site.vercel.app
```

---

**💡 Dica:** 90% dos problemas são resolvidos com:
1. Rebuild do projeto
2. Limpar cache
3. Verificar variáveis de ambiente

---

**🎯 Ainda com problemas?**

Abra uma issue no GitHub com:
- Descrição detalhada do erro
- Logs completos (backend e frontend)
- Passos para reproduzir
- Print do console (F12)

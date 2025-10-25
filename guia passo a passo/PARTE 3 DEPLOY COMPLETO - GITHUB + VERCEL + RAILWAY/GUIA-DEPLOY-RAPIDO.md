# ⚡ GUIA RÁPIDO DE DEPLOY - 10 MINUTOS

Deploy completo do CS 2 Fortune (Frontend + Backend) em produção.

---

## 📋 PRÉ-REQUISITOS

Antes de começar, crie contas em:

- ✅ [GitHub](https://github.com)
- ✅ [Vercel](https://vercel.com) - Para frontend
- ✅ [Railway](https://railway.app) - Para backend + banco

E tenha instalado:

- ✅ Git
- ✅ Node.js 16+

---

## PASSO 1: SUBIR CÓDIGO PARA GITHUB (3 min)

### Frontend

```bash
cd frontend
git init
git add .
git commit -m "Initial commit - Frontend"
git remote add origin https://github.com/SEU_USUARIO/cs2-fortune-frontend.git
git branch -M main
git push -u origin main
```

### Backend

```bash
cd ../backend
git init
git add .
git commit -m "Initial commit - Backend"
git remote add origin https://github.com/SEU_USUARIO/cs2-fortune-backend.git
git branch -M main
git push -u origin main
```

---

## PASSO 2: DEPLOY BACKEND NO RAILWAY (4 min)

### 2.1 Criar projeto

1. Acesse https://railway.app
2. Login com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecione `cs2-fortune-backend`

### 2.2 Adicionar PostgreSQL

1. No mesmo projeto: **New** → **Database** → **PostgreSQL**
2. Aguarde criação (30 segundos)

### 2.3 Configurar variáveis

1. Clique no serviço **backend** (não no PostgreSQL)
2. Vá em **Variables**
3. Adicione:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=minha_chave_secreta_123abc
FRONTEND_URL=https://SEU-SITE.vercel.app
NODE_ENV=production
```

⚠️ Você vai atualizar `FRONTEND_URL` depois!

### 2.4 Configurar build

1. **Settings** → **Build & Deploy**
2. **Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```
3. **Start Command:**
```bash
npm start
```

### 2.5 Gerar domínio

1. **Settings** → **Networking**
2. **Generate Domain**
3. **COPIE A URL** (ex: `cs2-backend-abc123.up.railway.app`)

---

## PASSO 3: DEPLOY FRONTEND NO VERCEL (3 min)

### 3.1 Importar projeto

1. Acesse https://vercel.com
2. Login com GitHub
3. **Add New...** → **Project**
4. Selecione `cs2-fortune-frontend`

### 3.2 Configurar variável

1. Expanda **Environment Variables**
2. Adicione:

```
Name:  NEXT_PUBLIC_API_URL
Value: https://SEU-BACKEND.up.railway.app
```

⚠️ Cole a URL do Railway que você copiou!

3. **Deploy**

### 3.3 Obter URL

1. Após deploy, **COPIE A URL** (ex: `cs2-fortune.vercel.app`)

---

## PASSO 4: ATUALIZAR CORS (1 min)

### 4.1 Voltar ao Railway

1. Abra o projeto backend no Railway
2. Clique no serviço **backend**
3. **Variables**
4. Edite `FRONTEND_URL` e cole a URL do Vercel
5. Clique em **Redeploy**

---

## ✅ VERIFICAR SE FUNCIONOU

### Teste 1: Backend online

Acesse: `https://seu-backend.up.railway.app/health`

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "2025-10-25T..."
}
```

### Teste 2: Frontend online

Acesse: `https://seu-site.vercel.app`

Deve aparecer a página inicial do CS 2 Fortune.

### Teste 3: Login funcionando

1. Vá em `/login`
2. SteamID: `76561198000000001`
3. Username: `TestUser`
4. Clique em **Entrar com Steam**
5. Deve redirecionar para `/saldo` com **R$ 100,00**

---

## 🚨 PROBLEMAS COMUNS

### "Network Error" no login

✅ **Solução:**
1. Verifique se backend respondeu no teste 1
2. Confirme que `NEXT_PUBLIC_API_URL` no Vercel está correta
3. Confirme que `FRONTEND_URL` no Railway está correta

### Build falhou no Vercel

✅ **Solução:**
1. Vá em **Settings** → **General** → **Build & Development Settings**
2. Framework Preset: **Next.js**
3. Build Command: `npm run build`
4. Redeploy

### Build falhou no Railway

✅ **Solução:**
1. Verifique se PostgreSQL está conectado
2. Build Command deve ter: `npx prisma migrate deploy`
3. Veja logs: **View Logs**

---

## 🎯 PRÓXIMOS PASSOS

### 1. Criar primeiro admin

**Via Prisma Studio:**
```bash
# Local (conecte ao banco Railway)
npx prisma studio
# Edite um usuário e marque isAdmin = true
```

**Via rota temporária:**
```bash
curl -X POST https://seu-backend.up.railway.app/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"steamId":"76561198000000001"}'
```

### 2. Domínio personalizado

**Vercel:**
1. **Settings** → **Domains**
2. Adicione `seudominio.com`
3. Configure DNS conforme instruções

**Railway:**
1. **Settings** → **Networking** → **Custom Domain**
2. Adicione `api.seudominio.com`
3. Configure DNS

### 3. Configurar pagamentos reais

- Mercado Pago: https://mercadopago.com.br/developers
- CoinPayments: https://coinpayments.net

---

## 📞 SUPORTE

Se algo deu errado:

1. Verifique logs do Railway: **View Logs**
2. Verifique logs do Vercel: **Deployments** → **View Function Logs**
3. Veja o arquivo `TROUBLESHOOTING.md` completo

---

## ✅ CHECKLIST FINAL

Antes de considerar pronto:

- [ ] Backend responde em `/health`
- [ ] Frontend carrega página inicial
- [ ] Login funciona e redireciona
- [ ] Saldo aparece (R$ 100,00)
- [ ] Painel admin acessível (após criar admin)
- [ ] Variáveis de ambiente corretas
- [ ] CORS configurado (frontend ↔ backend)

---

**🎉 PARABÉNS! Seu site está online!**

Tempo total: ~10 minutos
Custo: R$ 0,00 (planos gratuitos)

---

**Próximo passo:** Adicione funcionalidades como abertura de caixas, integração Steam real, e pagamentos!

# 🚀 CHECKLIST DE DEPLOY - CS2 FORTUNE

## ✅ STATUS ATUAL

### Backend (Local - Funcionando)
- ✅ Servidor rodando na porta 3001
- ✅ Database SQLite (dev.db) conectado
- ✅ 22 testes Jest passando
- ✅ Todos endpoints funcionais
- ✅ AI routes implementadas
- ✅ CORS configurado

### Frontend (Local - Funcionando)
- ✅ Next.js rodando na porta 3000
- ✅ Componentes AI integrados
- ✅ hooks/useAI.js criado
- ✅ AIAssistant em 3 páginas

---

## 📋 PASSOS PARA DEPLOY EM PRODUÇÃO

### PASSO 1: Preparar Backend para Railway

```bash
# 1.1 Criar repositório Git (se ainda não criou)
cd "c:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\Backend completo CS 2 Fortune"
git init
git add .
git commit -m "Backend CS2 Fortune - Production Ready"

# 1.2 Criar repositório no GitHub
# Ir em: https://github.com/new
# Nome: cs2-fortune-backend

# 1.3 Push para GitHub
git remote add origin https://github.com/vintarico/cs2-fortune-backend.git
git branch -M main
git push -u origin main
```

### PASSO 2: Deploy Database (PostgreSQL no Railway)

1. Acessar: https://railway.app/
2. Login com GitHub
3. **New Project** → **Provision PostgreSQL**
4. Copiar a `DATABASE_URL` (algo como):
   ```
   postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway
   ```
5. Salvar esta URL para usar no próximo passo

### PASSO 3: Deploy Backend no Railway

1. **New Project** → **Deploy from GitHub repo**
2. Selecionar: `cs2-fortune-backend`
3. **Configure Variáveis** (Settings → Variables):

```env
NODE_ENV=production
PORT=3001
DATABASE_PROVIDER=postgresql
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<gerar com: openssl rand -base64 32>
SECRET_KEY=<mesmo valor do JWT_SECRET>
OPENAI_API_KEY=<sua key da OpenAI>
GPT5_ENABLED=false
GPT4_ENABLED=true
CORS_ORIGIN=https://seu-frontend.vercel.app
STEAM_API_KEY=<sua steam API key>
STEAM_RETURN_URL=https://seu-backend.railway.app/api/login/steam/return
STEAM_REALM=https://seu-backend.railway.app
```

4. **Conectar ao PostgreSQL**:
   - Variables → Reference → Selecionar PostgreSQL
   - Isso auto-preenche DATABASE_URL

5. **Rodar Migrations** (via Railway CLI ou Dashboard):
```bash
npx prisma migrate deploy
npx prisma db seed
```

### PASSO 4: Deploy Frontend na Vercel

```bash
# 4.1 Criar repositório Git do Frontend
cd "c:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo"
git init
git add .
git commit -m "Frontend CS2 Fortune - Production Ready"

# 4.2 Push para GitHub
git remote add origin https://github.com/vintarico/cs2-fortune-frontend.git
git branch -M main
git push -u origin main
```

1. Acessar: https://vercel.com/
2. Login com GitHub
3. **New Project** → Import: `cs2-fortune-frontend`
4. **Framework**: Next.js (auto-detectado)
5. **Environment Variables**:
```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```
6. **Deploy**

### PASSO 5: Configuração Final

1. **Atualizar CORS no Backend** (Railway):
   - Ir em Variables
   - Atualizar `CORS_ORIGIN` com URL do Vercel
   - Exemplo: `https://cs2-fortune.vercel.app`

2. **Gerar JWT Secret seguro**:
```bash
# No PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

3. **Obter Steam API Key**:
   - https://steamcommunity.com/dev/apikey

---

## 🧪 VALIDAÇÃO PÓS-DEPLOY

### Testar Backend em Produção

```bash
# Health check
curl https://seu-backend.railway.app/health

# Deve retornar:
# {"status":"ok","db":"up","time":"..."}
```

### Testar Frontend em Produção

1. Abrir: `https://seu-projeto.vercel.app`
2. Clicar em "Login com Steam"
3. Autenticar
4. Verificar se o assistente AI aparece
5. Testar chat AI

---

## 📊 CUSTOS ESTIMADOS

### Desenvolvimento/Teste (FREE TIER)
- Railway: $5 crédito/mês (suficiente para teste)
- Vercel: FREE (100GB bandwidth/mês)
- PostgreSQL (Railway): FREE (1GB storage)
- OpenAI: ~$5-10/mês (uso básico GPT-3.5)
**Total: ~$5-15/mês**

### Produção (Escalado)
- Railway Pro: $20/mês (8GB RAM, 100GB storage)
- Vercel Pro: $20/mês (1TB bandwidth)
- PostgreSQL: $15/mês (10GB storage dedicado)
- OpenAI: $50-200/mês (GPT-4 usage)
**Total: ~$105-255/mês**

---

## 🔒 SEGURANÇA

### Checklist de Segurança

- [ ] JWT_SECRET alterado (não usar 'cotonete12' em prod!)
- [ ] Variáveis sensíveis no .env (não commitadas)
- [ ] HTTPS habilitado (Railway/Vercel fazem automático)
- [ ] CORS restrito ao domínio do frontend
- [ ] Rate limiting ativo (já implementado)
- [ ] Validação de inputs (já implementado)
- [ ] SQL injection protegido (Prisma ORM)

---

## 📝 PRÓXIMOS PASSOS APÓS DEPLOY

1. **Monitoramento**:
   - Railway Dashboard → Metrics
   - Vercel Dashboard → Analytics

2. **Logs**:
   - Railway → View Logs
   - Vercel → Function Logs

3. **Domínio Customizado** (Opcional):
   - Vercel: Settings → Domains → Add
   - Railway: Settings → Domains → Generate/Custom

4. **Email OpenAI GPT-5**:
   - Usar o arquivo: `EMAIL_OPENAI_GPT5_PRONTO.md`
   - Enviar em: https://platform.openai.com/

5. **Backup Database**:
   - Railway → PostgreSQL → Backups (automático)
   - Download manual: `pg_dump` via Railway CLI

---

## 🆘 TROUBLESHOOTING COMUM

### "Porta já em uso" no Railway
**Solução**: Railway usa variável PORT dinâmica, certifique-se:
```javascript
const PORT = process.env.PORT || 3001;
```

### "Cannot connect to database"
**Solução**: Verificar DATABASE_URL e rodar migrations:
```bash
npx prisma migrate deploy
```

### "CORS policy blocked"
**Solução**: Atualizar CORS_ORIGIN com URL exato do Vercel

### Frontend não conecta ao Backend
**Solução**: Verificar NEXT_PUBLIC_API_URL aponta para Railway

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Deploy**: `GUIA_DEPLOY_PRODUCAO.md`
- **Email GPT-5**: `EMAIL_OPENAI_GPT5_PRONTO.md`
- **Componentes AI**: `DOCUMENTACAO_AI_COMPONENTES.md` (frontend)
- **Resumo Geral**: `RESUMO_DEPLOY_E_INTEGRACAO.md`

---

**Data**: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
**Status**: ✅ Pronto para Deploy

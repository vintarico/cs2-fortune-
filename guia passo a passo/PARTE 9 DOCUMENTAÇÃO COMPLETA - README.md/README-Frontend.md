# 🎮 CS 2 Fortune - Frontend

Site de abertura de caixas e troca de skins de CS2 com sistema de pagamentos integrado.

![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
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

```bash
git clone https://github.com/SEU_USUARIO/cs2-fortune-frontend.git
cd cs2-fortune-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure variáveis de ambiente

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para produção, use a URL do seu backend:
```env
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
```

### 4. Execute o projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📦 Build para Produção

```bash
npm run build
npm start
```

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

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 📁 Estrutura do Projeto

```
cs2-fortune-frontend/
├── components/
│   └── Navbar.js              # Barra de navegação
├── pages/
│   ├── _app.js                # Configuração global
│   ├── index.js               # Página inicial
│   ├── login.js               # Login Steam
│   ├── saldo.js               # Visualizar saldo
│   ├── cases.js               # Abrir caixas
│   ├── deposit.js             # Depositar
│   ├── withdraw.js            # Retirar
│   ├── trade.js               # Mercado de skins
│   └── admin.js               # Painel admin
├── styles/
│   └── globals.css            # Estilos globais + Tailwind
├── public/
│   └── images/                # Imagens e assets
├── .env.local                 # Variáveis de ambiente
└── package.json
```

## 🎨 Personalização

### Cores (Tailwind)

Edite `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#6a0dad',    // Roxo neon
      secondary: '#00ffff'   // Ciano
    }
  }
}
```

### Logo

Substitua `public/images/logo.png` pela sua logo.

## 🔐 Autenticação

O sistema usa JWT armazenado no `localStorage`:

```js
// Salvar token
localStorage.setItem('token', token);

// Usar em requisições
headers: { Authorization: `Bearer ${token}` }
```

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

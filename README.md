# CS2 Fortune — Monorepo (Frontend + Backend)

Este repositório contém a estrutura inicial do projeto CS2 Fortune, com frontend em Next.js + Tailwind e backend em Express.

Estrutura criada automaticamente:

- `frontend/` — app Next.js, design-system e componentes (exemplos)
- `backend/` — API Express com rotas stub para auth/2fa
- `docs/` — documentação (ARCHITECTURE, DESIGN_SYSTEM)

Como rodar localmente (PowerShell):

Frontend:
```powershell
cd "c:\Users\Vinta\Desktop\site cs fortune\frontend"
npm install
npm run dev
```

Backend:
```powershell
cd "c:\Users\Vinta\Desktop\site cs fortune\backend"
npm install
npm run start
```

CI: simples workflow em `.github/workflows/ci.yml` que instala e tenta build.

Próximos passos sugeridos:
- Instalar dependências listadas no `package.json` e rodar localmente para validar
- Completar integração do Tailwind (instalar `tailwindcss`, `postcss`, `autoprefixer`) e configurar `postcss` build
- Implementar autenticação real (hash de senha, JWT, 2FA TOTP com `speakeasy`), e integração com bot do Steam

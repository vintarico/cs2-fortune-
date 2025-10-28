# Arquitetura do Projeto — CS2 Fortune

Este documento descreve a visão de alto nível da arquitetura do projeto, responsabilidades dos módulos e integrações principais.

## Visão geral

- Frontend: Next.js + Tailwind CSS, Design System, componentes atômicos → páginas. Responsável pela UI/UX e integração com APIs.
- Backend: Node.js (Express ou Fastify) + Prisma para DB. Serviços: Auth (JWT + 2FA), Users, Trades/Cases, Payments, Steam Bot Adapter, Admin.
- Infra: Vercel/Netlify para frontend, Railway/Render ou Docker para backend. Observability: Sentry + logs estruturados.

## Módulos principais

- frontend/
  - pages/: telas públicas e autenticadas
  - components/: atoms/molecules/organisms
  - design-system/: tokens, utilitários
  - lib/: wrapper API, validações

- backend/
  - src/routes, controllers, services, db (Prisma), middlewares
  - steam adapter: fila para envio/recepção de ofertas
  - jobs/workers: tarefas assíncronas

## Modelos críticos (resumo)

- User (id, email, passwordHash, balance, twoFA, steamId, isAdmin)
- Case (id, name, price, items[])
- CaseItem (id, name, rarity, image, value)
- TradeOffer (id, userId, steamOfferId, itemsSent, itemsReceived, status)
- Deposit/Withdrawal (id, userId, amount, method, status, txReference)

## Endpoints principais (exemplos)

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/2fa/setup
- POST /api/auth/2fa/verify
- GET /api/cases
- POST /api/cases/:id/open
- POST /api/payments/deposit
- POST /api/steam/webhook

## Segurança e Resiliência

- Rate limiting, input sanitization, CSRF, CORS
- Transações e locks para operações de saldo
- Monitoramento do Steam API e modo manutenção quando indisponível

## Observabilidade

- Logs estruturados (JSON)
- Erros enviados para Sentry
- Métricas básicas: latência, taxa de erro, fila de trades

---

Arquivo criado automaticamente: `docs/ARCHITECTURE.md`.

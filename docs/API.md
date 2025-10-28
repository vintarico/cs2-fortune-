# API — CS2 Fortune (resumo)

Este documento descreve os endpoints principais, formatos de request/response e contratos mínimos para implementação.

Base URL: /api

## Auth

- POST /api/auth/login
  - body: { email, password }
  - response: { message, next?: '2fa' }

- POST /api/auth/register
  - body: { email, username, password }
  - response: { message, userId }

- POST /api/auth/2fa/setup
  - body: { } (autenticado)
  - response: { secret, qr }

- POST /api/auth/2fa/verify
  - body: { code }
  - response: { success: boolean, message }

## Users

- GET /api/users/me
  - auth: Bearer token
  - response: { id, email, username, balance, twoFAEnabled }

- PATCH /api/users/me
  - body: partial user fields

## Cases

- GET /api/cases
  - response: [{ id, name, price, itemCount }]

- GET /api/cases/:id
  - response: { id, name, price, items: [{ id, name, rarity, value }] }

- POST /api/cases/:id/open
  - body: { paymentMethod? }
  - response: { tradeOfferId, result: { itemId, itemName, rarity, value } }

## Trades

- GET /api/trades/:id/status
  - response: { status }

- POST /api/steam/webhook
  - body: Steam bot notifications (signature validation required)

## Payments

- POST /api/payments/deposit
  - body: { userId, amount, method }
  - response: { depositId, status }

- POST /api/payments/withdraw
  - body: { userId, amount, method }
  - response: { withdrawalId, status }

## Admin

- GET /api/admin/users
  - auth: admin
  - response: [{ id, email, username, balance, isAdmin }]

---

Observações:
- Usar HTTP status codes adequados: 200/201/400/401/403/422/500
- Padrão de erro: { code, message, details? }

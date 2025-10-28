# Design System — CS2 Fortune (resumo)

Este documento reúne tokens, padrões de componentes e diretrizes de UI/UX com foco em uma aparência premium.

## Tokens principais

- Cores (exemplo):
  - --color-primary: #0066FF
  - --color-surface: #0F1724
  - --color-dark: #0B1220
  - --color-muted: #9AA4B2
  - --color-success: #2DD4BF
  - --color-danger: #FF6B6B

- Espaçamento: 4,8,12,16,24,32
- Border radius: 6px (sm), 12px (md), 9999px (pill)
- Elevation: usar sombras suaves para cards (ex.: 0 6px 18px rgba(2,6,23,0.6))

## Tipografia

- Headline: Poppins/Inter (700)
- Body: Inter (400)
- Escala: 14 / 16 / 18 / 20 / 24 / 32

## Componentes (regras)

- Button: estados (default, hover, active, focus, disabled). Padding consistente, ícone opcional à esquerda.
- Input: label acima, helper text, error text, estado de sucesso.
- Card: imagem 16:9, título, subtítulo, CTA claro.
- Modal: central, backdrop blur, foco retido, ESC para fechar.

## Animações e microinterações

- Use framer-motion para entradas e saídas sutis (scale 1.02, translateY -6px) e prefer-reduced-motion.
- Skeletons para carregamento de listas e cards.

## Acessibilidade

- Contraste >= 4.5:1 para texto principal.
- Todos os controles têm focus-visible e labels.

## Tailwind snippets (conceitual)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}
```

---

Arquivo criado automaticamente: `docs/DESIGN_SYSTEM.md`.

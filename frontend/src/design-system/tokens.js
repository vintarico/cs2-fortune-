// Design tokens JS (exported for JS/TS use)
export const colors = {
  primary: '#0066FF',
  surface: '#0F1724',
  dark: '#0B1220',
  muted: '#9AA4B2',
  success: '#2DD4BF',
  danger: '#FF6B6B'
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }

// Helper to generate CSS variables (optional runtime)
export function toCssVars() {
  return Object.entries(colors).reduce((acc, [k, v]) => {
    acc[`--color-${k}`] = v
    return acc
  }, {})
}

// Mapeamento de ícones para cada caixa baseado no tema
export const CASE_ICONS = {
  // Original Collection
  'fracture': '💎',
  'kilowatt': '⚡',
  'recoil': '🎯',
  'revolution': '🔥',
  'danger-zone': '☠️',
  'dreams-nightmares': '👻',
  'phoenix': '🦅',
  'broken-fang': '🐺',
  'breakout': '💥',
  'riptide': '🌊',
  'huntsman': '🏹',
  'spectrum': '🌈',
  'hydra': '🐉',
  'bravo': '⭐',
  'weapon': '🔫',
  
  // New Cases
  'starter-bronze': '🥉',
  'starter-silver': '🥈',
  'ak47-empress': '👑',
  'm4a4-howl': '🐺',
  'awp-dragon-lore': '🐲',
  'neon-rider': '🏍️',
  'gungnir': '⚔️',
  'prince': '🤴',
  'wild-lotus': '🌸',
  'printstream': '🎨',
  'fire-ice': '🔥❄️',
  'blue-gem': '💠',
  'souvenir-dlore': '🏆'
};

export function getCaseIcon(caseId) {
  return CASE_ICONS[caseId] || '🎁';
}

export function getCaseGradient(color) {
  return `linear-gradient(135deg, ${color}40, ${color}80, ${color}40)`;
}

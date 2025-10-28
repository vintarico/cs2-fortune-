// ═══════════════════════════════════════════════════════════════
// 🎁 SISTEMA COMPLETO DE CAIXAS CS2 FORTUNE - REBALANCEADO
// Valores de R$ 1,00 até R$ 1.500,00
// Multiplicadores ajustados: COMMON(0.25), UNCOMMON(1.5), RARE(5), EPIC(25), LEGENDARY(100)
// ═══════════════════════════════════════════════════════════════

const RARITIES = {
  COMMON: {
    name: 'Comum',
    color: '#B0C3D9',
    chance: 79.92,
    multiplier: 0.25
  },
  UNCOMMON: {
    name: 'Incomum',
    color: '#5E98D9',
    chance: 15.98,
    multiplier: 1.5
  },
  RARE: {
    name: 'Raro',
    color: '#8847FF',
    chance: 3.2,
    multiplier: 5
  },
  EPIC: {
    name: 'Épico',
    color: '#D32CE6',
    chance: 0.64,
    multiplier: 25
  },
  LEGENDARY: {
    name: 'Lendário',
    color: '#EB4B4B',
    chance: 0.26,
    multiplier: 100
  }
};

export const ORIGINAL_CASES = [
  // ═══════════════════════════════════════════════════════════════
  // CAIXA 1 - R$ 1,00 (Iniciante)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'fracture',
    name: 'Fracture Case',
    price: 1.00,
    image: '/images/cases/fracture.webp',
    color: '#4A90E2',
    description: 'Caixa iniciante - Perfeita para começar',
    items: [
      // COMUM (*0.25) = R$ 0.10-0.25
      { name: 'Glock-18 | Water Elemental', rarity: 'COMMON', value: 0.15, image: '/skins/glock-water.png' },
      { name: 'P90 | Emerald Dragon', rarity: 'COMMON', value: 0.18, image: '/skins/p90-emerald.png' },
      { name: 'M249 | Nebula Crusader', rarity: 'COMMON', value: 0.12, image: '/skins/m249-nebula.png' },
      { name: 'P2000 | Fire Elemental', rarity: 'COMMON', value: 0.20, image: '/skins/p2000-fire.png' },
      { name: 'USP-S | Orion', rarity: 'COMMON', value: 0.22, image: '/skins/usp-orion.png' },
      { name: 'MAC-10 | Neon Rider', rarity: 'COMMON', value: 0.16, image: '/skins/mac10-neon.png' },
      { name: 'Desert Eagle | Kumicho Dragon', rarity: 'COMMON', value: 0.19, image: '/skins/deagle-kumicho.png' },
      { name: 'SCAR-20 | Bloodsport', rarity: 'COMMON', value: 0.14, image: '/skins/scar-blood.png' },
      { name: 'Five-SeveN | Monkey Business', rarity: 'COMMON', value: 0.13, image: '/skins/five-monkey.png' },
      { name: 'MAC-10 | Fade', rarity: 'COMMON', value: 0.17, image: '/skins/mac10-fade.png' },
      { name: 'MP9 | Pandoras Box', rarity: 'COMMON', value: 0.15, image: '/skins/mp9-pandora.png' },
      { name: 'Galil AR | Eco', rarity: 'COMMON', value: 0.14, image: '/skins/galil-eco.png' },
      
      // INCOMUM (*1.5) = R$ 1.00-1.50
      { name: 'AK-47 | Redline', rarity: 'UNCOMMON', value: 1.20, image: '/skins/ak47-redline.png' },
      { name: 'M4A4 | Asiimov', rarity: 'UNCOMMON', value: 1.35, image: '/skins/m4a4-asiimov.png' },
      { name: 'M4A1-S | Golden Coil', rarity: 'UNCOMMON', value: 1.25, image: '/skins/m4a1s-golden.png' },
      { name: 'Glock-18 | Fade', rarity: 'UNCOMMON', value: 1.10, image: '/skins/glock-fade.png' },
      
      // RARO (*5) = R$ 4-5
      { name: 'M4A1-S | Printstream', rarity: 'RARE', value: 4.50, image: '/skins/m4a1s-print.png' },
      { name: 'AWP | Asiimov', rarity: 'RARE', value: 5.00, image: '/skins/awp-asiimov.png' },
      
      // ÉPICO (*25) = R$ 22-25
      { name: 'M4A4 | Howl', rarity: 'EPIC', value: 24.00, image: '/skins/m4a4-howl.png' },
      
      // LENDÁRIO (*100) = R$ 95-100
      { name: 'Karambit | Fade', rarity: 'LEGENDARY', value: 98.00, image: '/knives/karambit-fade.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 2 - R$ 5,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'kilowatt',
    name: 'Kilowatt Case',
    price: 5.00,
    image: '/images/cases/kilowatt.webp',
    color: '#00D4FF',
    description: 'Energia elétrica em forma de skins',
    items: [
      // COMUM (*0.25)
      { name: 'MP7 | Nemesis', rarity: 'COMMON', value: 0.80, image: '/skins/mp7-nemesis.png' },
      { name: 'P90 | Emerald Dragon', rarity: 'COMMON', value: 0.95, image: '/skins/p90-emerald.png' },
      { name: 'M249 | Nebula Crusader', rarity: 'COMMON', value: 0.85, image: '/skins/m249-nebula.png' },
      { name: 'SCAR-20 | Cardiac', rarity: 'COMMON', value: 1.00, image: '/skins/scar-cardiac.png' },
      { name: 'P2000 | Ocean Foam', rarity: 'COMMON', value: 1.10, image: '/skins/p2000-ocean.png' },
      { name: 'Tec-9 | Fuel Injector', rarity: 'COMMON', value: 1.00, image: '/skins/tec9-fuel.png' },
      { name: 'Nova | Hyper Beast', rarity: 'COMMON', value: 0.90, image: '/skins/nova-hyper.png' },
      { name: 'XM1014 | Seasons', rarity: 'COMMON', value: 0.75, image: '/skins/xm-seasons.png' },
      { name: 'CZ75-Auto | Yellow Jacket', rarity: 'COMMON', value: 1.05, image: '/skins/cz-yellow.png' },
      { name: 'MP7 | Fade', rarity: 'COMMON', value: 0.98, image: '/skins/mp7-fade.png' },
      { name: 'UMP-45 | Primal Saber', rarity: 'COMMON', value: 0.88, image: '/skins/ump-primal.png' },
      { name: 'PP-Bizon | Judgement', rarity: 'COMMON', value: 0.92, image: '/skins/bizon-judge.png' },
      
      // INCOMUM (*1.5)
      { name: 'Glock-18 | Twilight Galaxy', rarity: 'UNCOMMON', value: 6.50, image: '/skins/glock-twilight.png' },
      { name: 'AK-47 | Inheritance', rarity: 'UNCOMMON', value: 7.20, image: '/skins/ak47-inherit.png' },
      { name: 'USP-S | Kill Confirmed', rarity: 'UNCOMMON', value: 6.80, image: '/skins/usp-kill.png' },
      { name: 'Desert Eagle | Conspiracy', rarity: 'UNCOMMON', value: 7.50, image: '/skins/deagle-conspiracy.png' },
      
      // RARO (*5)
      { name: 'M4A1-S | Printstream', rarity: 'RARE', value: 22.00, image: '/skins/m4a1s-print.png' },
      { name: 'AWP | Hyper Beast', rarity: 'RARE', value: 25.00, image: '/skins/awp-hyper.png' },
      
      // ÉPICO (*25)
      { name: 'AK-47 | Neon Rider', rarity: 'EPIC', value: 120.00, image: '/skins/ak47-neon.png' },
      
      // LENDÁRIO (*100)
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 490.00, image: '/knives/karambit-doppler.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 3 - R$ 10,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'recoil',
    name: 'Recoil Case',
    price: 10.00,
    image: '/images/cases/recoil.webp',
    color: '#FF6B35',
    description: 'Controle o recoil, domine o jogo',
    items: [
      // COMUM (*0.25)
      { name: 'P250 | Re.built', rarity: 'COMMON', value: 1.50, image: '/skins/p250-rebuilt.png' },
      { name: 'M249 | Downtown', rarity: 'COMMON', value: 1.40, image: '/skins/m249-down.png' },
      { name: 'SG 553 | Dragon Tech', rarity: 'COMMON', value: 1.70, image: '/skins/sg-dragon.png' },
      { name: 'R8 Revolver | Crazy 8', rarity: 'COMMON', value: 1.55, image: '/skins/r8-crazy.png' },
      { name: 'Galil AR | Adventurer', rarity: 'COMMON', value: 1.65, image: '/skins/galil-adv.png' },
      { name: 'Negev | Drop Me', rarity: 'COMMON', value: 1.45, image: '/skins/negev-drop.png' },
      { name: 'P90 | Vent Rush', rarity: 'COMMON', value: 1.60, image: '/skins/p90-vent.png' },
      { name: 'Famas | Pulse', rarity: 'COMMON', value: 1.58, image: '/skins/famas-pulse.png' },
      { name: 'MP9 | Starlight Protector', rarity: 'COMMON', value: 1.42, image: '/skins/mp9-star.png' },
      { name: 'SSG 08 | Death Strike', rarity: 'COMMON', value: 1.52, image: '/skins/ssg-death.png' },
      { name: 'MAC-10 | Pipe Down', rarity: 'COMMON', value: 1.48, image: '/skins/mac10-pipe2.png' },
      { name: 'Sawed-Off | Analog Input', rarity: 'COMMON', value: 1.50, image: '/skins/sawed-analog.png' },
      
      // INCOMUM (*1.5)
      { name: 'AK-47 | Ice Coaled', rarity: 'UNCOMMON', value: 13.00, image: '/skins/ak47-ice.png' },
      { name: 'M4A4 | Poly Mag', rarity: 'UNCOMMON', value: 12.00, image: '/skins/m4a4-poly.png' },
      { name: 'USP-S | Printstream', rarity: 'UNCOMMON', value: 14.00, image: '/skins/usp-print.png' },
      { name: 'M4A1-S | Hyper Beast', rarity: 'UNCOMMON', value: 13.50, image: '/skins/m4a1s-hyper.png' },
      
      // RARO (*5)
      { name: 'AWP | Chromatic Aberration', rarity: 'RARE', value: 48.00, image: '/skins/awp-chroma.png' },
      { name: 'Desert Eagle | Ocean Drive', rarity: 'RARE', value: 45.00, image: '/skins/deagle-ocean.png' },
      
      // ÉPICO (*25)
      { name: 'AK-47 | Leet Museo', rarity: 'EPIC', value: 240.00, image: '/skins/ak47-leet.png' },
      
      // LENDÁRIO (*100)
      { name: 'Butterfly Knife | Tiger Tooth', rarity: 'LEGENDARY', value: 980.00, image: '/knives/butterfly-tiger.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 4 - R$ 25,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'revolution',
    name: 'Revolution Case',
    price: 25.00,
    image: '/images/cases/revolution.webp',
    color: '#DC143C',
    description: 'A revolução das skins chegou',
    items: [
      // COMUM (*0.25)
      { name: 'Glock-18 | Umbral Rabbit', rarity: 'COMMON', value: 3.50, image: '/skins/glock-umbral.png' },
      { name: 'MAC-10 | Sakkaku', rarity: 'COMMON', value: 3.30, image: '/skins/mac10-sakk.png' },
      { name: 'P90 | Neoqueen', rarity: 'COMMON', value: 3.60, image: '/skins/p90-neo.png' },
      { name: 'Tec-9 | Rebel', rarity: 'COMMON', value: 3.40, image: '/skins/tec9-rebel.png' },
      { name: 'SCAR-20 | Fragments', rarity: 'COMMON', value: 3.20, image: '/skins/scar-frag.png' },
      { name: 'P2000 | Wicked Sick', rarity: 'COMMON', value: 3.45, image: '/skins/p2000-sick.png' },
      { name: 'UMP-45 | Wild Child', rarity: 'COMMON', value: 3.35, image: '/skins/ump-wild.png' },
      { name: 'Nova | Red Quartz', rarity: 'COMMON', value: 3.25, image: '/skins/nova-quartz.png' },
      { name: 'Negev | Ultralight', rarity: 'COMMON', value: 3.15, image: '/skins/negev-ultra.png' },
      { name: 'MP9 | Mount Fuji', rarity: 'COMMON', value: 3.05, image: '/skins/mp9-fuji.png' },
      { name: 'Five-SeveN | Berserker', rarity: 'COMMON', value: 2.95, image: '/skins/five-berserker.png' },
      { name: 'Dual Berettas | Dezastre', rarity: 'COMMON', value: 3.10, image: '/skins/duals-dez.png' },
      
      // INCOMUM (*1.5)
      { name: 'M4A4 | Temukau', rarity: 'UNCOMMON', value: 32.00, image: '/skins/m4a4-temu.png' },
      { name: 'R8 Revolver | Banana Cannon', rarity: 'UNCOMMON', value: 30.00, image: '/skins/r8-banana.png' },
      { name: 'XM1014 | XOXO', rarity: 'UNCOMMON', value: 34.00, image: '/skins/xm-xoxo.png' },
      { name: 'AWP | Doodle Lore', rarity: 'UNCOMMON', value: 36.00, image: '/skins/awp-doodle.png' },
      
      // RARO (*5)
      { name: 'AK-47 | Head Shot', rarity: 'RARE', value: 115.00, image: '/skins/ak47-head.png' },
      { name: 'P250 | Visions', rarity: 'RARE', value: 110.00, image: '/skins/p250-vis.png' },
      
      // ÉPICO (*25)
      { name: 'AWP | Duality', rarity: 'EPIC', value: 600.00, image: '/skins/awp-dual.png' },
      
      // LENDÁRIO (*100)
      { name: 'Karambit | Crimson Web', rarity: 'LEGENDARY', value: 1200.00, image: '/knives/karambit-crimson.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 5 - R$ 50,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'danger-zone',
    name: 'Danger Zone Case',
    price: 50.00,
    image: '/images/cases/danger-zone.webp',
    color: '#FF0000',
    description: 'Entre na zona de perigo',
    items: [
      // COMUM (*0.25)
      { name: 'Tec-9 | Fubar', rarity: 'COMMON', value: 6.50, image: '/skins/tec9-fubar.png' },
      { name: 'USP-S | Flashback', rarity: 'COMMON', value: 7.00, image: '/skins/usp-flash.png' },
      { name: 'MP5-SD | Acid Wash', rarity: 'COMMON', value: 6.80, image: '/skins/mp5-acid.png' },
      { name: 'Negev | Lionfish', rarity: 'COMMON', value: 7.20, image: '/skins/negev-lion.png' },
      { name: 'Glock-18 | Oxide Blaze', rarity: 'COMMON', value: 7.50, image: '/skins/glock-oxide.png' },
      { name: 'Sawed-Off | Black Sand', rarity: 'COMMON', value: 6.40, image: '/skins/sawed-black.png' },
      { name: 'MAG-7 | SWAG-7', rarity: 'COMMON', value: 6.90, image: '/skins/mag7-swag.png' },
      { name: 'PP-Bizon | High Roller', rarity: 'COMMON', value: 6.60, image: '/skins/bizon-roller.png' },
      { name: 'XM1014 | Oxide Blaze', rarity: 'COMMON', value: 6.70, image: '/skins/xm-oxide.png' },
      { name: 'G3SG1 | Hunter', rarity: 'COMMON', value: 7.10, image: '/skins/g3-hunter.png' },
      { name: 'Nova | Gila', rarity: 'COMMON', value: 6.30, image: '/skins/nova-gila.png' },
      { name: 'Dual Berettas | Shred', rarity: 'COMMON', value: 7.40, image: '/skins/duals-shred.png' },
      
      // INCOMUM (*1.5)
      { name: 'AK-47 | Asiimov', rarity: 'UNCOMMON', value: 68.00, image: '/skins/ak47-asi.png' },
      { name: 'Nova | Wild Six', rarity: 'UNCOMMON', value: 64.00, image: '/skins/nova-wild.png' },
      { name: 'MP7 | Mischief', rarity: 'UNCOMMON', value: 70.00, image: '/skins/mp7-mis.png' },
      { name: 'M4A4 | Magnesium', rarity: 'UNCOMMON', value: 72.00, image: '/skins/m4a4-mag.png' },
      
      // RARO (*5)
      { name: 'Desert Eagle | Mecha Industries', rarity: 'RARE', value: 230.00, image: '/skins/deagle-mecha.png' },
      { name: 'AWP | Neo-Noir', rarity: 'RARE', value: 250.00, image: '/skins/awp-neo.png' },
      
      // ÉPICO (*25)
      { name: 'M4A4 | Buzz Kill', rarity: 'EPIC', value: 1200.00, image: '/skins/m4a4-buzz.png' },
      
      // LENDÁRIO (*100)
      { name: 'Karambit | Ultraviolet', rarity: 'LEGENDARY', value: 1500.00, image: '/knives/karambit-ultra.png' }
    ]
  },

  // Continua com mais 10 caixas...
  // Total: 15 caixas de R$ 1 até R$ 1.500
];

export { RARITIES };

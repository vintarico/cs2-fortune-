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

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 6 - R$ 75,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'dreams-nightmares',
    name: 'Dreams & Nightmares Case',
    price: 75.00,
    image: '/images/cases/dreams.webp',
    color: '#9B59B6',
    description: 'Sonhos e pesadelos em forma de arte',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'MAC-10 | Ensnared', rarity: 'COMMON', value: 10.50, image: '/skins/mac10-ens.png' },
      { name: 'Dual Berettas | Melondrama', rarity: 'COMMON', value: 11.20, image: '/skins/duals-melon.png' },
      { name: 'P90 | Vent Rush', rarity: 'COMMON', value: 12.00, image: '/skins/p90-vent.png' },
      { name: 'XM1014 | Zombie Offensive', rarity: 'COMMON', value: 10.80, image: '/skins/xm-zombie.png' },
      { name: 'MP9 | Starlight Protector', rarity: 'COMMON', value: 13.50, image: '/skins/mp9-star.png' },
      { name: 'MP5-SD | Necro Jr.', rarity: 'COMMON', value: 11.80, image: '/skins/mp5-necro.png' },
      { name: 'UMP-45 | Wild Child', rarity: 'COMMON', value: 12.50, image: '/skins/ump-wild.png' },
      { name: 'SCAR-20 | Poultrygeist', rarity: 'COMMON', value: 10.90, image: '/skins/scar-poult.png' },
      { name: 'Galil AR | Destroyer', rarity: 'COMMON', value: 11.50, image: '/skins/galil-dest.png' },
      { name: 'M249 | Deep Relief', rarity: 'COMMON', value: 13.00, image: '/skins/m249-deep.png' },
      { name: 'PP-Bizon | Lumen', rarity: 'COMMON', value: 12.30, image: '/skins/bizon-lumen.png' },
      { name: 'Nova | Red Quartz', rarity: 'COMMON', value: 11.00, image: '/skins/nova-quartz.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'G3SG1 | Dream Glade', rarity: 'UNCOMMON', value: 95.00, image: '/skins/g3-dream.png' },
      { name: 'USP-S | Ticket to Hell', rarity: 'UNCOMMON', value: 105.00, image: '/skins/usp-ticket.png' },
      { name: 'FAMAS | Rapid Eye Movement', rarity: 'UNCOMMON', value: 100.00, image: '/skins/famas-rem.png' },
      { name: 'Five-SeveN | Scrawl', rarity: 'UNCOMMON', value: 112.00, image: '/skins/five-scrawl.png' },
      
      // RARO (*5) - 2 itens
      { name: 'M4A1-S | Night Terror', rarity: 'RARE', value: 360.00, image: '/skins/m4a1-night.png' },
      { name: 'AK-47 | Nightwish', rarity: 'RARE', value: 375.00, image: '/skins/ak47-night.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'AWP | Duality', rarity: 'EPIC', value: 1800.00, image: '/skins/awp-duality.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Butterfly Knife | Fade', rarity: 'LEGENDARY', value: 2250.00, image: '/knives/butterfly-fade.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 7 - R$ 100,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'phoenix',
    name: 'Phoenix Case',
    price: 100.00,
    image: '/images/cases/phoenix.webp',
    color: '#E74C3C',
    description: 'Renasça das cinzas',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'MAG-7 | Heaven Guard', rarity: 'COMMON', value: 14.00, image: '/skins/mag7-heaven.png' },
      { name: 'Negev | Terrain', rarity: 'COMMON', value: 15.50, image: '/skins/negev-terrain.png' },
      { name: 'P250 | Hive', rarity: 'COMMON', value: 16.20, image: '/skins/p250-hive.png' },
      { name: 'SCAR-20 | Cyrex', rarity: 'COMMON', value: 14.80, image: '/skins/scar-cyrex.png' },
      { name: 'Tec-9 | Sandstorm', rarity: 'COMMON', value: 17.00, image: '/skins/tec9-sand.png' },
      { name: 'UMP-45 | Corporal', rarity: 'COMMON', value: 15.00, image: '/skins/ump-corporal.png' },
      { name: 'Nova | Koi', rarity: 'COMMON', value: 16.50, image: '/skins/nova-koi.png' },
      { name: 'MP7 | Ocean Foam', rarity: 'COMMON', value: 14.50, image: '/skins/mp7-ocean.png' },
      { name: 'P90 | Trigon', rarity: 'COMMON', value: 18.00, image: '/skins/p90-trigon.png' },
      { name: 'XM1014 | Heaven Guard', rarity: 'COMMON', value: 15.80, image: '/skins/xm-heaven.png' },
      { name: 'Galil AR | Chatter', rarity: 'COMMON', value: 16.80, image: '/skins/galil-chatter.png' },
      { name: 'M249 | System Lock', rarity: 'COMMON', value: 17.50, image: '/skins/m249-system.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'MAC-10 | Heat', rarity: 'UNCOMMON', value: 130.00, image: '/skins/mac10-heat.png' },
      { name: 'AUG | Torque', rarity: 'UNCOMMON', value: 140.00, image: '/skins/aug-torque.png' },
      { name: 'SG 553 | Pulse', rarity: 'UNCOMMON', value: 135.00, image: '/skins/sg-pulse.png' },
      { name: 'USP-S | Guardian', rarity: 'UNCOMMON', value: 150.00, image: '/skins/usp-guardian.png' },
      
      // RARO (*5) - 2 itens
      { name: 'AWP | Redline', rarity: 'RARE', value: 480.00, image: '/skins/awp-redline.png' },
      { name: 'AK-47 | Redline', rarity: 'RARE', value: 500.00, image: '/skins/ak47-redline.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'Desert Eagle | Cobalt Disruption', rarity: 'EPIC', value: 2400.00, image: '/skins/deagle-cobalt.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'M9 Bayonet | Crimson Web', rarity: 'LEGENDARY', value: 3000.00, image: '/knives/m9-crimson.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 8 - R$ 150,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'broken-fang',
    name: 'Broken Fang Case',
    price: 150.00,
    image: '/images/cases/broken-fang.webp',
    color: '#27AE60',
    description: 'Operação Presa Quebrada',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'M249 | Deep Relief', rarity: 'COMMON', value: 22.00, image: '/skins/m249-deep.png' },
      { name: 'XM1014 | XOXO', rarity: 'COMMON', value: 24.50, image: '/skins/xm-xoxo.png' },
      { name: 'MP9 | Food Chain', rarity: 'COMMON', value: 25.80, image: '/skins/mp9-food.png' },
      { name: 'P90 | Cocoa Rampage', rarity: 'COMMON', value: 23.20, image: '/skins/p90-cocoa.png' },
      { name: 'UMP-45 | Gold Bismuth', rarity: 'COMMON', value: 26.00, image: '/skins/ump-gold.png' },
      { name: 'Nova | Clear Polymer', rarity: 'COMMON', value: 22.50, image: '/skins/nova-polymer.png' },
      { name: 'Galil AR | Vandal', rarity: 'COMMON', value: 27.50, image: '/skins/galil-vandal.png' },
      { name: 'MAC-10 | Stalker', rarity: 'COMMON', value: 24.00, image: '/skins/mac10-stalker.png' },
      { name: 'P2000 | Obsidian', rarity: 'COMMON', value: 28.00, image: '/skins/p2000-obsidian.png' },
      { name: 'R8 Revolver | Junk Yard', rarity: 'COMMON', value: 23.80, image: '/skins/r8-junk.png' },
      { name: 'Dual Berettas | Dezastre', rarity: 'COMMON', value: 25.50, image: '/skins/duals-dez.png' },
      { name: 'PP-Bizon | Antique', rarity: 'COMMON', value: 26.50, image: '/skins/bizon-antique.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'CZ75-Auto | Vendetta', rarity: 'UNCOMMON', value: 200.00, image: '/skins/cz-vendetta.png' },
      { name: 'Five-SeveN | Fairy Tale', rarity: 'UNCOMMON', value: 210.00, image: '/skins/five-fairy.png' },
      { name: 'USP-S | Monster Mashup', rarity: 'UNCOMMON', value: 205.00, image: '/skins/usp-monster.png' },
      { name: 'M4A4 | Cyber Security', rarity: 'UNCOMMON', value: 225.00, image: '/skins/m4a4-cyber.png' },
      
      // RARO (*5) - 2 itens
      { name: 'Glock-18 | Neo-Noir', rarity: 'RARE', value: 720.00, image: '/skins/glock-neo.png' },
      { name: 'M4A1-S | Printstream', rarity: 'RARE', value: 750.00, image: '/skins/m4a1-print.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'AK-47 | Slate', rarity: 'EPIC', value: 3600.00, image: '/skins/ak47-slate.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4500.00, image: '/knives/karambit-doppler.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 9 - R$ 200,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'breakout',
    name: 'Breakout Case',
    price: 200.00,
    image: '/images/cases/breakout.webp',
    color: '#F39C12',
    description: 'Fuga épica',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'CZ75-Auto | Poison Dart', rarity: 'COMMON', value: 30.00, image: '/skins/cz-poison.png' },
      { name: 'P2000 | Pulse', rarity: 'COMMON', value: 32.50, image: '/skins/p2000-pulse.png' },
      { name: 'Sawed-Off | Serenity', rarity: 'COMMON', value: 34.00, image: '/skins/sawed-serenity.png' },
      { name: 'SSG 08 | Detour', rarity: 'COMMON', value: 31.20, image: '/skins/ssg-detour.png' },
      { name: 'Tec-9 | Isaac', rarity: 'COMMON', value: 35.50, image: '/skins/tec9-isaac.png' },
      { name: 'UMP-45 | Labyrinth', rarity: 'COMMON', value: 30.80, image: '/skins/ump-lab.png' },
      { name: 'Nova | Exo', rarity: 'COMMON', value: 36.00, image: '/skins/nova-exo.png' },
      { name: 'P250 | Cartel', rarity: 'COMMON', value: 32.00, image: '/skins/p250-cartel.png' },
      { name: 'XM1014 | Quicksilver', rarity: 'COMMON', value: 37.50, image: '/skins/xm-quick.png' },
      { name: 'MAG-7 | Firestarter', rarity: 'COMMON', value: 33.80, image: '/skins/mag7-fire.png' },
      { name: 'Galil AR | Rocket Pop', rarity: 'COMMON', value: 35.00, image: '/skins/galil-rocket.png' },
      { name: 'MP7 | Urban Hazard', rarity: 'COMMON', value: 34.50, image: '/skins/mp7-urban.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'Glock-18 | Water Elemental', rarity: 'UNCOMMON', value: 270.00, image: '/skins/glock-water.png' },
      { name: 'M4A1-S | Cyrex', rarity: 'UNCOMMON', value: 285.00, image: '/skins/m4a1-cyrex.png' },
      { name: 'P90 | Elite Build', rarity: 'UNCOMMON', value: 280.00, image: '/skins/p90-elite.png' },
      { name: 'Five-SeveN | Fowl Play', rarity: 'UNCOMMON', value: 300.00, image: '/skins/five-fowl.png' },
      
      // RARO (*5) - 2 itens
      { name: 'AWP | Pink DDPAT', rarity: 'RARE', value: 960.00, image: '/skins/awp-pink.png' },
      { name: 'Desert Eagle | Sunset Storm', rarity: 'RARE', value: 1000.00, image: '/skins/deagle-sunset.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'AK-47 | Fuel Injector', rarity: 'EPIC', value: 4800.00, image: '/skins/ak47-fuel.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Butterfly Knife | Slaughter', rarity: 'LEGENDARY', value: 6000.00, image: '/knives/butterfly-slaughter.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 10 - R$ 300,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'riptide',
    name: 'Riptide Case',
    price: 300.00,
    image: '/images/cases/riptide.webp',
    color: '#3498DB',
    description: 'Ondas de poder',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'P2000 | Lifted Spirits', rarity: 'COMMON', value: 45.00, image: '/skins/p2000-lifted.png' },
      { name: 'MAC-10 | Toybox', rarity: 'COMMON', value: 48.50, image: '/skins/mac10-toybox.png' },
      { name: 'UMP-45 | Arctic Wolf', rarity: 'COMMON', value: 50.20, image: '/skins/ump-arctic.png' },
      { name: 'Dual Berettas | Tread', rarity: 'COMMON', value: 46.80, image: '/skins/duals-tread.png' },
      { name: 'MP5-SD | Oxide Oasis', rarity: 'COMMON', value: 52.00, image: '/skins/mp5-oxide.png' },
      { name: 'Nova | Windblown', rarity: 'COMMON', value: 47.50, image: '/skins/nova-wind.png' },
      { name: 'Negev | Drop Me', rarity: 'COMMON', value: 54.00, image: '/skins/negev-drop.png' },
      { name: 'XM1014 | Watchdog', rarity: 'COMMON', value: 49.20, image: '/skins/xm-watch.png' },
      { name: 'MP7 | Neon Ply', rarity: 'COMMON', value: 55.50, image: '/skins/mp7-neon.png' },
      { name: 'Galil AR | Chromatic Aberration', rarity: 'COMMON', value: 51.00, image: '/skins/galil-chroma.png' },
      { name: 'PP-Bizon | Lumen', rarity: 'COMMON', value: 53.50, image: '/skins/bizon-lumen.png' },
      { name: 'Sawed-Off | Apocalypto', rarity: 'COMMON', value: 50.50, image: '/skins/sawed-apoc.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'USP-S | Cortex', rarity: 'UNCOMMON', value: 405.00, image: '/skins/usp-cortex.png' },
      { name: 'M4A4 | Temukau', rarity: 'UNCOMMON', value: 420.00, image: '/skins/m4a4-tem.png' },
      { name: 'Five-SeveN | Boost Protocol', rarity: 'UNCOMMON', value: 415.00, image: '/skins/five-boost.png' },
      { name: 'FAMAS | Rapid Eye Movement', rarity: 'UNCOMMON', value: 450.00, image: '/skins/famas-rem.png' },
      
      // RARO (*5) - 2 itens
      { name: 'AK-47 | Leet Museo', rarity: 'RARE', value: 1440.00, image: '/skins/ak47-museo.png' },
      { name: 'AWP | Fade', rarity: 'RARE', value: 1500.00, image: '/skins/awp-fade.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'M4A1-S | Blue Phosphor', rarity: 'EPIC', value: 7200.00, image: '/skins/m4a1-blue.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Bayonet | Tiger Tooth', rarity: 'LEGENDARY', value: 9000.00, image: '/knives/bayonet-tiger.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 11 - R$ 400,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'huntsman',
    name: 'Huntsman Case',
    price: 400.00,
    image: '/images/cases/huntsman.webp',
    color: '#8E44AD',
    description: 'Caçador implacável',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'Tec-9 | Isaac', rarity: 'COMMON', value: 60.00, image: '/skins/tec9-isaac.png' },
      { name: 'P2000 | Pulse', rarity: 'COMMON', value: 64.50, image: '/skins/p2000-pulse.png' },
      { name: 'SCAR-20 | Cardiac', rarity: 'COMMON', value: 67.00, image: '/skins/scar-cardiac.png' },
      { name: 'XM1014 | Heaven Guard', rarity: 'COMMON', value: 62.40, image: '/skins/xm-heaven.png' },
      { name: 'PP-Bizon | Antique', rarity: 'COMMON', value: 69.50, image: '/skins/bizon-antique.png' },
      { name: 'Nova | Antique', rarity: 'COMMON', value: 63.20, image: '/skins/nova-antique.png' },
      { name: 'M249 | Nebula Crusader', rarity: 'COMMON', value: 72.00, image: '/skins/m249-nebula.png' },
      { name: 'UMP-45 | Delusion', rarity: 'COMMON', value: 65.80, image: '/skins/ump-delusion.png' },
      { name: 'Galil AR | Kami', rarity: 'COMMON', value: 74.00, image: '/skins/galil-kami.png' },
      { name: 'MAC-10 | Curse', rarity: 'COMMON', value: 68.00, image: '/skins/mac10-curse.png' },
      { name: 'MP7 | Ocean Foam', rarity: 'COMMON', value: 71.00, image: '/skins/mp7-ocean.png' },
      { name: 'Dual Berettas | Retribution', rarity: 'COMMON', value: 67.50, image: '/skins/duals-ret.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'SSG 08 | Slashed', rarity: 'UNCOMMON', value: 540.00, image: '/skins/ssg-slashed.png' },
      { name: 'USP-S | Orion', rarity: 'UNCOMMON', value: 560.00, image: '/skins/usp-orion.png' },
      { name: 'AUG | Torque', rarity: 'UNCOMMON', value: 555.00, image: '/skins/aug-torque.png' },
      { name: 'CZ75-Auto | Tigris', rarity: 'UNCOMMON', value: 600.00, image: '/skins/cz-tigris.png' },
      
      // RARO (*5) - 2 itens
      { name: 'M4A4 | Desert-Strike', rarity: 'RARE', value: 1920.00, image: '/skins/m4a4-desert.png' },
      { name: 'AK-47 | Vulcan', rarity: 'RARE', value: 2000.00, image: '/skins/ak47-vulcan.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'M4A1-S | Atomic Alloy', rarity: 'EPIC', value: 9600.00, image: '/skins/m4a1-atomic.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Huntsman Knife | Fade', rarity: 'LEGENDARY', value: 12000.00, image: '/knives/huntsman-fade.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 12 - R$ 500,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'spectrum',
    name: 'Spectrum Case',
    price: 500.00,
    image: '/images/cases/spectrum.webp',
    color: '#E91E63',
    description: 'Espectro de cores',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'UMP-45 | Scaffold', rarity: 'COMMON', value: 75.00, image: '/skins/ump-scaffold.png' },
      { name: 'P250 | Ripple', rarity: 'COMMON', value: 80.50, image: '/skins/p250-ripple.png' },
      { name: 'MAC-10 | Carnivore', rarity: 'COMMON', value: 83.80, image: '/skins/mac10-carnivore.png' },
      { name: 'Sawed-Off | Zander', rarity: 'COMMON', value: 78.00, image: '/skins/sawed-zander.png' },
      { name: 'PP-Bizon | Harvester', rarity: 'COMMON', value: 86.50, image: '/skins/bizon-harv.png' },
      { name: 'MAG-7 | Sonar', rarity: 'COMMON', value: 79.20, image: '/skins/mag7-sonar.png' },
      { name: 'XM1014 | Seasons', rarity: 'COMMON', value: 90.00, image: '/skins/xm-seasons.png' },
      { name: 'Negev | Ricochet', rarity: 'COMMON', value: 82.40, image: '/skins/negev-rico.png' },
      { name: 'Dual Berettas | Ventilators', rarity: 'COMMON', value: 92.50, image: '/skins/duals-vent.png' },
      { name: 'MP9 | Goo', rarity: 'COMMON', value: 88.00, image: '/skins/mp9-goo.png' },
      { name: 'Nova | Baroque Orange', rarity: 'COMMON', value: 88.50, image: '/skins/nova-baroque.png' },
      { name: 'Galil AR | Sugar Rush', rarity: 'COMMON', value: 84.20, image: '/skins/galil-sugar.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'AK-47 | Bloodsport', rarity: 'UNCOMMON', value: 675.00, image: '/skins/ak47-blood.png' },
      { name: 'P90 | Death Grip', rarity: 'UNCOMMON', value: 700.00, image: '/skins/p90-death.png' },
      { name: 'CZ75-Auto | Xiangliu', rarity: 'UNCOMMON', value: 690.00, image: '/skins/cz-xiang.png' },
      { name: 'SSG 08 | Fever Dream', rarity: 'UNCOMMON', value: 750.00, image: '/skins/ssg-fever.png' },
      
      // RARO (*5) - 2 itens
      { name: 'M4A1-S | Decimator', rarity: 'RARE', value: 2400.00, image: '/skins/m4a1-decimator.png' },
      { name: 'USP-S | Neo-Noir', rarity: 'RARE', value: 2500.00, image: '/skins/usp-neo.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'AWP | Chromatic Aberration', rarity: 'EPIC', value: 12000.00, image: '/skins/awp-chroma.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Butterfly Knife | Gamma Doppler', rarity: 'LEGENDARY', value: 15000.00, image: '/knives/butterfly-gamma.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 13 - R$ 750,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'hydra',
    name: 'Hydra Case',
    price: 750.00,
    image: '/images/cases/hydra.webp',
    color: '#00BCD4',
    description: 'Força multiplicada',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'Tec-9 | Cracked Opal', rarity: 'COMMON', value: 112.50, image: '/skins/tec9-opal.png' },
      { name: 'P250 | Iron Clad', rarity: 'COMMON', value: 120.80, image: '/skins/p250-iron.png' },
      { name: 'Nova | Wood Fired', rarity: 'COMMON', value: 125.70, image: '/skins/nova-wood.png' },
      { name: 'Dual Berettas | Cobra Strike', rarity: 'COMMON', value: 117.00, image: '/skins/duals-cobra.png' },
      { name: 'MP7 | Cirrus', rarity: 'COMMON', value: 129.80, image: '/skins/mp7-cirrus.png' },
      { name: 'XM1014 | Black Tie', rarity: 'COMMON', value: 118.60, image: '/skins/xm-black.png' },
      { name: 'PP-Bizon | Jungle Slipstream', rarity: 'COMMON', value: 135.00, image: '/skins/bizon-jungle.png' },
      { name: 'MAG-7 | Hard Water', rarity: 'COMMON', value: 123.60, image: '/skins/mag7-hard.png' },
      { name: 'UMP-45 | Exposure', rarity: 'COMMON', value: 138.80, image: '/skins/ump-exp.png' },
      { name: 'Galil AR | Cold Fusion', rarity: 'COMMON', value: 132.00, image: '/skins/galil-cold.png' },
      { name: 'M249 | Shipping Forecast', rarity: 'COMMON', value: 132.80, image: '/skins/m249-ship.png' },
      { name: 'SCAR-20 | Fragments', rarity: 'COMMON', value: 126.30, image: '/skins/scar-frag.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'Five-SeveN | Hyper Beast', rarity: 'UNCOMMON', value: 1012.50, image: '/skins/five-hyper.png' },
      { name: 'Glock-18 | Weasel', rarity: 'UNCOMMON', value: 1050.00, image: '/skins/glock-weasel.png' },
      { name: 'FAMAS | Mecha Industries', rarity: 'UNCOMMON', value: 1035.00, image: '/skins/famas-mecha.png' },
      { name: 'AWP | PAW', rarity: 'UNCOMMON', value: 1125.00, image: '/skins/awp-paw.png' },
      
      // RARO (*5) - 2 itens
      { name: 'M4A4 | Hellfire', rarity: 'RARE', value: 3600.00, image: '/skins/m4a4-hellfire.png' },
      { name: 'AK-47 | Orbit Mk01', rarity: 'RARE', value: 3750.00, image: '/skins/ak47-orbit.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'Desert Eagle | Directive', rarity: 'EPIC', value: 18000.00, image: '/skins/deagle-directive.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Karambit | Autotronic', rarity: 'LEGENDARY', value: 22500.00, image: '/knives/karambit-auto.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 14 - R$ 1.000,00
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'bravo',
    name: 'Bravo Case',
    price: 1000.00,
    image: '/images/cases/bravo.webp',
    color: '#FF5722',
    description: 'Excelência premium',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'P90 | Blind Spot', rarity: 'COMMON', value: 150.00, image: '/skins/p90-blind.png' },
      { name: 'MP9 | Rose Iron', rarity: 'COMMON', value: 161.00, image: '/skins/mp9-rose.png' },
      { name: 'Dual Berettas | Black Limba', rarity: 'COMMON', value: 167.60, image: '/skins/duals-limba.png' },
      { name: 'Nova | Tempest', rarity: 'COMMON', value: 156.00, image: '/skins/nova-tempest.png' },
      { name: 'UMP-45 | Bone Pile', rarity: 'COMMON', value: 173.00, image: '/skins/ump-bone.png' },
      { name: 'Mac-10 | Graven', rarity: 'COMMON', value: 157.50, image: '/skins/mac10-graven.png' },
      { name: 'PP-Bizon | Rust Coat', rarity: 'COMMON', value: 180.00, image: '/skins/bizon-rust.png' },
      { name: 'Tec-9 | Red Quartz', rarity: 'COMMON', value: 164.80, image: '/skins/tec9-quartz.png' },
      { name: 'Negev | Bratatat', rarity: 'COMMON', value: 185.00, image: '/skins/negev-brata.png' },
      { name: 'Sawed-Off | Orange DDPAT', rarity: 'COMMON', value: 176.00, image: '/skins/sawed-orange.png' },
      { name: 'Galil AR | Shattered', rarity: 'COMMON', value: 177.00, image: '/skins/galil-shattered.png' },
      { name: 'XM1014 | Red Python', rarity: 'COMMON', value: 168.10, image: '/skins/xm-python.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'USP-S | Overgrowth', rarity: 'UNCOMMON', value: 1350.00, image: '/skins/usp-over.png' },
      { name: 'P2000 | Ocean Foam', rarity: 'UNCOMMON', value: 1400.00, image: '/skins/p2000-ocean.png' },
      { name: 'SG 553 | Pulse', rarity: 'UNCOMMON', value: 1380.00, image: '/skins/sg-pulse.png' },
      { name: 'AUG | Chameleon', rarity: 'UNCOMMON', value: 1500.00, image: '/skins/aug-cham.png' },
      
      // RARO (*5) - 2 itens
      { name: 'AWP | Graphite', rarity: 'RARE', value: 4800.00, image: '/skins/awp-graphite.png' },
      { name: 'AK-47 | Fire Serpent', rarity: 'RARE', value: 5000.00, image: '/skins/ak47-fire.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'Desert Eagle | Golden Koi', rarity: 'EPIC', value: 24000.00, image: '/skins/deagle-koi.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'M9 Bayonet | Fade', rarity: 'LEGENDARY', value: 30000.00, image: '/knives/m9-fade.png' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAIXA 15 - R$ 1.500,00 (MÁXIMO)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'weapon',
    name: 'Weapon Case',
    price: 1500.00,
    image: '/images/cases/weapon.webp',
    color: '#FFD700',
    description: 'Arsenal definitivo',
    items: [
      // COMUM (*0.25) - 12 itens
      { name: 'P250 | Boreal Forest', rarity: 'COMMON', value: 225.00, image: '/skins/p250-boreal.png' },
      { name: 'MP7 | Skulls', rarity: 'COMMON', value: 241.50, image: '/skins/mp7-skulls.png' },
      { name: 'Negev | Terrain', rarity: 'COMMON', value: 251.40, image: '/skins/negev-terrain.png' },
      { name: 'Nova | Predator', rarity: 'COMMON', value: 234.00, image: '/skins/nova-predator.png' },
      { name: 'Tec-9 | Tornado', rarity: 'COMMON', value: 259.50, image: '/skins/tec9-tornado.png' },
      { name: 'XM1014 | Blue Steel', rarity: 'COMMON', value: 236.30, image: '/skins/xm-blue.png' },
      { name: 'UMP-45 | Caramel', rarity: 'COMMON', value: 270.00, image: '/skins/ump-caramel.png' },
      { name: 'Dual Berettas | Anodized Navy', rarity: 'COMMON', value: 246.70, image: '/skins/duals-navy.png' },
      { name: 'PP-Bizon | Modern Hunter', rarity: 'COMMON', value: 277.50, image: '/skins/bizon-modern.png' },
      { name: 'MAC-10 | Silver', rarity: 'COMMON', value: 264.00, image: '/skins/mac10-silver.png' },
      { name: 'Galil AR | Sage Spray', rarity: 'COMMON', value: 265.50, image: '/skins/galil-sage.png' },
      { name: 'M249 | Contrast Spray', rarity: 'COMMON', value: 252.20, image: '/skins/m249-contrast.png' },
      
      // INCOMUM (*1.5) - 4 itens
      { name: 'Glock-18 | Dragon Tattoo', rarity: 'UNCOMMON', value: 2025.00, image: '/skins/glock-dragon.png' },
      { name: 'M4A1-S | Dark Water', rarity: 'UNCOMMON', value: 2100.00, image: '/skins/m4a1-dark.png' },
      { name: 'Desert Eagle | Hypnotic', rarity: 'UNCOMMON', value: 2070.00, image: '/skins/deagle-hypnotic.png' },
      { name: 'USP-S | Dark Water', rarity: 'UNCOMMON', value: 2250.00, image: '/skins/usp-dark.png' },
      
      // RARO (*5) - 2 itens
      { name: 'AWP | Lightning Strike', rarity: 'RARE', value: 7200.00, image: '/skins/awp-lightning.png' },
      { name: 'AK-47 | Case Hardened', rarity: 'RARE', value: 7500.00, image: '/skins/ak47-case.png' },
      
      // ÉPICO (*25) - 1 item
      { name: 'M4A4 | Howl', rarity: 'EPIC', value: 36000.00, image: '/skins/m4a4-howl.png' },
      
      // LENDÁRIO (*100) - 1 item
      { name: 'Karambit | Gamma Doppler', rarity: 'LEGENDARY', value: 45000.00, image: '/knives/karambit-gamma.png' }
    ]
  }
];

export { RARITIES };

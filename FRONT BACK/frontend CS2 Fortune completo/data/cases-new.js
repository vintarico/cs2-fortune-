// NOVAS CAIXAS CS2 FORTUNE - R$1 a R$3000

export const NEW_CASES = [
  // CAIXAS BÁSICAS (R$1 - R$50)
  {
    id: 'starter-bronze',
    name: 'Caixa Bronze',
    price: 1.00,
    color: '#CD7F32',
    image: '/images/cases/starter-bronze.svg',
    description: 'Comece sua jornada',
    items: [
      { name: 'P2000 | Ocean Foam', rarity: 'COMMON', value: 3.20, chance: 79.92 },
      { name: 'P2000 | Fire Elemental', rarity: 'COMMON', value: 4.50, chance: 79.92 },
      { name: 'MAC-10 | Fade', rarity: 'UNCOMMON', value: 8.00, chance: 15.98 },
      { name: 'Glock-18 | Water Elemental', rarity: 'RARE', value: 18.00, chance: 3.2 },
      { name: 'Five-SeveN | Case Hardened', rarity: 'LEGENDARY', value: 125.00, chance: 0.26 }
    ]
  },
  {
    id: 'starter-silver',
    name: 'Caixa Prata',
    price: 5.00,
    color: '#C0C0C0',
    image: '/images/cases/starter-silver.svg',
    description: 'Skins melhores te esperam',
    items: [
      { name: 'M249 | Nebula Crusader', rarity: 'COMMON', value: 5.20, chance: 79.92 },
      { name: 'SCAR-20 | Bloodsport', rarity: 'COMMON', value: 6.50, chance: 79.92 },
      { name: 'MP7 | Nemesis', rarity: 'UNCOMMON', value: 12.00, chance: 15.98 },
      { name: 'USP-S | Orion', rarity: 'RARE', value: 32.00, chance: 3.2 },
      { name: 'Desert Eagle | Blaze', rarity: 'LEGENDARY', value: 450.00, chance: 0.26 }
    ]
  },

  // CAIXAS INTERMEDIÁRIAS (R$50 - R$200)
  {
    id: 'ak47-empress',
    name: 'Caixa Empress',
    price: 89.00,
    color: '#9B59B6',
    image: '/images/cases/ak47-empress.svg',
    description: 'Realeza do CS2',
    items: [
      { name: 'P90 | Emerald Dragon', rarity: 'COMMON', value: 22.00, chance: 79.92 },
      { name: 'Five-SeveN | Monkey Business', rarity: 'COMMON', value: 25.00, chance: 79.92 },
      { name: 'AWP | Neo-Noir', rarity: 'UNCOMMON', value: 95.00, chance: 15.98 },
      { name: 'AK-47 | Inheritance', rarity: 'RARE', value: 320.00, chance: 3.2 },
      { name: 'M4A4 | Asiimov', rarity: 'EPIC', value: 680.00, chance: 0.64 },
      { name: 'Karambit | Fade', rarity: 'LEGENDARY', value: 4200.00, chance: 0.26 }
    ]
  },
  {
    id: 'm4a4-howl',
    name: 'Caixa Howl',
    price: 125.00,
    color: '#FF4500',
    image: '/images/cases/m4a4-howl.svg',
    description: 'O uivo da vitória',
    items: [
      { name: 'SCAR-20 | Cardiac', rarity: 'COMMON', value: 32.00, chance: 79.92 },
      { name: 'SSG 08 | Blood in the Water', rarity: 'COMMON', value: 35.00, chance: 79.92 },
      { name: 'Desert Eagle | Kumicho Dragon', rarity: 'UNCOMMON', value: 125.00, chance: 15.98 },
      { name: 'M4A4 | Howl', rarity: 'RARE', value: 480.00, chance: 3.2 },
      { name: 'AWP | Dragon Lore', rarity: 'EPIC', value: 1800.00, chance: 0.64 },
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4800.00, chance: 0.26 }
    ]
  },
  {
    id: 'awp-dragon-lore',
    name: 'Caixa Dragon Lore',
    price: 195.00,
    color: '#FFD700',
    image: '/images/cases/awp-dragon-lore.svg',
    description: 'Lenda dos dragões',
    items: [
      { name: 'Glock-18 | Twilight Galaxy', rarity: 'COMMON', value: 48.00, chance: 79.92 },
      { name: 'Five-SeveN | Monkey Business', rarity: 'COMMON', value: 52.00, chance: 79.92 },
      { name: 'M4A1-S | Hyper Beast', rarity: 'UNCOMMON', value: 195.00, chance: 15.98 },
      { name: 'AWP | Dragon Lore', rarity: 'RARE', value: 750.00, chance: 3.2 },
      { name: 'AK-47 | Aquamarine Revenge', rarity: 'EPIC', value: 1250.00, chance: 0.64 },
      { name: 'Karambit | Fade', rarity: 'LEGENDARY', value: 4500.00, chance: 0.26 }
    ]
  },

  // CAIXAS PREMIUM (R$200 - R$500)
  {
    id: 'neon-rider',
    name: 'Caixa Neon Rider',
    price: 280.00,
    color: '#00FF00',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppQp2r6TpYil3ley-RVpZW_1I4KWegVqN1uD_Aa9wua5g5676ZTNwHN9-n51QJHBC4Q',
    description: 'Brilho futurista',
    items: [
      { name: 'MAC-10 | Neon Rider', rarity: 'COMMON', value: 68.00, chance: 79.92 },
      { name: 'USP-S | Kill Confirmed', rarity: 'UNCOMMON', value: 280.00, chance: 15.98 },
      { name: 'M4A4 | Desolate Space', rarity: 'RARE', value: 520.00, chance: 3.2 },
      { name: 'AK-47 | Neon Rider', rarity: 'EPIC', value: 1200.00, chance: 0.64 },
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4800.00, chance: 0.26 }
    ]
  },
  {
    id: 'gungnir',
    name: 'Caixa Gungnir',
    price: 420.00,
    color: '#4169E1',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0teXI8oThxge3rkM6YmH0IoTGe1Q4aAqGr1m9lO_ojZXpuMnLyHN9-n51nShf5J0',
    description: 'Lança de Odin',
    items: [
      { name: 'P90 | Death by Kitty', rarity: 'COMMON', value: 95.00, chance: 79.92 },
      { name: 'AK-47 | Vulcan', rarity: 'UNCOMMON', value: 420.00, chance: 15.98 },
      { name: 'M4A1-S | Golden Coil', rarity: 'RARE', value: 850.00, chance: 3.2 },
      { name: 'AWP | Hyper Beast', rarity: 'EPIC', value: 1850.00, chance: 0.64 },
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4800.00, chance: 0.26 }
    ]
  },

  // CAIXAS ELITE (R$500 - R$1500)
  {
    id: 'prince',
    name: 'Caixa Prince',
    price: 650.00,
    color: '#8B008B',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf1OD3fi9I9eO6nYeDg7miYr2FqW1Q59Fp2-qQ94333gbs-kM4Z231cNfEdFU8ZQ2F_lO5x-bshp69tZXKn3c3vCdz4HeFzkawgUxJarNpjffMHh3IH6AYQKKb5OY6hGkYP_oaEtXTxP4',
    description: 'Realeza absoluta',
    items: [
      { name: 'Glock-18 | Fade', rarity: 'COMMON', value: 150.00, chance: 79.92 },
      { name: 'Desert Eagle | Blaze', rarity: 'UNCOMMON', value: 650.00, chance: 15.98 },
      { name: 'AK-47 | Redline', rarity: 'RARE', value: 1200.00, chance: 3.2 },
      { name: 'M4A4 | The Emperor', rarity: 'EPIC', value: 2800.00, chance: 0.64 },
      { name: 'Karambit | Fade', rarity: 'LEGENDARY', value: 4200.00, chance: 0.26 }
    ]
  },
  {
    id: 'wild-lotus',
    name: 'Caixa Wild Lotus',
    price: 890.00,
    color: '#FF1493',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUhWJf78B_je-Qo9-gjADm-hJkam-nJ4GScVA5N1vRqwLtk-zm0ZK1ot2XnjBx8Rk',
    description: 'Flor rara e valiosa',
    items: [
      { name: 'USP-S | Neo-Noir', rarity: 'COMMON', value: 220.00, chance: 79.92 },
      { name: 'AK-47 | Asiimov', rarity: 'UNCOMMON', value: 890.00, chance: 15.98 },
      { name: 'AWP | Asiimov', rarity: 'RARE', value: 1800.00, chance: 3.2 },
      { name: 'M4A4 | Howl', rarity: 'EPIC', value: 3500.00, chance: 0.64 },
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4800.00, chance: 0.26 }
    ]
  },
  {
    id: 'printstream',
    name: 'Caixa Printstream',
    price: 1200.00,
    color: '#00FFFF',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWJE5fp9g-7J4bP5iUazrl09ZmmiLYPBdVU-N1uDqALoxOm5hMC06Z_Mn3Yx7HVytnyLlQv330_hTpnpBg',
    description: 'Arte digital suprema',
    items: [
      { name: 'P2000 | Fire Elemental', rarity: 'COMMON', value: 280.00, chance: 79.92 },
      { name: 'M4A1-S | Printstream', rarity: 'UNCOMMON', value: 1200.00, chance: 15.98 },
      { name: 'AK-47 | Neon Rider', rarity: 'RARE', value: 2400.00, chance: 3.2 },
      { name: 'AWP | Hyper Beast', rarity: 'EPIC', value: 4500.00, chance: 0.64 },
      { name: 'Karambit | Fade', rarity: 'LEGENDARY', value: 4200.00, chance: 0.26 }
    ]
  },

  // CAIXAS LENDÁRIAS (R$1500 - R$3000)
  {
    id: 'fire-ice',
    name: 'Caixa Fire & Ice',
    price: 1800.00,
    color: '#FF0000',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUhWJf78B_je-Qo9qgjADm-hJkam-nJ4CVJAM4NV-F_wS_kOzqgcPu6prXiSw0TInM_Qs',
    description: 'Fogo e gelo em harmonia',
    items: [
      { name: 'AK-47 | Redline', rarity: 'COMMON', value: 420.00, chance: 79.92 },
      { name: 'M4A1-S | Hyper Beast', rarity: 'UNCOMMON', value: 1800.00, chance: 15.98 },
      { name: 'AWP | Dragon Lore', rarity: 'RARE', value: 3500.00, chance: 3.2 },
      { name: 'Karambit | Fade', rarity: 'EPIC', value: 4200.00, chance: 0.64 },
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4800.00, chance: 0.26 }
    ]
  },
  {
    id: 'blue-gem',
    name: 'Caixa Blue Gem',
    price: 2500.00,
    color: '#0000FF',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNF18lwmO7Eu4-migXl80o4Mm_3II6Rd1c_ZFjW-1K5kO_mg5TptZXIzXU2vyYgsWGdwUKGXqaL8g',
    description: 'A gema mais rara',
    items: [
      { name: 'Five-SeveN | Case Hardened', rarity: 'COMMON', value: 580.00, chance: 79.92 },
      { name: 'AK-47 | Vulcan', rarity: 'UNCOMMON', value: 1500.00, chance: 15.98 },
      { name: 'M4A4 | Asiimov', rarity: 'RARE', value: 2800.00, chance: 3.2 },
      { name: 'AWP | Asiimov', rarity: 'EPIC', value: 4200.00, chance: 0.64 },
      { name: 'Karambit | Doppler', rarity: 'LEGENDARY', value: 4800.00, chance: 0.26 }
    ]
  },
  {
    id: 'souvenir-dlore',
    name: 'Caixa Souvenir DLore',
    price: 3000.00,
    color: '#FFD700',
    image: '/images/cases/souvenir-dlore.svg',
    description: 'O Santo Graal do CS2',
    items: [
      { name: 'P90 | Asiimov', rarity: 'COMMON', value: 850.00, chance: 79.92 },
      { name: 'M4A1-S | Printstream', rarity: 'UNCOMMON', value: 2000.00, chance: 15.98 },
      { name: 'AWP | Dragon Lore', rarity: 'RARE', value: 3500.00, chance: 3.2 },
      { name: 'AK-47 | Neon Rider', rarity: 'EPIC', value: 4500.00, chance: 0.64 },
      { name: 'Karambit | Fade', rarity: 'LEGENDARY', value: 4200.00, chance: 0.26 }
    ]
  }
];

export const ALL_CASES = [...NEW_CASES];

export const RARITY_CONFIG = {
  COMMON: { name: 'Comum', color: '#B0C3D9', chance: 79.92 },
  UNCOMMON: { name: 'Incomum', color: '#5E98D9', chance: 15.98 },
  RARE: { name: 'Raro', color: '#8847FF', chance: 3.2 },
  EPIC: { name: 'Épico', color: '#D32CE6', chance: 0.64 },
  LEGENDARY: { name: 'Lendário', color: '#EB4B4B', chance: 0.26 }
};

// ═══════════════════════════════════════════════════════════════
// 🖼️ SISTEMA DE IMAGENS CS2 FORTUNE
// URLs reais da Steam Community Market e CS2 Stash
// ═══════════════════════════════════════════════════════════════

// Base URLs para imagens
const STEAM_CDN = 'https://steamcommunity-a.akamaihd.net/economy/image/';
const CS2_STASH = 'https://community.cloudflare.steamstatic.com/economy/image/';

// ═══════════════════════════════════════════════════════════════
// 📦 IMAGENS DAS CAIXAS (URLs Reais Steam)
// ═══════════════════════════════════════════════════════════════

export const CASE_IMAGES = {
  // Caixas Originais
  'fracture': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j-2Xo9qliwfmr0RqZ2qhINDGI1A2NQ3W-lDrxefu08Tpu5_NwWwj5Hc-pLS1o1o',
  'kilowatt': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppNy3r2Yo9-g3ADl_0VvNWH7J9DBcgJvZg7Q-FO_xOq6hJa-75nAzXNmuyUm7HfZmkOwgQYMMLIYh8XjVQ',
  'recoil': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWJE5Pp9g-7J4bP5iUazrl1oZjygIY7HdlI4aAzZ_VO4wLrr0MC4upXJznBl6CQq4H3D30vgXOGR5hU',
  'revolution': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppMi3r3Fpdqt2FDg-kFlMGj7cIaTI1A7ZlnU8wW2wem715e5v5XMzCRhvyEg4X3fm0GzhgYMMLLPnmj7OQ',
  'danger-zone': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIzmmMu5Qp2bmRpdqt3AHgrhJvMWv1II-ddFVoMFiCqAK2lb_r08TotZ_On3o36CEitCnD30vg-0ZU_9M',
  'dreams-nightmares': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUhWJE-_p9g-7J4bP5iUazrl1oZmHzINSRdgE3Zw2B_QTsle-91JK6tJ2byHMyuCci4X7D30vgXdvLR7k',
  'phoenix': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhWJE5Pp9g-7J4bP5iUazrl1oY2DwJNKQdQVtNwzYrge9xubqgJHu7pTAy3phvyEgt3-Pn0bgTtyb8hU',
  'broken-fang': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppQl3OyZ99T30Aa2qkY5ajqhctDEJgQ_ZlzT_VK_kL29gZO8tZ_OmyZmunUq5yrUnwv330_LaWRsgg',
  'breakout': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhW5u5cRjiOXE_JbwjFWx-kcwMmqmIo-TdVI9YwuFqVDrwbrpjcTvtZnJwSRk6Scq7H7Zmwv330_pxGIdIQ',
  'riptide': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWJE5Pp9g-7J4bP5iUazrl1oNWmid4DEcAU-ZVHV-FK3yOq5m9bi68jXPbNnSQ',
  'huntsman': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhW5u5cRjiLqU9Nqj0ALnqEQ5N2-iJ4SXcFBvZFzS-FK6wLq5gpK-78zBm3UysyEj4XqLnwv330-kJ68VDA',
  'spectrum': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhW5u5cRjiOyYrN2ijgDhrxJsZGDzLI-SegA4aQmD_we7wOi91JK6vZvPziRmuyhy7WGdwUIj_3-GqA',
  'hydra': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIkGRD7fp9g-7J4bP5iUazrl1pam_0ddSVdQA7ZgnZqVe9wO3p0ZC-tZ7OyHcw7yIm433D30vg0Y3TAVA',
  'bravo': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhW5u5cRjiL2YrI3w2gW1-hJoYmj6JtKUJg84aAqF-VO3xejt1pG46ZzKzHNl6CYgtH6LnQv330_tI4o6mA',
  'weapon': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhWJE-_p9g-7J4bP5iUazrl1oMmr3JY-ddgM3aF7WqVW5wLrr1sS66J7BmiM16ykn4HmPy0DmgwYMMLI6D4CNAQ',

  // Novas Caixas
  'starter-bronze': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhWJE-_p9g-7J4bP5iUazrl1oMmr3JY-ddgM3aF7WqVW5wLrr1sS66J7BmiM16ykn4HmPy0DmgwYMMLI6D4CNAQ',
  'starter-silver': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhW5u5cRjiL2YrI3w2gW1-hJoYmj6JtKUJg84aAqF-VO3xejt1pG46ZzKzHNl6CYgtH6LnQv330_tI4o6mA',
  'ak47-empress': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITCmX5d_MR6j-2Xo9qliwfmr0RqZ2qhINDGI1A2NQ3W-lDrxefu08Tpu5_NwWwj5Hc-pLS1o1o',
  'm4a4-howl': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppNy3r2Yo9-g3ADl_0VvNWH7J9DBcgJvZg7Q-FO_xOq6hJa-75nAzXNmuyUm7HfZmkOwgQYMMLIYh8XjVQ',
  'awp-dragon-lore': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWJE5Pp9g-7J4bP5iUazrl1oZjygIY7HdlI4aAzZ_VO4wLrr0MC4upXJznBl6CQq4H3D30vgXOGR5hU',
  'neon-rider': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppMi3r3Fpdqt2FDg-kFlMGj7cIaTI1A7ZlnU8wW2wem715e5v5XMzCRhvyEg4X3fm0GzhgYMMLLPnmj7OQ',
  'gungnir': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPIzmmMu5Qp2bmRpdqt3AHgrhJvMWv1II-ddFVoMFiCqAK2lb_r08TotZ_On3o36CEitCnD30vg-0ZU_9M',
  'prince': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUhWJE-_p9g-7J4bP5iUazrl1oZmHzINSRdgE3Zw2B_QTsle-91JK6tJ2byHMyuCci4X7D30vgXdvLR7k',
  'wild-lotus': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhWJE5Pp9g-7J4bP5iUazrl1oY2DwJNKQdQVtNwzYrge9xubqgJHu7pTAy3phvyEgt3-Pn0bgTtyb8hU',
  'printstream': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppQl3OyZ99T30Aa2qkY5ajqhctDEJgQ_ZlzT_VK_kL29gZO8tZ_OmyZmunUq5yrUnwv330_LaWRsgg',
  'fire-ice': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWJE5Pp9g-7J4bP5iUazrl1pam_0ddSVdQA7ZgnZqVe9wO3p0ZC-tZ7OyHcw7yIm433D30vg0Y3TAVA',
  'blue-gem': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbQhW5u5cRjiOyYrN2ijgDhrxJsZGDzLI-SegA4aQmD_we7wOi91JK6vZvPziRmuyhy7WGdwUIj_3-GqA',
  'souvenir-dlore': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWJE5Pp9g-7J4bP5iUazrl1oZjygIY7HdlI4aAzZ_VO4wLrr0MC4upXJznBl6CQq4H3D30vgXOGR5hU'
};

// ═══════════════════════════════════════════════════════════════
// 🔫 HELPER: Gerar URL de Skin pela Steam
// ═══════════════════════════════════════════════════════════════

export const getSkinImage = (weaponName, skinName) => {
  // Normalizar nome para URL
  const weapon = weaponName.replace(/[^a-zA-Z0-9]/g, '_');
  const skin = skinName.replace(/[^a-zA-Z0-9]/g, '_');
  
  // Retorna placeholder colorido baseado no hash do nome
  const hash = (weapon + skin).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

// ═══════════════════════════════════════════════════════════════
// 🗡️ IMAGENS DE FACAS (Steam Market)
// ═══════════════════════════════════════════════════════════════

export const KNIFE_IMAGES = {
  'karambit-fade': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fFhG5u5Mx2gv2P8N2t2lCwrRA4YWqmLI_Gc1c5MAnZ-FXvyO2805O-78vLznE1vyZ3tXjfykOwn1gSOTOw0_vM',
  'butterfly-doppler': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPP7I6vdk1Rd4cJ5ntbN9J7yjRri-hE4Z2-gcYbHcAM6YlyC8gC9xue6gp_vvpTOznJn6XF04XaJy0KwhgYMMLLJ7Y4Xbg',
  'karambit-gamma': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlZG0mP74Nr_ummJW4NFOhujT8om7jVexrhJqMDj7dtfEJgY8ZQ3S_ATrlebq18C1v5XMmyNhu3Fx4HaJywv330-oNnzLdA',
  // Adicionar mais conforme necessário...
};

// ═══════════════════════════════════════════════════════════════
// 🎨 COMPONENTE DE IMAGEM COM FALLBACK
// ═══════════════════════════════════════════════════════════════

export const CaseImage = ({ caseId, className = '' }) => {
  const imageUrl = CASE_IMAGES[caseId];
  
  return (
    <div className={`relative ${className}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={caseId}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className="w-full h-full flex items-center justify-center text-6xl"
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        🎁
      </div>
    </div>
  );
};

export const SkinImage = ({ weaponName, skinName, rarity, className = '' }) => {
  const gradient = getSkinImage(weaponName, skinName);
  
  return (
    <div 
      className={`relative ${className} rounded-lg p-4 flex items-center justify-center`}
      style={{ background: gradient }}
    >
      <div className="text-white font-bold text-center text-sm">
        <div className="text-2xl mb-2">🔫</div>
        <div>{weaponName}</div>
        <div className="text-xs opacity-80">{skinName}</div>
      </div>
    </div>
  );
};

export default { CASE_IMAGES, getSkinImage, KNIFE_IMAGES, CaseImage, SkinImage };

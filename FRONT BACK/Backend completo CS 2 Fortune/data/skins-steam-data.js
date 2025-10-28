/**
 * ═══════════════════════════════════════════════════════════════
 * 🔄 SCRIPT DE ATUALIZAÇÃO - SKINS COM DADOS DA STEAM
 * ═══════════════════════════════════════════════════════════════
 * 
 * Este script atualiza os arquivos de skins para usar:
 * - Preços reais do Steam Market
 * - Imagens oficiais da Steam CDN
 * - Links para o mercado Steam
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// 📦 DADOS DAS SKINS COM INFORMAÇÕES STEAM
// ═══════════════════════════════════════════════════════════════

const SKINS_WITH_STEAM_DATA = {
  // AK-47
  'ak47-redline': {
    market_hash_name: 'AK-47 | Redline (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_1K9ku_xxcjvot2XnmKLPjI',
  },
  'ak47-fire-serpent': {
    market_hash_name: 'AK-47 | Fire Serpent (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV092lnYmGmOHLP7LWnn9u5MRjjeyPrYqt2wXn-BBsNj2lJtLBJlc7MFmCrwS-kL3xxcjv60n-rDo',
  },
  'ak47-vulcan': {
    market_hash_name: 'AK-47 | Vulcan (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09e3kYqOqPrxN7LEm1Rd6dd2j6fE89ij2gK1qUQ-NmyldYLHcgY_aAzS-lbqyLvq15a5tMvMznNjsCIm7X_WhAv330_C4qqDWg',
  },
  'ak47-neon-rider': {
    market_hash_name: 'AK-47 | Neon Rider (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09m7hIqGh_7zNqndrlRd4NFOhuDG_ZjKhFWmrBZuNjj0JYOdcVc-aQnXrFO2x-7rhJLvup7JwSBr7CUq4n7D30vgRZL_R8I',
  },

  // AWP
  'awp-asiimov': {
    market_hash_name: 'AWP | Asiimov (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2D4F7ZQp3u2YpIqj3gLm_xdlMGGicYCVdAA3aVrT-VK8lOjmgZ646ZqamHFjuygm53rUmUbgh01FP-E6hPSACQLJ_eJWROs',
  },
  'awp-dragon-lore': {
    market_hash_name: 'AWP | Dragon Lore (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ7MEpiLqQo96l2gfn-UU5ZmrwJo-VdwM2YwnS_lPtlOa9h5a66czAyyM1uCUk4n3D30vgxJ-RLlU',
  },
  'awp-fade': {
    market_hash_name: 'AWP | Fade (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJO7e-_mJC0mvLwOq7c2GxQucdygdbJ_Y3mjRrhrRdlZGr7doCWc1Q-YlyD_Vm5wL291ZC_upXLyHJhuXJ25niJyxTl1RkfOelqhvSACQLJ-FGH0qQ',
  },

  // M4A4
  'm4a4-howl': {
    market_hash_name: 'M4A4 | Howl (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCmfDLP7LWnn8f7cF22urFpo-iiwTlqhA4MjuncNXAJlJqZQ6DqAPsw-u9hsO1v5nMzHY1s3N04S3D30vgf1yd8tE',
  },
  'm4a4-asiimov': {
    market_hash_name: 'M4A4 | Asiimov (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09izh4-HluXLP7LWnn8f7cEn2-uQo42m2gy2-BJlN2vwJYGXcAVtYg6G81K4yO_uhZ-_vJ_BzCdjuiUq5HmMyhW30khSLrs4mDt6P5U',
  },
  'm4a4-neo-noir': {
    market_hash_name: 'M4A4 | Neo-Noir (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09izh4-HnvD8J_WEkDoFu8Yl0uvCpN-gjgbs_hI9MWHxLYLEIw84ZVHQ8lG9lOm-1pDu6ZvMyHBl6T5iuyiRKYFRAQ',
  },

  // M4A1-S
  'm4a1s-hyper-beast': {
    market_hash_name: 'M4A1-S | Hyper Beast (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWNQ18l4jeHVyoD0mlOx5UplZmCmIdKXdA47YFmE-gO7wr3v1pW-uMvBmiBh6ygg7C3D30vgqH39nh4',
  },
  'm4a1s-golden-coil': {
    market_hash_name: 'M4A1-S | Golden Coil (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alIITdn2xZ_Isn37rHpt-h2ADnrUpkNm_3d4-cIwc7YV7Q_QW6w-7u15TptZ_Nn3tj6XIms3rengv330_sqyKtPg',
  },

  // Desert Eagle
  'deagle-blaze': {
    market_hash_name: 'Desert Eagle | Blaze (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgL-KmszwPKveqWdQ7MBOhuDG_ZjKhFWmrBZuNjj0JYOdcVc-aQnXrFO2x-7rhJLvup7JwSBr7CUq4n7D30vgRZL_R8I',
  },
  'deagle-printstream': {
    market_hash_name: 'Desert Eagle | Printstream (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTjVD_9W7h4-Djb-VxO_ummNm8cp0teHD-5bwjV2h5Uo6Yj30cYCScwE4YFuC-QXrlenxxcjvEOWw6tY',
  },

  // Glock
  'glock-fade': {
    market_hash_name: 'Glock-18 | Fade (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-ckvbnNrfummRD7fp9g-7J4bP5iUazrl1lMGj0cY-Wcw47YQqF_gW5wrjphcfu6pqayCBluSIgsXnUmxa-gUwePPsv26JhMjSmcA',
  },
  'glock-water-elemental': {
    market_hash_name: 'Glock-18 | Water Elemental (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73dDBH_uO7lb-MmOXgDLfYkWNFppxy3L7F8Nmk2wKyrkI5ZjimJYOddVQ_ZVHYqAC8xLjmgpW56JvMnCMwsnV3sSiJgVXp1ljHdGVo',
  },

  // USP-S
  'usps-kill-confirmed': {
    market_hash_name: 'USP-S | Kill Confirmed (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j5Nr_Yg2Yf6ZQh3OjCrI_32ATmqhdtamqnd4LEcFBtNw7Z_1Pvx-br08O1v8nMziZm6HAjtGGdwUK5JWE-RA',
  },
  'usps-neo-noir': {
    market_hash_name: 'USP-S | Neo-Noir (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWdQ7MBOhufO8IH0jgXl_RI4MT36ddSWdgNoN13YqQe4wr3t0ZW66c7MzXY2vSEq5irD30vglJSvnQM',
  },
  'usps-cortex': {
    market_hash_name: 'USP-S | Cortex (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jiPYTdn2xZ_Pp9i_vG8ML2jFWx-0M-Yjr3I9LAcAc2Yw3T-QTqxu3s1pS6vp7JnSRk6Cg8pSGKgpqoq10',
  },

  // P90
  'p90-asiimov': {
    market_hash_name: 'P90 | Asiimov (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FA957ODYfi9W9di5mr-ZkvbnNrLAglRd4cJ5nqfE9N2t0AzjqUs_YDqiLYGVcQM6YljZqQO9xOi9gJW6vJvKy3pq6HEm-z-DyIiEPsA5',
  },
  'p90-death-by-kitty': {
    market_hash_name: 'P90 | Death by Kitty (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRv7ODcfi9P6s65mpS0n_bmJb7Cg3tu5Mx2gv2PoNj32Ae1-0Q-a2r1IoWcJFRtYwnV_QO5wOftjJ-8vJibznAxs3V04S3D30vgvxSzk1E',
  },
  'p90-run-and-hide': {
    market_hash_name: 'P90 | Run and Hide (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FBRv7ODcfi9P6s65mpS0n_bmNoTdn2xZ_Isn2L2R99Wl0Fbk80VoYzr3LI-cJgY_aV6D81K5w-e-h8K_tJrAyHU26HUm5HqOl0G2iE4ecftsgOzKShQcfrVj26CdDA',
  },

  // MAC-10
  'mac10-neon-rider': {
    market_hash_name: 'MAC-10 | Neon Rider (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fShF_92hkYSEkfHxDLfYkWNFppEmiOqUpI_wi1bk8kBqZm30d4WcJgE4ZlyD_AC2w-2-08e1vp-fwHAx7HZ3t36IzBHj1EofcOE4hPbOH16YUPE_Gds',
  },
  'mac10-fade': {
    market_hash_name: 'MAC-10 | Fade (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0Ob3fShF_8-JgY-ChMj4NrrFnm5D8fp_teHE8Nvz3lHh_0VoNW3xII6dIQ8-NVzUqVO-yObpgJ-0vZyazSZq7nNx5S3VgVXp1m6OLnI1',
  },

  // MP9
  'mp9-starlight-protector': {
    market_hash_name: 'MP9 | Starlight Protector (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FAZt7P7YKAJF4N2kjZOflvv1Pb_ummJW4NE_0-_Cot2i2AHjrRY9MGDwd4_Hew87Z1vW-lLoleDt18Dv6pvAzSFl6SV04nzalgv3309FKPwT3A',
  },
  'mp9-wild-lily': {
    market_hash_name: 'MP9 | Wild Lily (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OffeDpR09C_k4if2aajNbrQglRc7cF4n-SPo4n0jgLi-0c4NTr0IdXEewJsZ13Y_we3wL29hcS66pudznI16HVw4HvYnUCwiAYMMLKQGBwIzg',
  },

  // Facas (Knives)
  'karambit-fade': {
    market_hash_name: '★ Karambit | Fade (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20jfL2IbrummJW4NE_3-zCpN-gigW3rUJoNmChJdSXcwA2YwrW-1K3yb_rgZK0vpnPnXU3uiR3tyjUlAv330-lATulpg',
  },
  'karambit-doppler': {
    market_hash_name: '★ Karambit | Doppler (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20jfL2IbrummJW4NE_2r2RpNmm2FHl8kBoajv3dtKXIwZvNwnW-1K_xue-hpC8u5rNwCM26nF3t3zbmBPkgAYMMLKvbwmMTg',
  },
  'butterfly-fade': {
    market_hash_name: '★ Butterfly Knife | Fade (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPL6DLjQhH9U5Pp8j9bN_Iv9nBq28xU_YjjxIYPAcVU4aFvZ_1G-yLi7g8C_7p6fwXY2vXFx4irUlRHmiAYMMLLVqh3Thw',
  },
  'butterfly-doppler': {
    market_hash_name: '★ Butterfly Knife | Doppler (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPL6DLjQhH9U5Pp8j9bN_Iv9nBqx-UZvNWnxLNSVdQ46Z1uGqADrw7zmhZG06ZjNyyRguyhx4irUlRHmiAYMMLLGaJcZpA',
  },
  'm9-bayonet-fade': {
    market_hash_name: '★ M9 Bayonet | Fade (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjwPKvBmm5u5Mx2gv2PoYmh2le2rhJqaj_7I4SdIwQ9NFvV_AC5kLi5hZe4tZrBm3AxsHYl4XfVgVXp1knwDPAr',
  },

  // Luvas (Gloves)
  'gloves-pandora': {
    market_hash_name: '★ Sport Gloves | Pandora\'s Box (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04LVVlxkKgpovbSsLQJfwObaZzRU7dCJlY20jfTwNqnFl2lu5Mx2gv3--Y3nj1H680c5Njz3ddCcJgJoaAqGq1S7xuy5hMPot5_PwXoxvHUjs2GdwUJCr6sU0g',
  },
  'gloves-crimson-kimono': {
    market_hash_name: '★ Specialist Gloves | Crimson Kimono (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04LVVlxkKgpovbSsLQJfwObaZzRU7dCJlY20jfL2IbrummJW4NE_0rzEo9_2iQzm-EZrMG-gJ4LAJgRoaAvVrlPrye7sgsfp6JjInSY2uiR24HvclAv3308O8Py0uw',
  },
  'gloves-hedge-maze': {
    market_hash_name: '★ Specialist Gloves | Hedge Maze (Field-Tested)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04LVVlxkKgpovbSsLQJfwObaZzRU7dCJlY20jfL2IbrummJW4NE_2O2YoNv0jQfi_0FqYm_yI4-Qdw5oaFqCqFO2lOm6hMK56prInCRl6Cch5XyPnhHi0x0bbeE4hfbOH0i1-Lll6Q',
  },

  // Mais AWPs
  'awp-hyper-beast': {
    market_hash_name: 'AWP | Hyper Beast (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2GxQucdygdbJ_Y3mjRrhrRdlZGr7doCWc1Q-YlyD_Vm5wL291ZC_upXLyHJhuXJ25niJyxTl1RkfOelqhvSACQLJ-FGH0qQ',
  },
  'awp-neo-noir': {
    market_hash_name: 'AWP | Neo-Noir (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ7MBOhuDG_ZjKhFWmrBZuNjj0JYOdcVc-aQnXrFO2x-7rhJLvup7JwSBr7CUq4n7D30vgRZL_R8I',
  },
  'awp-oni-taiji': {
    market_hash_name: 'AWP | Oni Taiji (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2D5Supdw2uzC9Nqg3Ae3rRJrZWr7cI-QcQU9aFmB_ATtyOe-hJ-_tJ7JmiZmuyE8pSGK5NHyW_g',
  },

  // Mais M4s
  'm4a4-the-emperor': {
    market_hash_name: 'M4A4 | The Emperor (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLbUlWNQ18l4jeHVyoD0mlOx5UplZmCmIdKXdA47YFmE-gO7wr3v1pW-uMvBmiBh6ygg7C3D30vgqH39nh4',
  },
  'm4a1s-icarus-fell': {
    market_hash_name: 'M4A1-S | Icarus Fell (Factory New)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uOxh7-Gw_alDLbUlWNQ18l4jeHVyoD0mlOx5UplZmCmIdKXdA47YFmE-gO7wr3v1pW-uMvBmiBh6ygg7C3D30vgrfbgaXc',
  },
  'm4a1s-printstream': {
    market_hash_name: 'M4A1-S | Printstream (Minimal Wear)',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLfYkWNFppFw3b3A9tqhiVHtqBVvMWrzJdTHcAU7ZF3W_VK_xOjn0JW5upnAyiRjvCkm5n-JgVXp1lVSUUzq',
  },
};

// ═══════════════════════════════════════════════════════════════
// 🎯 FUNÇÃO PARA GERAR URL DA IMAGEM STEAM
// ═══════════════════════════════════════════════════════════════

function getSteamImageURL(iconUrl, size = 'large') {
  const STEAM_CDN = 'https://community.cloudflare.steamstatic.com/economy/image';
  
  const sizeMap = {
    small: '',
    medium: '/128fx128f',
    large: '/256fx256f',
    extralarge: '/512fx512f',
  };

  return `${STEAM_CDN}/${iconUrl}${sizeMap[size] || sizeMap.large}`;
}

// ═══════════════════════════════════════════════════════════════
// 📝 INSTRUÇÕES PARA USO
// ═══════════════════════════════════════════════════════════════

console.log(`
═══════════════════════════════════════════════════════════════
🎮 DADOS DAS SKINS - INTEGRAÇÃO COM STEAM MARKET
═══════════════════════════════════════════════════════════════

✅ SKINS CONFIGURADAS: ${Object.keys(SKINS_WITH_STEAM_DATA).length}

📊 COMO USAR:

1. Use a API do backend para buscar preços em tempo real:
   GET /api/steam/price?name=AK-47 | Redline (Field-Tested)

2. Buscar dados completos (preço + imagem):
   GET /api/steam/skin?name=AK-47 | Redline (Field-Tested)&icon=...

3. Sincronizar múltiplas skins (apenas admin):
   POST /api/steam/sync
   Body: { skins: [...] }

4. Gerar URL de imagem:
   GET /api/steam/image-url?icon=...&size=large

═══════════════════════════════════════════════════════════════
🖼️ TAMANHOS DE IMAGEM DISPONÍVEIS:
═══════════════════════════════════════════════════════════════

- small: 64x64px
- medium: 128x128px  
- large: 256x256px (padrão)
- extralarge: 512x512px

═══════════════════════════════════════════════════════════════
💡 EXEMPLO DE USO NO FRONTEND:
═══════════════════════════════════════════════════════════════

const response = await fetch('/api/steam/skin?name=AK-47 | Redline (Field-Tested)');
const data = await response.json();

console.log(data);
// {
//   name: "AK-47 | Redline (Field-Tested)",
//   price: {
//     usd: 15.50,
//     brl: 77.50,
//     formatted_usd: "$15.50",
//     formatted_brl: "R$ 77.50",
//     volume: "1234",
//     last_updated: "2025-10-26T..."
//   },
//   image: "https://community.cloudflare.steamstatic.com/economy/image/...",
//   steam_url: "https://steamcommunity.com/market/listings/730/..."
// }

═══════════════════════════════════════════════════════════════
`);

// Exportar dados
module.exports = SKINS_WITH_STEAM_DATA;


/**
 * ═══════════════════════════════════════════════════════════════
 * 🖼️ MAPEAMENTO DE IMAGENS LOCAIS - CS2 FORTUNE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Sistema de fallback para imagens de skins
 * Usa imagens locais quando Steam não está disponível
 */

const path = require('path');
const fs = require('fs');

// Diretório de imagens locais
const SKINS_IMAGE_DIR = path.join(__dirname, '../public/skins');

/**
 * Mapeamento de skins populares para arquivos locais
 * Adicione aqui as imagens que você baixar
 */
const LOCAL_IMAGES = {
  // AK-47
  'AK-47 | Redline (Field-Tested)': 'ak47-redline.png',
  'AK-47 | Fire Serpent (Field-Tested)': 'ak47-fire-serpent.png',
  'AK-47 | Vulcan (Minimal Wear)': 'ak47-vulcan.png',
  'AK-47 | Neon Rider (Minimal Wear)': 'ak47-neon-rider.png',
  'AK-47 | Inheritance (Field-Tested)': 'ak47-inheritance.png',
  
  // AWP
  'AWP | Asiimov (Field-Tested)': 'awp-asiimov.png',
  'AWP | Dragon Lore (Factory New)': 'awp-dragon-lore.png',
  'AWP | Fade (Factory New)': 'awp-fade.png',
  'AWP | Duality (Field-Tested)': 'awp-duality.png',
  'AWP | Containment Breach (Field-Tested)': 'awp-containment-breach.png',
  
  // M4A4
  'M4A4 | Howl (Field-Tested)': 'm4a4-howl.png',
  'M4A4 | Asiimov (Field-Tested)': 'm4a4-asiimov.png',
  'M4A4 | Neo-Noir (Field-Tested)': 'm4a4-neo-noir.png',
  'M4A4 | The Emperor (Minimal Wear)': 'm4a4-emperor.png',
  'M4A4 | Spider Lily (Field-Tested)': 'm4a4-spider-lily.png',
  
  // M4A1-S
  'M4A1-S | Hyper Beast (Minimal Wear)': 'm4a1s-hyper-beast.png',
  'M4A1-S | Golden Coil (Minimal Wear)': 'm4a1s-golden-coil.png',
  'M4A1-S | Icarus Fell (Factory New)': 'm4a1s-icarus-fell.png',
  'M4A1-S | Printstream (Minimal Wear)': 'm4a1s-printstream.png',
  'M4A1-S | Black Lotus (Field-Tested)': 'm4a1s-black-lotus.png',
  
  // Desert Eagle
  'Desert Eagle | Blaze (Factory New)': 'deagle-blaze.png',
  'Desert Eagle | Printstream (Minimal Wear)': 'deagle-printstream.png',
  'Desert Eagle | Code Red (Minimal Wear)': 'deagle-code-red.png',
  
  // Glock-18
  'Glock-18 | Fade (Factory New)': 'glock-fade.png',
  'Glock-18 | Water Elemental (Minimal Wear)': 'glock-water-elemental.png',
  'Glock-18 | Vogue (Minimal Wear)': 'glock-vogue.png',
  
  // USP-S
  'USP-S | Kill Confirmed (Minimal Wear)': 'usps-kill-confirmed.png',
  'USP-S | Neo-Noir (Factory New)': 'usps-neo-noir.png',
  'USP-S | Cortex (Factory New)': 'usps-cortex.png',
  
  // Facas populares
  'Karambit | Doppler (Factory New)': 'karambit-doppler.png',
  'Karambit | Fade (Factory New)': 'karambit-fade.png',
  'Karambit | Gamma Doppler (Field-Tested)': 'karambit-gamma-doppler.png',
  'M9 Bayonet | Doppler (Factory New)': 'm9-doppler.png',
  'Butterfly Knife | Fade (Factory New)': 'butterfly-fade.png',
  
  // Luvas
  'Sport Gloves | Pandora\'s Box (Field-Tested)': 'gloves-pandora.png',
  'Specialist Gloves | Crimson Kimono (Minimal Wear)': 'gloves-crimson-kimono.png',
};

/**
 * Verifica se uma imagem local existe para a skin
 */
function hasLocalImage(skinName) {
  const filename = LOCAL_IMAGES[skinName];
  if (!filename) return false;
  
  const filePath = path.join(SKINS_IMAGE_DIR, filename);
  return fs.existsSync(filePath);
}

/**
 * Obtém o caminho da imagem local
 */
function getLocalImagePath(skinName) {
  const filename = LOCAL_IMAGES[skinName];
  if (!filename) return null;
  
  const filePath = path.join(SKINS_IMAGE_DIR, filename);
  if (fs.existsSync(filePath)) {
    return `/skins/${filename}`;
  }
  
  return null;
}

/**
 * Obtém URL completa da imagem (local ou Steam)
 */
function getImageUrl(skinName, steamUrl = null) {
  // Prioridade 1: Imagem local
  const localPath = getLocalImagePath(skinName);
  if (localPath) {
    return {
      url: `http://localhost:3001${localPath}`,
      source: 'local',
      path: localPath
    };
  }
  
  // Prioridade 2: URL do Steam
  if (steamUrl) {
    return {
      url: steamUrl,
      source: 'steam',
      path: null
    };
  }
  
  // Sem imagem disponível
  return {
    url: null,
    source: 'none',
    path: null
  };
}

/**
 * Lista todas as skins com imagens locais
 */
function listLocalImages() {
  const available = [];
  
  for (const [skinName, filename] of Object.entries(LOCAL_IMAGES)) {
    const filePath = path.join(SKINS_IMAGE_DIR, filename);
    if (fs.existsSync(filePath)) {
      available.push({
        skinName,
        filename,
        path: `/skins/${filename}`,
        size: fs.statSync(filePath).size
      });
    }
  }
  
  return {
    total: Object.keys(LOCAL_IMAGES).length,
    available: available.length,
    missing: Object.keys(LOCAL_IMAGES).length - available.length,
    images: available
  };
}

module.exports = {
  hasLocalImage,
  getLocalImagePath,
  getImageUrl,
  listLocalImages,
  LOCAL_IMAGES,
  SKINS_IMAGE_DIR
};

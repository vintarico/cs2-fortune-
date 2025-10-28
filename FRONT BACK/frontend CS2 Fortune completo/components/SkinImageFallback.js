import { useState } from 'react';

/**
 * Componente de fallback para exibir imagens genéricas de skins
 * Usado quando Steam está bloqueando requisições (429)
 */
export default function SkinImageFallback({ 
  skinName, 
  size = 'large', 
  className = '',
  showName = false,
  rarity = 'common'
}) {
  const [imageLoaded, setImageLoaded] = useState(true);

  // Determinar tipo de arma e skin
  const getWeaponInfo = () => {
    const name = skinName.toLowerCase();
    
    // Facas
    if (name.includes('knife') || name.includes('karambit') || name.includes('bayonet') || 
        name.includes('butterfly') || name.includes('★') || name.includes('navaja') ||
        name.includes('falchion') || name.includes('huntsman') || name.includes('talon') ||
        name.includes('ursus') || name.includes('stiletto')) {
      return { 
        type: 'knife', 
        icon: '🗡️',
        gradient: 'from-yellow-600 via-yellow-500 to-orange-600',
        glow: '#FFD700'
      };
    }
    
    // AWP
    if (name.includes('awp')) {
      return { 
        type: 'awp', 
        icon: '🎯',
        gradient: 'from-red-600 via-red-500 to-pink-600',
        glow: '#FF4444'
      };
    }
    
    // AK-47
    if (name.includes('ak-47') || name.includes('ak47')) {
      return { 
        type: 'ak47', 
        icon: '⚡',
        gradient: 'from-orange-600 via-red-500 to-red-600',
        glow: '#FF6600'
      };
    }
    
    // M4A4 / M4A1-S
    if (name.includes('m4a4') || name.includes('m4a1')) {
      return { 
        type: 'm4', 
        icon: '🔫',
        gradient: 'from-blue-600 via-blue-500 to-cyan-600',
        glow: '#4444FF'
      };
    }
    
    // Pistolas
    if (name.includes('glock') || name.includes('usp') || name.includes('p250') || 
        name.includes('desert eagle') || name.includes('deagle') || name.includes('five') ||
        name.includes('cz75') || name.includes('p2000') || name.includes('r8') ||
        name.includes('dual berettas')) {
      return { 
        type: 'pistol', 
        icon: '🔰',
        gradient: 'from-green-600 via-green-500 to-emerald-600',
        glow: '#44FF44'
      };
    }
    
    // SMGs
    if (name.includes('p90') || name.includes('mp9') || name.includes('mac-10') ||
        name.includes('mp7') || name.includes('mp5') || name.includes('ump') ||
        name.includes('pp-bizon')) {
      return { 
        type: 'smg', 
        icon: '💥',
        gradient: 'from-purple-600 via-purple-500 to-violet-600',
        glow: '#AA44FF'
      };
    }
    
    // Shotguns
    if (name.includes('nova') || name.includes('mag-7') || name.includes('sawed-off') ||
        name.includes('xm1014')) {
      return { 
        type: 'shotgun', 
        icon: '💢',
        gradient: 'from-orange-600 via-orange-500 to-amber-600',
        glow: '#FF8844'
      };
    }
    
    // Luvas
    if (name.includes('glove') || name.includes('luva') || name.includes('★')) {
      return { 
        type: 'gloves', 
        icon: '🧤',
        gradient: 'from-pink-600 via-pink-500 to-rose-600',
        glow: '#FF44AA'
      };
    }
    
    // Rifles
    if (name.includes('galil') || name.includes('famas') || name.includes('sg') ||
        name.includes('aug')) {
      return { 
        type: 'rifle', 
        icon: '🔫',
        gradient: 'from-indigo-600 via-indigo-500 to-blue-600',
        glow: '#4466FF'
      };
    }
    
    // Snipers
    if (name.includes('ssg') || name.includes('g3sg1') || name.includes('scar')) {
      return { 
        type: 'sniper', 
        icon: '🎯',
        gradient: 'from-red-600 via-orange-500 to-yellow-600',
        glow: '#FF6644'
      };
    }
    
    // Heavy
    if (name.includes('negev') || name.includes('m249')) {
      return { 
        type: 'heavy', 
        icon: '⚔️',
        gradient: 'from-gray-600 via-gray-500 to-slate-600',
        glow: '#888888'
      };
    }
    
    // Default
    return { 
      type: 'default', 
      icon: '🔫',
      gradient: 'from-gray-600 via-gray-500 to-gray-600',
      glow: '#AAAAAA'
    };
  };

  const weaponInfo = getWeaponInfo();

  // Cores de raridade
  const rarityColors = {
    common: '#b0c3d9',
    uncommon: '#5e98d9',
    rare: '#4b69ff',
    mythical: '#8847ff',
    legendary: '#d32ce6',
    ancient: '#eb4b4b',
    contraband: '#e4ae39',
    immortal: '#228b22'
  };

  const glowColor = rarityColors[rarity?.toLowerCase()] || weaponInfo.glow;

  return (
    <div className={`relative ${className}`}>
      {/* Container da imagem */}
      <div 
        className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}40 0%, transparent 70%)`,
          boxShadow: `0 0 30px ${glowColor}60, inset 0 0 50px ${glowColor}20`
        }}
      >
        {/* Background gradient animado */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${weaponInfo.gradient} opacity-20 animate-pulse`}
        />

        {/* Padrão hexagonal de fundo */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 10px,
                ${glowColor}20 10px,
                ${glowColor}20 11px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10px,
                ${glowColor}20 10px,
                ${glowColor}20 11px
              )
            `
          }}
        />

        {/* Ícone principal */}
        <div 
          className="relative z-10 flex flex-col items-center justify-center"
          style={{
            textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
            filter: `drop-shadow(0 0 10px ${glowColor})`
          }}
        >
          <div className="text-7xl mb-2 animate-pulse">
            {weaponInfo.icon}
          </div>
          
          {/* Indicador de tipo */}
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              background: `linear-gradient(135deg, ${glowColor}40, ${glowColor}20)`,
              border: `1px solid ${glowColor}60`,
              color: glowColor,
              boxShadow: `0 0 10px ${glowColor}40`
            }}
          >
            {weaponInfo.type}
          </div>
        </div>

        {/* Efeito de brilho animado */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300"
          style={{
            animation: 'shine 3s ease-in-out infinite'
          }}
        />

        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-60"
              style={{
                background: glowColor,
                boxShadow: `0 0 10px ${glowColor}`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Nome da skin (opcional) */}
      {showName && (
        <p 
          className="mt-2 text-center text-sm font-semibold truncate"
          style={{ color: glowColor }}
        >
          {skinName}
        </p>
      )}

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

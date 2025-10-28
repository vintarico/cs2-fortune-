import { useState } from 'react';

/**
 * Componente otimizado para exibir imagens de caixas
 * Tenta carregar imagem primeiro, depois fallback para ícone animado
 */
export default function CaseImage({ 
  caseId, 
  caseName,
  caseImage,
  color = '#a855f7',
  className = '',
  size = 'medium'
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Ícones específicos por caixa
  const getCaseIcon = (id) => {
    const icons = {
      'recoil': '📦',
      'revolution': '🎁',
      'kilowatt': '⚡',
      'fracture': '💎',
      'danger-zone': '⚠️',
      'prisma': '🌈',
      'prisma-2': '🎨',
      'cs20': '🎯',
      'shattered-web': '🕸️',
      'clutch': '🎰',
      'horizon': '🌅',
      'spectrum': '🌟',
      'spectrum-2': '✨',
      'gamma': '☢️',
      'gamma-2': '🔮',
      'chroma': '🎭',
      'chroma-2': '🎪',
      'chroma-3': '🎨',
      'glove': '🧤',
      'operation-breakout': '💥',
      'operation-phoenix': '🔥',
      'operation-vanguard': '🛡️',
      'operation-wildfire': '🌲',
      'operation-hydra': '🌊'
    };
    
    return icons[id?.toLowerCase()] || '📦';
  };

  // Gradiente baseado na cor da caixa
  const getCaseGradient = () => {
    return `linear-gradient(135deg, ${color}40 0%, ${color}10 50%, ${color}40 100%)`;
  };

  // Dimensões baseadas no tamanho
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64',
    xlarge: 'h-80'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div 
        className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center relative transition-all duration-300 hover:scale-105"
        style={{
          background: getCaseGradient(),
          boxShadow: `0 0 30px ${color}30`
        }}
      >
        {/* Ícone de fundo (sempre visível até imagem carregar) */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{
            fontSize: size === 'small' ? '4rem' : size === 'large' ? '8rem' : '6rem',
            opacity: imageLoaded && !imageError ? 0 : 0.5,
            transform: imageLoaded && !imageError ? 'scale(0.8)' : 'scale(1)'
          }}
        >
          {getCaseIcon(caseId)}
        </div>

        {/* Imagem real da caixa */}
        {caseImage && !imageError && (
          <img 
            src={caseImage}
            alt={caseName}
            className="relative z-10 w-full h-full object-contain transition-all duration-500 hover:scale-110"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transform: imageLoaded ? 'scale(1)' : 'scale(0.9)',
              filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.5))'
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            loading="lazy"
          />
        )}

        {/* Loading indicator */}
        {!imageLoaded && !imageError && caseImage && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div 
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: color, borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {/* Efeito de partículas flutuantes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute w-2 h-2 rounded-full animate-float-1"
            style={{ 
              background: color,
              opacity: 0.4,
              top: '20%',
              left: '10%'
            }}
          />
          <div 
            className="absolute w-3 h-3 rounded-full animate-float-2"
            style={{ 
              background: color,
              opacity: 0.3,
              top: '60%',
              right: '15%'
            }}
          />
          <div 
            className="absolute w-2 h-2 rounded-full animate-float-3"
            style={{ 
              background: color,
              opacity: 0.5,
              bottom: '25%',
              left: '70%'
            }}
          />
        </div>

        {/* Brilho de hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300" />
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-25px) translateX(8px); }
        }
        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

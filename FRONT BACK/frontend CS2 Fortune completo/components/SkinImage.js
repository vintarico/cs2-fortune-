import { useState, useEffect } from 'react';
import SkinImageFallback from './SkinImageFallback';
import { getSkinImage, hasSkinImage } from '../data/weapon-images';

/**
 * Componente para exibir imagens de skins
 * Prioridade: 1) Imagem local mapeada → 2) Steam API → 3) Fallback animado
 */
export default function SkinImage({ 
  skinName, 
  size = 'large', 
  className = '',
  showName = false,
  rarity = 'common'
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState(null);

  useEffect(() => {
    // PRIORIDADE 1: Verificar se tem imagem local mapeada
    const localImage = getSkinImage(skinName);
    
    if (localImage) {
      setFinalImageUrl(localImage);
      setUseFallback(false);
      setImageError(false);
      return;
    }

    // PRIORIDADE 2: Tentar buscar do Steam via backend
    const fetchFromSteam = async () => {
      try {
        const encodedName = encodeURIComponent(skinName);
        const response = await fetch(`http://localhost:3001/api/steam/skin?name=${encodedName}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.image && data.imageSource !== 'none') {
            setFinalImageUrl(data.image);
            setUseFallback(false);
            setImageError(false);
            return;
          }
        }
        
        // Se chegou aqui, não tem imagem - usar fallback
        setUseFallback(true);
        setImageError(true);
        
      } catch (error) {
        console.error(`Erro ao buscar imagem de ${skinName}:`, error);
        setUseFallback(true);
        setImageError(true);
      }
    };

    fetchFromSteam();
  }, [skinName]);

  // Se deve usar fallback gráfico
  if (useFallback || (imageError && !finalImageUrl)) {
    return (
      <SkinImageFallback
        skinName={skinName}
        size={size}
        className={className}
        showName={showName}
        rarity={rarity}
      />
    );
  }

  // Renderizar imagem real
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64'
  };

  const appliedSize = className ? '' : sizeClasses[size];

  return (
    <div className={`relative ${appliedSize} ${className}`}>
      {/* Container da imagem */}
      <div className="w-full h-full flex items-center justify-center relative">
        
        {/* Loading spinner */}
        {!imageLoaded && finalImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Imagem real */}
        {finalImageUrl && (
          <img
            src={finalImageUrl}
            alt={skinName}
            className={`
              w-full h-full object-contain
              transition-all duration-300
              ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
              imageRendering: '-webkit-optimize-contrast'
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setUseFallback(true);
            }}
            loading="lazy"
          />
        )}
      </div>

      {/* Nome da skin (opcional) */}
      {showName && (
        <p className="text-center text-xs text-gray-300 mt-2 truncate" title={skinName}>
          {skinName}
        </p>
      )}
    </div>
  );
}

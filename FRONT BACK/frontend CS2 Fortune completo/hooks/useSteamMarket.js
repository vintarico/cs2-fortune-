/**
 * ═══════════════════════════════════════════════════════════════
 * 🎮 HOOK - STEAM MARKET DATA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hook React para buscar preços e imagens da Steam Market API
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Hook para buscar dados de uma skin da Steam
 */
export function useSteamSkin(marketHashName, iconUrl = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkinData = useCallback(async () => {
    if (!marketHashName) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        name: marketHashName,
        ...(iconUrl && { icon: iconUrl }),
      });

      const response = await fetch(`${API_BASE}/api/steam/skin?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da skin');
      }

      const skinData = await response.json();
      setData(skinData);
    } catch (err) {
      console.error('Erro ao buscar skin:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [marketHashName, iconUrl]);

  useEffect(() => {
    fetchSkinData();
  }, [fetchSkinData]);

  return { data, loading, error, refetch: fetchSkinData };
}

/**
 * Hook para buscar apenas o preço de uma skin
 */
export function useSteamPrice(marketHashName) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrice = useCallback(async () => {
    if (!marketHashName) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ name: marketHashName });
      const response = await fetch(`${API_BASE}/api/steam/price?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar preço');
      }

      const priceData = await response.json();
      setPrice(priceData);
    } catch (err) {
      console.error('Erro ao buscar preço:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [marketHashName]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { price, loading, error, refetch: fetchPrice };
}

/**
 * Hook para gerar URL de imagem da Steam CDN
 */
export function useSteamImageURL(iconUrl, size = 'large') {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!iconUrl) return;

    const fetchImageURL = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ icon: iconUrl, size });
        const response = await fetch(`${API_BASE}/api/steam/image-url?${params}`);
        
        if (!response.ok) {
          throw new Error('Erro ao gerar URL da imagem');
        }

        const data = await response.json();
        setImageUrl(data.url);
      } catch (err) {
        console.error('Erro ao gerar URL:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImageURL();
  }, [iconUrl, size]);

  return { imageUrl, loading, error };
}

/**
 * Hook para sincronizar múltiplas skins (apenas admin)
 */
export function useSteamSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const syncSkins = useCallback(async (skins, token) => {
    if (!skins || !Array.isArray(skins) || skins.length === 0) {
      setError('Lista de skins inválida');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/steam/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ skins }),
      });

      if (!response.ok) {
        throw new Error('Erro ao sincronizar skins');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      console.error('Erro na sincronização:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { syncSkins, loading, error, result };
}

/**
 * Componente helper para exibir preço formatado
 */
export function SteamPrice({ marketHashName, className = '' }) {
  const { price, loading, error } = useSteamPrice(marketHashName);

  if (loading) {
    return <span className={className}>Carregando...</span>;
  }

  if (error) {
    return <span className={className}>-</span>;
  }

  if (!price) {
    return <span className={className}>-</span>;
  }

  return (
    <span className={className} title={price.formatted_usd}>
      {price.formatted_brl}
    </span>
  );
}

/**
 * Componente helper para exibir imagem da Steam
 */
export function SteamImage({ iconUrl, alt, size = 'large', className = '' }) {
  const { imageUrl, loading, error } = useSteamImageURL(iconUrl, size);

  if (loading) {
    return (
      <div className={`bg-gray-800 animate-pulse ${className}`}>
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-xs">Sem imagem</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

export default {
  useSteamSkin,
  useSteamPrice,
  useSteamImageURL,
  useSteamSync,
  SteamPrice,
  SteamImage,
};

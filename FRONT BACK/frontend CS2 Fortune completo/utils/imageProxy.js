// Função para converter URL do Steam para proxy local
export function getSteamImageProxy(steamUrl) {
  if (!steamUrl || !steamUrl.includes('steamstatic.com')) {
    return null;
  }
  
  const proxyUrl = `http://localhost:3001/api/steam-image?url=${encodeURIComponent(steamUrl)}`;
  return proxyUrl;
}

// Função para obter imagem da caixa (com fallback)
export function getCaseImageUrl(caseData) {
  if (!caseData || !caseData.image) {
    return null;
  }
  
  // Se já for uma URL do proxy, retorna direto
  if (caseData.image.includes('localhost:3001')) {
    return caseData.image;
  }
  
  // Se for URL do Steam, usa o proxy
  if (caseData.image.includes('steamstatic.com')) {
    return getSteamImageProxy(caseData.image);
  }
  
  // Caso contrário, retorna a URL original
  return caseData.image;
}

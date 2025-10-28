import { useState } from 'react';
import SkinImage from '../components/SkinImage';

export default function TestImages() {
  const [cacheStats, setCacheStats] = useState(null);
  const [clearing, setClearing] = useState(false);

  // Lista de skins para testar (apenas algumas para não sobrecarregar)
  const testSkins = [
    'AK-47 | Redline (Field-Tested)',
    'AWP | Asiimov (Field-Tested)',
    'M4A4 | Asiimov (Field-Tested)',
    'Desert Eagle | Blaze (Factory New)',
    'Glock-18 | Fade (Factory New)',
  ];

  const loadCacheStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/steam/cache-stats');
      const data = await response.json();
      setCacheStats(data);
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
    }
  };

  const clearCache = async () => {
    setClearing(true);
    try {
      const response = await fetch('http://localhost:3001/api/steam/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      alert(`Cache limpo! ${data.itemsCleared || 0} itens removidos.`);
      loadCacheStats();
    } catch (error) {
      alert('Erro ao limpar cache. Necessário estar logado como admin.');
      console.error('Erro:', error);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🖼️ Teste de Imagens das Skins
        </h1>

        {/* Controles do Cache */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">⚙️ Controle de Cache</h2>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={loadCacheStats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              📊 Ver Estatísticas
            </button>
            
            <button
              onClick={clearCache}
              disabled={clearing}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {clearing ? '⏳ Limpando...' : '🗑️ Limpar Cache'}
            </button>
          </div>

          {cacheStats && (
            <div className="bg-gray-700 rounded p-4 text-white">
              <p className="mb-2">
                <strong>Preços em cache:</strong> {cacheStats.prices.total}
              </p>
              <p className="mb-2">
                <strong>Imagens em cache:</strong> {cacheStats.images.total}
              </p>
              <p>
                <strong>Total de itens:</strong> {cacheStats.totalItems}
              </p>
            </div>
          )}
        </div>

        {/* Aviso sobre Rate Limit */}
        <div className="bg-yellow-900 border-2 border-yellow-600 rounded-lg p-4 mb-8">
          <p className="text-yellow-200">
            ⚠️ <strong>IMPORTANTE:</strong> O sistema agora tem rate limiting de 3 segundos entre requisições.
            As imagens podem demorar para carregar na primeira vez (scraping do Steam).
            Depois ficam em cache por 30 minutos.
          </p>
        </div>

        {/* Grid de Testes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testSkins.map((skinName) => (
            <div key={skinName} className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 text-center truncate" title={skinName}>
                {skinName}
              </h3>
              
              <div className="flex justify-center items-center mb-4">
                <SkinImage 
                  steamName={skinName}
                  size="large"
                  className="w-48 h-48"
                />
              </div>

              <div className="text-gray-400 text-sm text-center">
                <p>Verifique o console do backend</p>
                <p>para logs de scraping</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instruções */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">📖 Como Testar</h2>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Abra o console do navegador (F12) para ver logs do frontend</li>
            <li>Verifique o terminal do backend para logs de scraping</li>
            <li>A primeira carga de cada imagem demora (scraping)</li>
            <li>Recarregue a página - imagens em cache carregam instantaneamente</li>
            <li>Se houver erro 429 (rate limit), aguarde alguns segundos</li>
            <li>Use "Limpar Cache" para testar novamente do zero</li>
          </ol>
        </div>

        {/* Logs do Sistema */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">📋 O Que Observar</h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">✅ Funcionando corretamente:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Backend: <code className="bg-gray-700 px-2 py-1 rounded">🔍 Buscando imagem: [skin]</code></li>
                <li>Backend: <code className="bg-gray-700 px-2 py-1 rounded">🖼️ Imagem encontrada: [skin]</code></li>
                <li>Backend: <code className="bg-gray-700 px-2 py-1 rounded">⏳ Aguardando Xms para evitar rate limit</code></li>
                <li>Imagens aparecem na página</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">⚠️ Rate Limit (Normal):</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Backend: <code className="bg-gray-700 px-2 py-1 rounded">⚠️ Rate limit (429) - Tentativa X/2</code></li>
                <li>Sistema faz retry automático</li>
                <li>Espera 5s, 10s, 15s entre tentativas</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">❌ Problemas:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-gray-700 px-2 py-1 rounded">⚠️ Imagem não encontrada</code> - Skin pode não existir no Steam</li>
                <li><code className="bg-gray-700 px-2 py-1 rounded">Request failed with status code 429</code> - Steam bloqueou (aguarde)</li>
                <li>Ícone fallback aparece - Problema de scraping ou nome errado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

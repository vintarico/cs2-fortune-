import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationContext';
import Navbar from '../components/Navbar';

export default function Statistics() {
  const router = useRouter();
  const { user, token } = useUser();
  const { error, info } = useNotifications();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d'); // 24h, 7d, 30d, all
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchStatistics();
  }, [token, timeframe]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/user/statistics?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        error('Erro ao Carregar', 'Não foi possível carregar suas estatísticas.');
      }
    } catch (err) {
      error('Erro de Conexão', 'Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getTimeframeLabel = (tf) => {
    switch (tf) {
      case '24h': return 'Últimas 24h';
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case 'all': return 'Todo o tempo';
      default: return 'Últimos 7 dias';
    }
  };

  const getProfitColor = (profit) => {
    if (profit > 0) return 'text-green-400';
    if (profit < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getProfitIcon = (profit) => {
    if (profit > 0) return '📈';
    if (profit < 0) return '📉';
    return '➖';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Carregando estatísticas...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">📊 Suas Estatísticas</h1>
            <p className="text-gray-300 mb-6">Não foi possível carregar suas estatísticas.</p>
            <button
              onClick={fetchStatistics}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📊 Suas Estatísticas</h1>
          <p className="text-gray-300 text-lg">
            Acompanhe seu desempenho e progresso no CS2 Fortune
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { id: '24h', label: '24h' },
              { id: '7d', label: '7 dias' },
              { id: '30d', label: '30 dias' },
              { id: 'all', label: 'Tudo' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeframe === tf.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { id: 'overview', label: '📋 Visão Geral', icon: '📋' },
              { id: 'cases', label: '🎁 Cases', icon: '🎁' },
              { id: 'inventory', label: '🎒 Inventário', icon: '🎒' },
              { id: 'profit', label: '💰 Lucros', icon: '💰' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Principais Métricas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="text-lg font-bold text-white mb-2">Saldo Atual</h3>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats.currentBalance || 0)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-lg font-bold text-white mb-2">Cases Abertas</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.totalCasesOpened || 0}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {getTimeframeLabel(timeframe)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">💸</div>
                <h3 className="text-lg font-bold text-white mb-2">Total Gasto</h3>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(stats.totalSpent || 0)}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {getTimeframeLabel(timeframe)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">{getProfitIcon(stats.totalProfit || 0)}</div>
                <h3 className="text-lg font-bold text-white mb-2">Lucro/Prejuízo</h3>
                <p className={`text-2xl font-bold ${getProfitColor(stats.totalProfit || 0)}`}>
                  {formatCurrency(stats.totalProfit || 0)}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {getTimeframeLabel(timeframe)}
                </p>
              </div>
            </div>

            {/* Estatísticas Avançadas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Maior Ganho:</span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(stats.biggestWin || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Valor Médio por Case:</span>
                    <span className="text-blue-400 font-bold">
                      {formatCurrency(stats.averageCaseValue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Taxa de Lucro:</span>
                    <span className={`font-bold ${getProfitColor(stats.profitRate || 0)}`}>
                      {formatPercent(stats.profitRate || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sequência Atual:</span>
                    <span className="text-purple-400 font-bold">
                      {stats.currentStreak || 0} {stats.currentStreakType || ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🏆 Conquistas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Nível Atual:</span>
                    <span className="text-yellow-400 font-bold">
                      {stats.level || 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">XP Total:</span>
                    <span className="text-blue-400 font-bold">
                      {stats.totalXP || 0} XP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dias Consecutivos:</span>
                    <span className="text-green-400 font-bold">
                      {stats.consecutiveDays || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Primeiro Jogo:</span>
                    <span className="text-gray-400">
                      {stats.firstGameDate ? new Date(stats.firstGameDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">🎁 Estatísticas de Cases</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="text-lg font-bold text-white">Total Abertas</h4>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalCasesOpened || 0}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="text-lg font-bold text-white">Case Favorita</h4>
                  <p className="text-lg font-bold text-purple-400">{stats.favoriteCaseName || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💎</div>
                  <h4 className="text-lg font-bold text-white">Melhor Item</h4>
                  <p className="text-lg font-bold text-yellow-400 truncate">{stats.bestItemName || 'N/A'}</p>
                </div>
              </div>

              {stats.casesByType && Object.keys(stats.casesByType).length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">📊 Cases por Tipo</h4>
                  <div className="space-y-3">
                    {Object.entries(stats.casesByType).map(([caseName, count]) => (
                      <div key={caseName} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-300">{caseName}</span>
                        <span className="text-blue-400 font-bold">{count} vezes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">🎒 Estatísticas do Inventário</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="text-lg font-bold text-white">Total de Itens</h4>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalItemsOwned || 0}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="text-lg font-bold text-white">Valor Total</h4>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalInventoryValue || 0)}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏷️</div>
                  <h4 className="text-lg font-bold text-white">Itens Vendidos</h4>
                  <p className="text-2xl font-bold text-yellow-400">{stats.totalItemsSold || 0}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="text-lg font-bold text-white">Taxa de Retenção</h4>
                  <p className="text-2xl font-bold text-purple-400">{formatPercent(stats.retentionRate || 0)}</p>
                </div>
              </div>

              {stats.itemsByRarity && Object.keys(stats.itemsByRarity).length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">🌈 Itens por Raridade</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(stats.itemsByRarity).map(([rarity, count]) => {
                      const rarityColors = {
                        'Consumer Grade': 'text-gray-400',
                        'Industrial Grade': 'text-blue-400',
                        'Mil-Spec': 'text-blue-500',
                        'Restricted': 'text-purple-400',
                        'Classified': 'text-pink-400',
                        'Covert': 'text-red-400',
                        'Exceedingly Rare': 'text-yellow-400'
                      };
                      return (
                        <div key={rarity} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                          <span className={rarityColors[rarity] || 'text-gray-300'}>{rarity}</span>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profit Tab */}
        {activeTab === 'profit' && (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">💰 Análise de Lucros</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl mb-2">📈</div>
                  <h4 className="text-lg font-bold text-white">Lucro Total</h4>
                  <p className={`text-2xl font-bold ${getProfitColor(stats.totalProfit || 0)}`}>
                    {formatCurrency(stats.totalProfit || 0)}
                  </p>
                </div>
                <div className="text-center bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="text-lg font-bold text-white">Lucro Médio</h4>
                  <p className={`text-2xl font-bold ${getProfitColor(stats.averageProfit || 0)}`}>
                    {formatCurrency(stats.averageProfit || 0)}
                  </p>
                </div>
                <div className="text-center bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="text-lg font-bold text-white">Taxa de Lucro</h4>
                  <p className={`text-2xl font-bold ${getProfitColor(stats.profitRate || 0)}`}>
                    {formatPercent(stats.profitRate || 0)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">🏆 Melhores Resultados</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between bg-gray-700 rounded-lg p-3">
                      <span className="text-gray-300">Maior Ganho:</span>
                      <span className="text-green-400 font-bold">{formatCurrency(stats.biggestWin || 0)}</span>
                    </div>
                    <div className="flex justify-between bg-gray-700 rounded-lg p-3">
                      <span className="text-gray-300">Maior Sequência:</span>
                      <span className="text-blue-400 font-bold">{stats.bestStreak || 0} vitórias</span>
                    </div>
                    <div className="flex justify-between bg-gray-700 rounded-lg p-3">
                      <span className="text-gray-300">Melhor Dia:</span>
                      <span className="text-purple-400 font-bold">{formatCurrency(stats.bestDay || 0)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-4">📉 Riscos</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between bg-gray-700 rounded-lg p-3">
                      <span className="text-gray-300">Maior Perda:</span>
                      <span className="text-red-400 font-bold">{formatCurrency(Math.abs(stats.biggestLoss || 0))}</span>
                    </div>
                    <div className="flex justify-between bg-gray-700 rounded-lg p-3">
                      <span className="text-gray-300">Sequência de Perdas:</span>
                      <span className="text-red-400 font-bold">{stats.worstStreak || 0}</span>
                    </div>
                    <div className="flex justify-between bg-gray-700 rounded-lg p-3">
                      <span className="text-gray-300">Pior Dia:</span>
                      <span className="text-red-400 font-bold">{formatCurrency(Math.abs(stats.worstDay || 0))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Dados atualizados em tempo real • {getTimeframeLabel(timeframe)}
          </p>
          <button
            onClick={fetchStatistics}
            className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
          >
            🔄 Atualizar Dados
          </button>
        </div>
      </div>
    </div>
  );
}
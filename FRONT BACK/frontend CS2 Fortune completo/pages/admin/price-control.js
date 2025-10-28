// ═══════════════════════════════════════════════════════════════
// 🎛️ PAINEL ADMIN - CONTROLE DE PREÇOS
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminPriceControl() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [cronStats, setCronStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
    fetchCronStats(storedToken);
    fetchAlerts(storedToken, threshold);
  }, []);

  const fetchCronStats = async (authToken) => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/cron-stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setCronStats(data);
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
    }
  };

  const fetchAlerts = async (authToken, thresholdValue) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/price-alerts?threshold=${thresholdValue}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    }
  };

  const handleForceUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/admin/force-update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      alert(`✅ Atualização concluída!\n${data.successful}/${data.total} skins atualizadas`);
      fetchCronStats(token);
      fetchAlerts(token, threshold);
    } catch (error) {
      alert('❌ Erro ao atualizar preços');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/steam/clear-cache', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await res.json();
      alert('✅ Cache limpo com sucesso!');
    } catch (error) {
      alert('❌ Erro ao limpar cache');
    }
  };

  const handleCleanHistory = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/clean-history', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      alert(`✅ ${data.pointsRemoved} pontos antigos removidos`);
    } catch (error) {
      alert('❌ Erro ao limpar histórico');
    }
  };

  const handleRefreshAlerts = () => {
    fetchAlerts(token, threshold);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Simple Navbar */}
      <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            🎮 CS2 Fortune
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition">
            ← Voltar
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          🎛️ Painel Admin - Controle de Preços
        </h1>

        {/* Estatísticas do Cronjob */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Status</div>
            <div className="text-2xl font-bold text-white">
              {cronStats?.isRunning ? (
                <span className="text-yellow-400">⏳ Em execução</span>
              ) : (
                <span className="text-green-400">✅ Ativo</span>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Última Atualização</div>
            <div className="text-lg font-bold text-white">
              {cronStats?.lastUpdate
                ? new Date(cronStats.lastUpdate).toLocaleString('pt-BR')
                : 'Nunca'}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Total de Atualizações</div>
            <div className="text-2xl font-bold text-white">
              {cronStats?.totalUpdates || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ✅ {cronStats?.successfulUpdates || 0} | ❌{' '}
              {cronStats?.failedUpdates || 0}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Próxima Atualização</div>
            <div className="text-lg font-bold text-white">
              {cronStats?.nextUpdate
                ? new Date(cronStats.nextUpdate).toLocaleTimeString('pt-BR')
                : '--:--'}
            </div>
          </div>
        </div>

        {/* Ações de Controle */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">⚙️ Ações de Controle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleForceUpdate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '⏳ Atualizando...' : '🔄 Forçar Atualização'}
            </button>

            <button
              onClick={handleClearCache}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              🧹 Limpar Cache
            </button>

            <button
              onClick={handleCleanHistory}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              🗑️ Limpar Histórico Antigo
            </button>
          </div>
        </div>

        {/* Alertas de Mudança de Preço */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              🚨 Alertas de Mudança de Preço
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Threshold:</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="bg-slate-700 text-white px-3 py-1 rounded w-20"
                  min="1"
                  max="100"
                />
                <span className="text-gray-400">%</span>
              </div>
              <button
                onClick={handleRefreshAlerts}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              ✅ Nenhuma mudança significativa detectada
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.direction === 'up'
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{alert.skinName}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        R$ {alert.oldPrice.toFixed(2)} → R${' '}
                        {alert.newPrice.toFixed(2)}
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        alert.direction === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {alert.direction === 'up' ? '↗' : '↘'}{' '}
                      {Math.abs(alert.changePercent).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

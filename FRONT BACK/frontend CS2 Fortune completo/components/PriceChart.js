// ═══════════════════════════════════════════════════════════════
// 📊 COMPONENTE DE GRÁFICO DE PREÇOS
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ skinName, hours = 24, className = '' }) {
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!skinName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar histórico
        const historyRes = await fetch(
          `http://localhost:3001/api/price-history/${encodeURIComponent(skinName)}?hours=${hours}`
        );
        const historyData = await historyRes.json();

        // Buscar estatísticas
        const statsRes = await fetch(
          `http://localhost:3001/api/price-stats/${encodeURIComponent(skinName)}?hours=${hours}`
        );
        const statsData = await statsRes.json();

        if (historyData.history && historyData.history.length > 0) {
          // Preparar dados para o gráfico
          const labels = historyData.history.map((point) => {
            const date = new Date(point.timestamp);
            return date.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });
          });

          const prices = historyData.history.map((point) => point.brl);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Preço (R$)',
                data: prices,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 5,
              },
            ],
          });

          setStats(statsData.stats);
        } else {
          setError('Sem dados de histórico disponíveis');
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [skinName, hours]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `R$ ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function (value) {
            return `R$ ${value.toFixed(0)}`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className={`bg-slate-800/50 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-800/50 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64 text-gray-400">
          {error}
        </div>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg p-6 ${className}`}>
      {/* Header com estatísticas */}
      {stats && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Atual</div>
            <div className="text-lg font-bold text-white">
              R$ {stats.current.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Média ({stats.period})</div>
            <div className="text-lg font-bold text-gray-300">
              R$ {stats.avg.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Mínimo</div>
            <div className="text-lg font-bold text-green-400">
              R$ {stats.min.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Máximo</div>
            <div className="text-lg font-bold text-red-400">
              R$ {stats.max.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Variação percentual */}
      {stats && stats.changePercent !== 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-400">Variação ({stats.period}):</span>
          <span
            className={`text-sm font-bold ${
              stats.changePercent > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {stats.changePercent > 0 ? '+' : ''}
            {stats.changePercent.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Gráfico */}
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {chartData.labels.length} pontos de dados • Atualização a cada 30 minutos
      </div>
    </div>
  );
}

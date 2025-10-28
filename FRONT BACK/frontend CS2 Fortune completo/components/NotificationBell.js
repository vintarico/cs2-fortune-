// ═══════════════════════════════════════════════════════════════
// 🔔 COMPONENTE DE NOTIFICAÇÕES
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

export default function NotificationBell({ className = '' }) {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Atualiza a cada 2 minutos
    const interval = setInterval(() => {
      fetchNotifications();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/api/notifications?limit=10', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      await fetch('http://localhost:3001/api/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_increase':
        return '📈';
      case 'price_decrease':
        return '📉';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'price_increase':
        return 'text-green-400';
      case 'price_decrease':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Menos de 1 minuto
    if (diff < 60000) return 'Agora';
    
    // Menos de 1 hora
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m atrás`;
    }
    
    // Menos de 24 horas
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h atrás`;
    }
    
    // Mais de 24 horas
    const days = Math.floor(diff / 86400000);
    return `${days}d atrás`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-300 hover:text-white transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge de não lidas */}
        {stats && stats.unread > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {stats.unread > 9 ? '9+' : stats.unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Overlay para fechar */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Conteúdo do dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl z-20 border border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-white font-bold">🔔 Notificações</h3>
              {stats && stats.unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  {loading ? 'Marcando...' : 'Marcar todas como lidas'}
                </button>
              )}
            </div>

            {/* Lista de notificações */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  ✅ Nenhuma notificação
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition ${
                      !notification.read ? 'bg-slate-700/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium mb-1">
                          {notification.skinName}
                        </div>
                        <div className={`text-sm ${getNotificationColor(notification.type)}`}>
                          R$ {notification.data.oldPrice.toFixed(2)} →{' '}
                          R$ {notification.data.newPrice.toFixed(2)}
                          <span className="ml-2 font-bold">
                            ({notification.data.changePercent > 0 ? '+' : ''}
                            {notification.data.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {stats && (
              <div className="p-3 bg-slate-900/50 text-xs text-gray-400 text-center">
                {stats.total} notificações • {stats.unread} não lidas
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

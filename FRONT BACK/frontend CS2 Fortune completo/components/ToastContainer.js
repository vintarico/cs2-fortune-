import { useNotifications } from '../contexts/NotificationContext';
import { useState, useEffect } from 'react';

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleRemove = (id) => {
    // Animação de saída
    setVisibleNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRemoving: true } : notif
      )
    );
    
    // Remove após animação
    setTimeout(() => {
      removeNotification(id);
    }, 300);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'success': 
        return 'bg-green-800 border-green-600 text-green-100';
      case 'error': 
        return 'bg-red-800 border-red-600 text-red-100';
      case 'warning': 
        return 'bg-yellow-800 border-yellow-600 text-yellow-100';
      case 'info': 
        return 'bg-blue-800 border-blue-600 text-blue-100';
      default: 
        return 'bg-gray-800 border-gray-600 text-gray-100';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            transform transition-all duration-300 ease-in-out
            ${notification.isRemoving 
              ? 'translate-x-full opacity-0' 
              : 'translate-x-0 opacity-100'
            }
          `}
        >
          <div
            className={`
              rounded-lg border-l-4 p-4 shadow-lg backdrop-blur-sm
              ${getColorClasses(notification.type)}
              hover:shadow-xl transition-shadow cursor-pointer
            `}
            onClick={() => handleRemove(notification.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-xl">{getIcon(notification.type)}</span>
              </div>
              
              <div className="ml-3 flex-1">
                {notification.title && (
                  <h4 className="text-sm font-bold mb-1">
                    {notification.title}
                  </h4>
                )}
                
                {notification.message && (
                  <p className="text-sm opacity-90">
                    {notification.message}
                  </p>
                )}
                
                {notification.action && (
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        notification.action.onClick();
                        handleRemove(notification.id);
                      }}
                      className="text-xs bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>

              <div className="ml-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(notification.id);
                  }}
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

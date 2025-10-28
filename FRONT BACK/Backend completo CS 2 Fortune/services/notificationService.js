// ═══════════════════════════════════════════════════════════════
// 🔔 SISTEMA DE NOTIFICAÇÕES DE PREÇOS
// ═══════════════════════════════════════════════════════════════

const priceHistory = require('./priceHistory');
const SKINS_WITH_STEAM_DATA = require('../data/skins-steam-data');

// Armazena notificações em memória
let notifications = [];
const MAX_NOTIFICATIONS = 100;

// Configurações
const DEFAULT_THRESHOLD = 10; // 10% de mudança
const CHECK_INTERVAL = 1000 * 60 * 30; // 30 minutos

/**
 * Tipos de notificação
 */
const NotificationType = {
  PRICE_INCREASE: 'price_increase',
  PRICE_DECREASE: 'price_decrease',
  PRICE_ALERT: 'price_alert',
};

/**
 * Cria uma notificação
 */
function createNotification(type, skinName, data) {
  const notification = {
    id: Date.now() + Math.random(),
    type,
    skinName,
    data,
    timestamp: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(notification);

  // Limita o número de notificações
  if (notifications.length > MAX_NOTIFICATIONS) {
    notifications = notifications.slice(0, MAX_NOTIFICATIONS);
  }

  console.log(`🔔 [NOTIFICATION] ${type}: ${skinName} - ${JSON.stringify(data)}`);
  return notification;
}

/**
 * Verifica mudanças de preço e cria notificações
 */
function checkPriceChanges(threshold = DEFAULT_THRESHOLD) {
  console.log('🔍 [NOTIFICATION] Verificando mudanças de preço...');
  
  const newNotifications = [];

  for (const skinId in SKINS_WITH_STEAM_DATA) {
    const skin = SKINS_WITH_STEAM_DATA[skinId];
    const change = priceHistory.detectPriceChanges(skin.market_hash_name, threshold);

    if (change) {
      const type =
        change.direction === 'up'
          ? NotificationType.PRICE_INCREASE
          : NotificationType.PRICE_DECREASE;

      const notification = createNotification(type, change.skinName, {
        oldPrice: change.oldPrice,
        newPrice: change.newPrice,
        changePercent: change.changePercent,
        direction: change.direction,
      });

      newNotifications.push(notification);
    }
  }

  if (newNotifications.length > 0) {
    console.log(`✅ [NOTIFICATION] ${newNotifications.length} novas notificações criadas`);
  }

  return newNotifications;
}

/**
 * Inicia verificação automática
 */
function startNotificationService() {
  console.log('🔔 [NOTIFICATION] Serviço de notificações iniciado');
  
  // Primeira verificação após 1 minuto
  setTimeout(() => {
    checkPriceChanges();
  }, 60000);

  // Verificações periódicas
  setInterval(() => {
    checkPriceChanges();
  }, CHECK_INTERVAL);
}

/**
 * Obtém todas as notificações
 */
function getNotifications(limit = 50, unreadOnly = false) {
  let filtered = notifications;

  if (unreadOnly) {
    filtered = notifications.filter((n) => !n.read);
  }

  return filtered.slice(0, limit);
}

/**
 * Marca notificação como lida
 */
function markAsRead(notificationId) {
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
}

/**
 * Marca todas como lidas
 */
function markAllAsRead() {
  notifications.forEach((n) => {
    n.read = true;
  });
  return notifications.length;
}

/**
 * Limpa notificações antigas
 */
function clearOldNotifications(daysOld = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  const before = notifications.length;
  notifications = notifications.filter((n) => {
    return new Date(n.timestamp) >= cutoff;
  });

  const removed = before - notifications.length;
  if (removed > 0) {
    console.log(`🧹 [NOTIFICATION] ${removed} notificações antigas removidas`);
  }

  return removed;
}

/**
 * Obtém estatísticas de notificações
 */
function getNotificationStats() {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;
  
  const byType = {};
  notifications.forEach((n) => {
    byType[n.type] = (byType[n.type] || 0) + 1;
  });

  return {
    total,
    unread,
    read: total - unread,
    byType,
  };
}

/**
 * Cria alerta customizado para uma skin específica
 */
function createCustomAlert(skinName, threshold, userId = null) {
  // Placeholder para funcionalidade futura de alertas por usuário
  console.log(`🔔 [NOTIFICATION] Alerta criado: ${skinName} @ ${threshold}%`);
  
  return {
    skinName,
    threshold,
    userId,
    createdAt: new Date().toISOString(),
  };
}

// Limpeza automática a cada 24 horas
setInterval(() => {
  clearOldNotifications();
}, 24 * 60 * 60 * 1000);

module.exports = {
  startNotificationService,
  checkPriceChanges,
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearOldNotifications,
  getNotificationStats,
  createCustomAlert,
  NotificationType,
};

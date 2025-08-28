// Push Notifications Utility for BabyChic
class NotificationService {
  constructor() {
    this.permission = 'default'
    this.registration = null
    this.init()
  }

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }

    // Register service worker for PWA notifications
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      console.warn('Notifications are denied by user')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  async showNotification(title, options = {}) {
    const hasPermission = await this.requestPermission()
    if (!hasPermission) {
      return false
    }

    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'Voir',
          icon: '/pwa-192x192.png'
        },
        {
          action: 'dismiss',
          title: 'Ignorer'
        }
      ]
    }

    const notificationOptions = { ...defaultOptions, ...options }

    try {
      if (this.registration && this.registration.showNotification) {
        // Use service worker notification for PWA
        await this.registration.showNotification(title, notificationOptions)
      } else {
        // Fallback to simple notification
        new Notification(title, notificationOptions)
      }
      return true
    } catch (error) {
      console.error('Error showing notification:', error)
      return false
    }
  }

  // Predefined notification types for BabyChic
  async notifyNewProduct(productName, productPrice) {
    return this.showNotification('🆕 Nouveau Produit !', {
      body: `${productName} est maintenant disponible pour ${productPrice?.toLocaleString()} FCFA`,
      tag: 'new-product',
      data: { type: 'new-product', productName }
    })
  }

  async notifyPromotion(title, description, discount) {
    return this.showNotification(`🔥 Promotion ${discount}% !`, {
      body: `${title} - ${description}`,
      tag: 'promotion',
      data: { type: 'promotion', discount }
    })
  }

  async notifyOrderUpdate(orderNumber, status) {
    const statusMessages = {
      'processing': 'Votre commande est en préparation',
      'shipped': 'Votre commande a été expédiée',
      'delivered': 'Votre commande a été livrée'
    }

    return this.showNotification(`📦 Commande #${orderNumber}`, {
      body: statusMessages[status] || 'Mise à jour de votre commande',
      tag: `order-${orderNumber}`,
      data: { type: 'order-update', orderNumber, status }
    })
  }

  async notifyNewsletter(title, message) {
    return this.showNotification(`📧 ${title}`, {
      body: message,
      tag: 'newsletter',
      data: { type: 'newsletter' }
    })
  }

  async notifyStockAlert(productName) {
    return this.showNotification('🔔 Produit de nouveau en stock !', {
      body: `${productName} est de nouveau disponible`,
      tag: 'stock-alert',
      data: { type: 'stock-alert', productName }
    })
  }

  // Handle notification clicks
  setupNotificationHandlers() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'notification-click') {
          this.handleNotificationClick(event.data.notification)
        }
      })
    }
  }

  handleNotificationClick(notificationData) {
    const { type, productName, orderNumber } = notificationData

    switch (type) {
      case 'new-product':
      case 'stock-alert':
        // Navigate to catalog or specific product
        if (window.location.pathname !== '/catalog') {
          window.location.href = '/catalog'
        }
        break
      
      case 'promotion':
        // Navigate to promotions or home
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
        break
      
      case 'order-update':
        // Navigate to order tracking (when implemented)
        console.log(`Navigate to order ${orderNumber}`)
        break
      
      case 'newsletter':
        // Navigate to home or specific newsletter content
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
        break
      
      default:
        console.log('Unknown notification type:', type)
    }
  }

  // Utility to check if notifications are enabled
  isEnabled() {
    return this.permission === 'granted'
  }

  // Utility to get permission status
  getPermissionStatus() {
    return this.permission
  }
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService

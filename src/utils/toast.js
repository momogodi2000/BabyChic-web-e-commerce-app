/**
 * Advanced Toast Notification System
 * Provides user-friendly notifications with different types and actions
 */

class ToastManager {
  constructor() {
    this.toasts = []
    this.container = null
    this.maxToasts = 5
    this.defaultDuration = 4000
    this.init()
  }

  init() {
    // Create toast container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = 'toast-container'
      this.container.className = 'fixed top-4 right-4 z-50 space-y-2'
      document.body.appendChild(this.container)
    }
  }

  show(message, type = 'info', options = {}) {
    const toast = {
      id: Date.now() + Math.random(),
      message,
      type,
      duration: options.duration || this.defaultDuration,
      action: options.action || null,
      persistent: options.persistent || false,
      created: Date.now()
    }

    this.toasts.push(toast)
    this.render(toast)

    // Auto-remove non-persistent toasts
    if (!toast.persistent) {
      setTimeout(() => {
        this.remove(toast.id)
      }, toast.duration)
    }

    // Limit number of toasts
    if (this.toasts.length > this.maxToasts) {
      const oldestToast = this.toasts[0]
      this.remove(oldestToast.id)
    }

    return toast.id
  }

  render(toast) {
    const toastElement = document.createElement('div')
    toastElement.id = `toast-${toast.id}`
    toastElement.className = this.getToastClasses(toast.type)

    const icon = this.getIcon(toast.type)
    const actionButton = toast.action ? 
      `<button onclick="window.toastManager.handleAction('${toast.id}')" 
        class="ml-3 text-sm font-medium text-blue-600 hover:text-blue-500">
        ${toast.action.text}
      </button>` : ''

    toastElement.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${icon}
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">${toast.message}</p>
          ${actionButton}
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button onclick="window.toastManager.remove('${toast.id}')" 
            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
            <span class="sr-only">Fermer</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `

    // Add entrance animation
    toastElement.style.transform = 'translateX(100%)'
    toastElement.style.opacity = '0'
    this.container.appendChild(toastElement)

    // Trigger animation
    requestAnimationFrame(() => {
      toastElement.style.transition = 'all 0.3s ease-out'
      toastElement.style.transform = 'translateX(0)'
      toastElement.style.opacity = '1'
    })
  }

  remove(toastId) {
    const toastElement = document.getElementById(`toast-${toastId}`)
    if (toastElement) {
      // Exit animation
      toastElement.style.transition = 'all 0.3s ease-in'
      toastElement.style.transform = 'translateX(100%)'
      toastElement.style.opacity = '0'

      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement)
        }
      }, 300)
    }

    // Remove from array
    this.toasts = this.toasts.filter(toast => toast.id !== toastId)
  }

  handleAction(toastId) {
    const toast = this.toasts.find(t => t.id === toastId)
    if (toast && toast.action && toast.action.handler) {
      toast.action.handler()
      this.remove(toastId)
    }
  }

  getToastClasses(type) {
    const baseClasses = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
    
    const typeClasses = {
      success: 'border-l-4 border-green-400',
      error: 'border-l-4 border-red-400',
      warning: 'border-l-4 border-yellow-400',
      info: 'border-l-4 border-blue-400'
    }

    return `${baseClasses} ${typeClasses[type] || typeClasses.info} p-4`
  }

  getIcon(type) {
    const icons = {
      success: `
        <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
      error: `
        <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
      warning: `
        <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.694-.833-3.464 0l-6.928 12c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      `,
      info: `
        <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `
    }

    return icons[type] || icons.info
  }

  // Convenience methods
  success(message, options = {}) {
    return this.show(message, 'success', options)
  }

  error(message, options = {}) {
    return this.show(message, 'error', { duration: 6000, ...options })
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', options)
  }

  info(message, options = {}) {
    return this.show(message, 'info', options)
  }

  // Clear all toasts
  clear() {
    this.toasts.forEach(toast => this.remove(toast.id))
  }
}

// Create global instance
const toastManager = new ToastManager()

// Make it globally available
window.toastManager = toastManager
window.showToast = (message, type, options) => toastManager.show(message, type, options)

// Export for ES modules
export const toast = {
  show: (message, type, options) => toastManager.show(message, type, options),
  success: (message, options) => toastManager.success(message, options),
  error: (message, options) => toastManager.error(message, options),
  warning: (message, options) => toastManager.warning(message, options),
  info: (message, options) => toastManager.info(message, options),
  clear: () => toastManager.clear()
}

export default toastManager

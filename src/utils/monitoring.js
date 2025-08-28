/**
 * Monitoring and Analytics Setup
 * Integrates error tracking, performance monitoring, and business analytics
 */

// Sentry setup
let Sentry = null
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/browser').then((sentryModule) => {
    Sentry = sentryModule
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
      beforeSend(event) {
        // Filter out development errors
        if (import.meta.env.DEV && event.exception) {
          console.log('Sentry would send:', event)
          return null // Don't send in dev
        }
        return event
      }
    })
  })
}

// Basic analytics implementation
class Analytics {
  constructor() {
    this.events = []
    this.sessionId = this.generateSessionId()
    this.init()
  }

  init() {
    // Setup Google Analytics if available
    if (import.meta.env.VITE_GA_MEASUREMENT_ID && typeof gtag !== 'undefined') {
      gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID)
    }

    // Track session start
    this.track('session_start', {
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    })
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  track(eventName, properties = {}) {
    const event = {
      event: eventName,
      timestamp: Date.now(),
      session_id: this.sessionId,
      url: window.location.href,
      ...properties
    }

    this.events.push(event)

    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        custom_parameter_1: JSON.stringify(properties),
        event_timestamp: event.timestamp
      })
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event)
    }

    // Send to backend analytics endpoint in production
    if (import.meta.env.PROD) {
      this.sendToBackend(event)
    }
  }

  async sendToBackend(event) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
    }
  }

  // E-commerce specific tracking
  trackPurchase(order) {
    this.track('purchase', {
      order_id: order.id,
      order_number: order.order_number,
      total_amount: order.total_amount,
      currency: order.currency,
      items: order.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    })
  }

  trackProductView(product) {
    this.track('product_view', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      category: product.category
    })
  }

  trackAddToCart(product, quantity) {
    this.track('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      quantity: quantity
    })
  }

  trackSearch(query, resultsCount) {
    this.track('search', {
      search_query: query,
      results_count: resultsCount
    })
  }

  // Performance tracking
  trackPageLoad(pageName, loadTime) {
    this.track('page_load', {
      page_name: pageName,
      load_time_ms: loadTime
    })
  }

  // User engagement
  trackEngagement(action, target) {
    this.track('user_engagement', {
      action: action,
      target: target,
      page: window.location.pathname
    })
  }
}

// A/B Testing utility
class ABTesting {
  constructor() {
    this.experiments = new Map()
    this.userId = this.getUserId()
  }

  getUserId() {
    let userId = localStorage.getItem('ab_user_id')
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('ab_user_id', userId)
    }
    return userId
  }

  defineExperiment(experimentName, variants, distribution = null) {
    if (!distribution) {
      // Equal distribution by default
      const weight = 1 / variants.length
      distribution = variants.reduce((acc, variant) => {
        acc[variant] = weight
        return acc
      }, {})
    }

    this.experiments.set(experimentName, {
      variants,
      distribution,
      assignedVariant: this.assignVariant(experimentName, variants, distribution)
    })
  }

  assignVariant(experimentName, variants, distribution) {
    // Use user ID for consistent assignment
    const hash = this.hashCode(this.userId + experimentName)
    const randomValue = Math.abs(hash) % 1000 / 1000

    let cumulativeWeight = 0
    for (const [variant, weight] of Object.entries(distribution)) {
      cumulativeWeight += weight
      if (randomValue <= cumulativeWeight) {
        // Track experiment participation
        analytics.track('experiment_participation', {
          experiment_name: experimentName,
          variant: variant,
          user_id: this.userId
        })
        return variant
      }
    }

    return variants[0] // Fallback
  }

  getVariant(experimentName) {
    const experiment = this.experiments.get(experimentName)
    return experiment ? experiment.assignedVariant : null
  }

  hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash
  }
}

// Feature flags
class FeatureFlags {
  constructor() {
    this.flags = new Map()
    this.loadFlags()
  }

  async loadFlags() {
    try {
      // Load from environment variables
      const envFlags = {
        VOICE_SEARCH: import.meta.env.VITE_ENABLE_VOICE_SEARCH === 'true',
        PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
        ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false'
      }

      // Load from remote config in production
      if (import.meta.env.PROD) {
        const response = await fetch('/api/config/feature-flags')
        const remoteFlags = await response.json()
        Object.assign(envFlags, remoteFlags)
      }

      Object.entries(envFlags).forEach(([key, value]) => {
        this.flags.set(key, value)
      })
    } catch (error) {
      console.warn('Failed to load feature flags:', error)
    }
  }

  isEnabled(flagName) {
    return this.flags.get(flagName) === true
  }

  enable(flagName) {
    this.flags.set(flagName, true)
  }

  disable(flagName) {
    this.flags.set(flagName, false)
  }
}

// Error reporting utilities
const reportError = (error, context = {}) => {
  // Log to error handler
  if (window.errorHandler) {
    window.errorHandler.logError(error, context)
  }

  // Track in analytics
  if (analytics) {
    analytics.track('application_error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    })
  }

  // Send to Sentry if available
  if (Sentry) {
    Sentry.captureException(error, { extra: context })
  }
}

// Initialize services
const analytics = new Analytics()
const abTesting = new ABTesting()
const featureFlags = new FeatureFlags()

// Global access
window.analytics = analytics
window.abTesting = abTesting
window.featureFlags = featureFlags

export { analytics, abTesting, featureFlags, reportError }
export default { analytics, abTesting, featureFlags }

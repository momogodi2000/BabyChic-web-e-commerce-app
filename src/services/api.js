import axios from 'axios'
import errorHandler from '../utils/errorHandler'
import performanceMonitor from '../utils/performance'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Simple cache implementation
class APICache {
  constructor() {
    this.cache = new Map()
    this.maxAge = 5 * 60 * 1000 // 5 minutes
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clear() {
    this.cache.clear()
  }
}

const apiCache = new APICache()

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor with performance monitoring and caching
api.interceptors.request.use(
  (config) => {
    // Add performance marking
    const operationName = `api-${config.method}-${config.url}`
    performanceMonitor.markStart(operationName)
    config.metadata = { operationName, startTime: Date.now() }

    // Add auth token
    const token = localStorage.getItem('babychic-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Check cache for GET requests
    if (config.method === 'get' && !config.skipCache) {
      const cacheKey = `${config.url}-${JSON.stringify(config.params || {})}`
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        // Return cached data as a resolved promise
        return Promise.reject({
          cached: true,
          data: cachedData,
          config
        })
      }
      config.cacheKey = cacheKey
    }

    return config
  },
  (error) => {
    errorHandler.logError(error, { type: 'api_request_error' })
    return Promise.reject(error)
  }
)

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    // End performance marking
    if (response.config.metadata) {
      performanceMonitor.markEnd(response.config.metadata.operationName)
    }

    // Cache successful GET responses
    if (response.config.method === 'get' && response.config.cacheKey) {
      apiCache.set(response.config.cacheKey, response.data)
    }

    return response
  },
  (error) => {
    // Handle cached responses
    if (error.cached) {
      return Promise.resolve({
        data: error.data,
        status: 200,
        config: error.config,
        cached: true
      })
    }

    // End performance marking for errors
    if (error.config?.metadata) {
      performanceMonitor.markEnd(error.config.metadata.operationName)
    }

    // Enhanced error handling
    const apiError = errorHandler.handleApiError(error)
    
    // Special handling for auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('babychic-token')
      localStorage.removeItem('user_data')
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }

    // Rate limiting handling
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`)
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: (token) => api.post('/auth/verify', { token }),
}

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (formData) => api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Orders API
export const ordersAPI = {
  create: (order) => api.post('/orders', order),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  validatePayment: (id) => api.patch(`/orders/${id}/payment/validate`),
  getStats: () => api.get('/orders/stats'),
}

// Payments API
export const paymentsAPI = {
  initiate: (paymentData) => api.post('/payments/initiate', paymentData),
  verify: (transactionId) => api.post('/payments/verify', { transactionId }),
  webhook: (data) => api.post('/payments/webhook', data),
}

// Contact API
export const contactAPI = {
  getAll: (params = {}) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  delete: (id) => api.delete(`/contacts/${id}`),
  markAsRead: (id) => api.patch(`/contacts/${id}/read`),
  reply: (id, reply) => api.post(`/contacts/${id}/reply`, reply),
}

// Newsletter API
export const newsletterAPI = {
  getSubscribers: (params = {}) => api.get('/newsletter/subscribers', { params }),
  deleteSubscriber: (id) => api.delete(`/newsletter/subscribers/${id}`),
  sendNewsletter: (data) => api.post('/newsletter/send', data),
  getStats: () => api.get('/newsletter/stats'),
}

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (settings) => api.put('/settings', settings),
  updateLogo: (formData) => api.post('/settings/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSEO: (seoData) => api.put('/settings/seo', seoData),
}

// Public API (no auth required)
export const publicAPI = {
  getProducts: (params = {}) => axios.get(`${API_BASE_URL}/public/products`, { params }),
  getProduct: (id) => axios.get(`${API_BASE_URL}/public/products/${id}`),
  getCategories: () => axios.get(`${API_BASE_URL}/public/categories`),
  createOrder: (order) => axios.post(`${API_BASE_URL}/public/orders`, order),
  submitContactForm: (data) => axios.post(`${API_BASE_URL}/public/contact`, data),
  subscribeNewsletter: (email) => axios.post(`${API_BASE_URL}/public/newsletter/subscribe`, { email }),
  unsubscribeNewsletter: (email, reason) => axios.post(`${API_BASE_URL}/public/newsletter/unsubscribe`, { email, reason }),
}

export default api

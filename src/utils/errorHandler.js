/**
 * Enhanced Error Handling System
 * Provides centralized error handling with logging and user feedback
 */

class ErrorHandler {
  constructor() {
    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  logError(error, context = {}) {
    const errorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    };

    // Console logging for development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorInfo);
    }

    // Send to monitoring service (e.g., Sentry) in production
    if (import.meta.env.PROD && window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context
      });
    }

    return errorInfo;
  }

  handleApiError(error, fallbackMessage = 'Une erreur est survenue') {
    let message = fallbackMessage;
    let details = null;

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          message = data.message || 'Données invalides';
          details = data.details;
          break;
        case 401:
          message = 'Authentification requise';
          // Redirect to login or refresh token
          this.handleAuthenticationError();
          break;
        case 403:
          message = 'Accès interdit';
          break;
        case 404:
          message = 'Ressource non trouvée';
          break;
        case 429:
          message = 'Trop de requêtes, veuillez réessayer plus tard';
          break;
        case 500:
          message = 'Erreur serveur, veuillez réessayer';
          break;
        default:
          message = data.message || fallbackMessage;
      }
    } else if (error.request) {
      // Network error
      message = 'Problème de connexion réseau';
    }

    this.logError(error, {
      type: 'api_error',
      status: error.response?.status,
      endpoint: error.config?.url
    });

    return { message, details };
  }

  handleAuthenticationError() {
    // Clear stored auth tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Redirect to login page (if not already there)
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }

  displayUserFriendlyError(error, defaultMessage = 'Une erreur est survenue') {
    const { message, details } = this.handleApiError(error, defaultMessage);
    
    // Show toast notification (assuming you have a toast system)
    if (window.showToast) {
      window.showToast(message, 'error');
    } else {
      // Fallback to alert
      alert(message);
    }

    return { message, details };
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;

// Helper functions for common use cases
export const logError = (error, context) => errorHandler.logError(error, context);
export const handleApiError = (error, fallbackMessage) => errorHandler.handleApiError(error, fallbackMessage);
export const displayError = (error, defaultMessage) => errorHandler.displayUserFriendlyError(error, defaultMessage);

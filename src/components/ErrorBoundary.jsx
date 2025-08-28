import { Component } from 'react'
import { analytics } from '../utils/monitoring'

/**
 * Error Boundary Component
 * Catches JavaScript errors in the component tree and displays a fallback UI
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state to render the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Store error details for debugging
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service
    if (window.errorHandler) {
      window.errorHandler.logError(error, {
        type: 'react_error_boundary',
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name
      })
    }

    // Track error in analytics
    if (analytics) {
      analytics.track('application_error', {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        component_name: this.props.componentName || 'Unknown'
      })
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset, this.handleReload)
      }

      // Default fallback UI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.694-.833-3.464 0l-6.928 12c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Une erreur est survenue
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Nous travaillons à résoudre ce problème. Vous pouvez essayer de recharger la page ou revenir plus tard.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full btn-primary"
              >
                Recharger la page
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full btn-outline text-sm"
              >
                Réessayer
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Détails de l'erreur (développement)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-Order Component for easy wrapping
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`

  return WithErrorBoundaryComponent
}

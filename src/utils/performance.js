/**
 * Performance Optimization Utilities
 * Tools for monitoring and improving application performance
 */

// Debounce function for optimizing frequent calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for limiting call frequency
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.setupPerformanceObserver();
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observe navigation timing
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry);
        }
      });

      observer.observe({ entryTypes: ['navigation', 'measure', 'mark'] });
    }
  }

  // Mark the start of a performance measurement
  markStart(name) {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`);
    }
  }

  // Mark the end and measure performance
  markEnd(name) {
    if ('performance' in window && 'mark' in performance && 'measure' in performance) {
      const endMark = `${name}-end`;
      performance.mark(endMark);
      performance.measure(name, `${name}-start`, endMark);
      
      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        this.recordMetric(name, measure);
      }
    }
  }

  recordMetric(name, entry) {
    this.metrics.set(name, {
      duration: entry.duration,
      timestamp: Date.now(),
      type: entry.entryType
    });

    // Log slow operations in development
    if (import.meta.env.DEV && entry.duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${entry.duration.toFixed(2)}ms`);
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    return new Promise((resolve) => {
      const vitals = {};

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            vitals.fid = entry.processingStart - entry.startTime;
          }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
          let clsValue = 0;
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
      }

      // Return vitals after a short delay to collect data
      setTimeout(() => resolve(vitals), 2000);
    });
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Image lazy loading utility
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '10px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }

  // Fallback for browsers without IntersectionObserver
  return {
    observe: (element) => {
      // Immediately trigger callback for fallback
      callback([{ isIntersecting: true, target: element }]);
    },
    unobserve: () => {},
    disconnect: () => {}
  };
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV) {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    Promise.all([
      ...scripts.map(script => fetch(script.src).then(r => r.text().length)),
      ...styles.map(style => fetch(style.href).then(r => r.text().length))
    ]).then(sizes => {
      const totalSize = sizes.reduce((sum, size) => sum + size, 0);
      console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    });
  }
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576)
    };
  }
  return null;
};

// Critical resource preloader
export const preloadCriticalResources = (resources) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        link.as = resource.type || 'fetch';
        if (resource.crossorigin) {
          link.crossOrigin = resource.crossorigin;
        }
        document.head.appendChild(link);
      });
    });
  }
};

export default performanceMonitor;

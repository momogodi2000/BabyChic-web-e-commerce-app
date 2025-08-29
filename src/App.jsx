import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import performanceMonitor from './utils/performance'
import './utils/toast' // Initialize toast system
import errorHandler from './utils/errorHandler'
import { analytics, featureFlags } from './utils/monitoring'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Contact from './pages/Contact'
import About from './pages/About'
import HelpFAQ from './pages/HelpFAQ'
import SizeGuide from './pages/SizeGuide'
import ReturnPolicy from './pages/ReturnPolicy'
import Shipping from './pages/Shipping'
import Terms from './pages/Terms'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminProducts from './pages/Admin/AdminProducts'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminBulkUpload from './pages/Admin/AdminBulkUpload'
import AdminContact from './pages/Admin/AdminContact'
import AdminSettings from './pages/Admin/AdminSettings'
import AdminAnalytics from './pages/Admin/AdminAnalytics'
import PWAInstallModal from './components/PWA/PWAInstallModal'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { CompareProvider } from './context/CompareContext'
import ProtectedRoute from './components/ProtectedRoute'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.markStart('app-initialization')
    
    // Preload critical resources
    const criticalResources = [
      { url: '/logo-babychic-2.png', type: 'image' },
      { url: '/placeholder-product.jpg', type: 'image' }
    ]
    
    if (import.meta.env.PROD) {
      import('./utils/performance').then(({ preloadCriticalResources }) => {
        preloadCriticalResources(criticalResources)
      })
    }

    // Simulate initial loading with actual initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
      performanceMonitor.markEnd('app-initialization')
      
      // Log performance metrics in development
      if (import.meta.env.DEV) {
        setTimeout(() => {
          performanceMonitor.getCoreWebVitals().then(vitals => {
            console.log('Core Web Vitals:', vitals)
          })
        }, 3000)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <img src="/logo-babychic-2.png" alt="BabyChic" className="w-20 h-20 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">BabyChic</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('header.companySlogan')}</p>
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <Router>
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Header />
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:category" element={<Catalog />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<HelpFAQ />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    <Route path="/return-policy" element={<ReturnPolicy />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/terms" element={<Terms />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      } 
                    >
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="bulk-upload" element={<AdminBulkUpload />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="contacts" element={<AdminContact />} />
                      <Route path="newsletter" element={<AdminContact />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
                <PWAInstallModal />
              </div>
              </Router>
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
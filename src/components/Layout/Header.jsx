import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, Heart, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import LanguageSwitch from './LanguageSwitch'
import ThemeSwitch from './ThemeSwitch'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getCartItemsCount } = useCart()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const categories = [
    { name: t('navigation.layette0_2'), path: '/catalog/layette-0-2' },
    { name: t('navigation.children3_10'), path: '/catalog/enfants-3-10' },
    { name: t('navigation.women'), path: '/catalog/femmes' },
    { name: t('navigation.shoes'), path: '/catalog/chaussures' },
    { name: t('navigation.accessories'), path: '/catalog/accessoires' },
  ]

  const cartItemsCount = getCartItemsCount()

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-gray-900'
    }`}>
      {/* Top Banner */}
      <div className="bg-primary-500 dark:bg-primary-600 text-white py-2 px-4">
        <div className="container mx-auto text-center text-sm">
          <span className="hidden sm:inline">{t('header.topBanner')}</span>
          <span className="sm:hidden">{t('header.topBannerMobile')}</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {/* Primary logo (square) */}
            <img src="/logo-babychic-2.png" alt="BabyChic" className="w-10 h-10 object-contain" />

            {/* Full logo for larger screens */}
            <div className="hidden sm:block">
              <img src="/logo-babychic.jpg" alt="BabyChic" className="h-8 object-contain" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{t('header.companySlogan')}</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Icon - Mobile */}
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => {/* Toggle search on mobile */}}
            >
              <Search size={20} />
            </button>

            {/* Theme Switch */}
            <ThemeSwitch className="hidden sm:block" />

            {/* Language Switch */}
            <LanguageSwitch className="hidden sm:block" />

            {/* Favorites */}
            <button className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              <Heart size={20} />
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Admin */}
            <Link 
              to="/admin/login" 
              className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <User size={20} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center mt-4 space-x-8">
          <Link 
            to="/" 
            className={`nav-link ${
              location.pathname === '/' ? 'text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 pb-1' : ''
            }`}
          >
            {t('navigation.home')}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={`nav-link ${
                location.pathname === category.path ? 'text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 pb-1' : ''
              }`}
            >
              {category.name}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className={`nav-link ${
              location.pathname === '/contact' ? 'text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 pb-1' : ''
            }`}
          >
            {t('common.contact')}
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${
              location.pathname === '/about' ? 'text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 pb-1' : ''
            }`}
          >
            {t('common.about')}
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden surface border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Controls */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <ThemeSwitch />
                <LanguageSwitch />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-3">
              <Link 
                to="/" 
                className="block py-2 nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="block py-2 nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                to="/contact" 
                className="block py-2 nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.contact')}
              </Link>
              <Link 
                to="/about" 
                className="block py-2 nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.about')}
              </Link>
              <Link 
                to="/admin/login" 
                className="block py-2 nav-link border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.admin')}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

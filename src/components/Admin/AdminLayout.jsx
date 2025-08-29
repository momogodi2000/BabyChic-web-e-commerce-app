import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  DollarSign, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  MessageSquare,
  Send,
  CreditCard,
  PieChart,
  Upload,
  TrendingUp,
  FileText,
  UserCheck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState([])
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/admin/dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'users',
      label: 'Gestion Utilisateurs',
      icon: Users,
      path: '/admin/users',
      color: 'text-green-600',
      badge: '3'
    },
    {
      id: 'products',
      label: 'Gestion Produits',
      icon: Package,
      path: '/admin/products',
      color: 'text-purple-600'
    },
    {
      id: 'bulk-upload',
      label: 'Import Produits',
      icon: Upload,
      path: '/admin/bulk-upload',
      color: 'text-blue-600'
    },
    {
      id: 'orders',
      label: 'Gestion Commandes',
      icon: ShoppingCart,
      path: '/admin/orders',
      color: 'text-orange-600',
      badge: '12'
    },
    {
      id: 'analytics',
      label: 'Statistiques',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'text-indigo-600'
    },
    {
      id: 'finances',
      label: 'Gestion Financière',
      icon: DollarSign,
      path: '/admin/finances',
      color: 'text-emerald-600'
    },
    {
      id: 'contacts',
      label: 'Messages Contact',
      icon: Mail,
      path: '/admin/contacts',
      color: 'text-red-600',
      badge: '5'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: Send,
      path: '/admin/newsletter',
      color: 'text-pink-600'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-gray-600'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isCurrentPath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      // This would be replaced with actual API call
      // const response = await notificationsAPI.getRecent()
      // setNotifications(response.data.notifications || [])
      
      // For now, keep empty until backend is ready
      setNotifications([])
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setNotifications([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src="/logo-babychic-2.png" alt="BabyChic" className="w-8 h-8" />
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = isCurrentPath(item.path)
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    size={18} 
                    className={isActive ? item.color : 'text-gray-500 group-hover:text-gray-700'} 
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-md hover:bg-gray-100 ${isSidebarOpen ? 'lg:hidden' : ''}`}
            >
              <Menu size={20} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-gray-600">+12%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard size={16} className="text-blue-500" />
                  <span className="text-gray-600">245k FCFA</span>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminLayout
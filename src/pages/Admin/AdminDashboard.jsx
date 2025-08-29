import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  AlertCircle, 
  DollarSign,
  Eye,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  MessageSquare,
  Star
} from 'lucide-react'
import { ordersAPI, productsAPI } from '../../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    lowStockProducts: [],
    monthlyRevenue: [],
    todayStats: {
      orders: 0,
      revenue: 0,
      visitors: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      const response = await ordersAPI.getStats()
      
      if (response.data) {
        const { stats: orderStats, recent_orders } = response.data
        
        setStats({
          totalOrders: orderStats?.orders?.total || 0,
          totalRevenue: orderStats?.revenue?.total || 0,
          totalProducts: 0, // Will be updated when products API is called
          totalCustomers: 0, // Will be calculated from unique customers
          recentOrders: recent_orders?.map(order => ({
            id: order.order_number,
            customer: `${order.customer_first_name} ${order.customer_last_name}`,
            amount: parseFloat(order.total_amount),
            status: translateOrderStatus(order.status),
            date: new Date(order.created_at).toLocaleDateString('fr-FR')
          })) || [],
          lowStockProducts: [] // Will be updated when products API is implemented
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Keep default empty state on error
    } finally {
      setIsLoading(false)
    }
  }

  const translateOrderStatus = (status) => {
    const statusMap = {
      'pending': 'En attente',
      'confirmed': 'Confirmé',
      'processing': 'En préparation',
      'shipped': 'Expédié',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré':
        return 'bg-green-100 text-green-800'
      case 'En cours':
        return 'bg-blue-100 text-blue-800'
      case 'En préparation':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Aperçu général de votre boutique BabyChic</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <button className="btn-primary">
            <Calendar size={18} className="mr-2" />
            Rapport
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Commandes Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="text-green-500" size={16} />
                <p className="text-green-600 text-sm ml-1">+12% ce mois</p>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Chiffre d'Affaires</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalRevenue.toLocaleString()} FCFA
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="text-green-500" size={16} />
                <p className="text-green-600 text-sm ml-1">+18% ce mois</p>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Produits Actifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="text-blue-500" size={16} />
                <p className="text-blue-600 text-sm ml-1">+5 cette semaine</p>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Clients Uniques</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="text-green-500" size={16} />
                <p className="text-green-600 text-sm ml-1">+8% ce mois</p>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Évolution du Chiffre d'Affaires</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenus</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Commandes</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Graphique des revenus</p>
              <p className="text-xs text-gray-400">Intégration en cours...</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits Populaires</h3>
          <div className="space-y-4">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={product.image || '/placeholder-product.jpg'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales || 0} ventes</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400" size={12} />
                    <span className="text-xs text-gray-600">{product.rating || 'N/A'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucun produit populaire</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Commandes Récentes</h3>
                <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir toutes
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.amount.toLocaleString()} FCFA</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune commande récente</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Alerts and Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-orange-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Alertes & Notifications</h3>
              </div>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                3 alertes
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="text-red-500 mt-0.5" size={16} />
                <div>
                  <p className="font-medium text-red-900 text-sm">Stock critique</p>
                  <p className="text-red-700 text-xs">2 produits en rupture de stock</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="text-yellow-500 mt-0.5" size={16} />
                <div>
                  <p className="font-medium text-yellow-900 text-sm">Commandes en attente</p>
                  <p className="text-yellow-700 text-xs">5 commandes nécessitent validation</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <MessageSquare className="text-blue-500 mt-0.5" size={16} />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Nouveaux messages</p>
                  <p className="text-blue-700 text-xs">8 messages clients non lus</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Link 
                to="/admin/products" 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors"
              >
                Gérer Stock
              </Link>
              <Link 
                to="/admin/orders" 
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors"
              >
                Voir Commandes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/admin/products" 
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl transition-all duration-300 text-center transform hover:scale-105"
          >
            <Package size={32} className="mx-auto mb-3" />
            <p className="font-medium">Gérer Produits</p>
          </Link>
          
          <Link 
            to="/admin/orders" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl transition-all duration-300 text-center transform hover:scale-105"
          >
            <ShoppingBag size={32} className="mx-auto mb-3" />
            <p className="font-medium">Commandes</p>
          </Link>
          
          <Link 
            to="/admin/analytics" 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl transition-all duration-300 text-center transform hover:scale-105"
          >
            <BarChart3 size={32} className="mx-auto mb-3" />
            <p className="font-medium">Statistiques</p>
          </Link>
          
          <Link 
            to="/admin/users" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl transition-all duration-300 text-center transform hover:scale-105"
          >
            <Users size={32} className="mx-auto mb-3" />
            <p className="font-medium">Utilisateurs</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

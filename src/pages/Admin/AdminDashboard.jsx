import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ShoppingBag, Users, TrendingUp, Package, AlertCircle } from 'lucide-react'
import { ordersAPI } from '../../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: []
  })
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Aperçu de votre boutique BabyChic</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Commandes Totales</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                <p className="text-green-600 text-sm mt-2">+12% ce mois</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Chiffre d'Affaires</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalRevenue.toLocaleString()} FCFA
                </p>
                <p className="text-green-600 text-sm mt-2">+18% ce mois</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Produits</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                <p className="text-blue-600 text-sm mt-2">+5 cette semaine</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
                <p className="text-green-600 text-sm mt-2">+8% ce mois</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-orange-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Stock Faible</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {product.stock} restant{product.stock > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Gérer les stocks →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/products" 
              className="bg-primary-500 hover:bg-primary-600 text-white p-6 rounded-lg transition-colors text-center"
            >
              <Package size={32} className="mx-auto mb-2" />
              <p className="font-medium">Gérer les Produits</p>
            </Link>
            <Link 
              to="/admin/orders" 
              className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-colors text-center"
            >
              <ShoppingBag size={32} className="mx-auto mb-2" />
              <p className="font-medium">Voir les Commandes</p>
            </Link>
            <button className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg transition-colors text-center">
              <BarChart3 size={32} className="mx-auto mb-2" />
              <p className="font-medium">Rapport des Ventes</p>
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg transition-colors text-center">
              <Users size={32} className="mx-auto mb-2" />
              <p className="font-medium">Gestion Clients</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

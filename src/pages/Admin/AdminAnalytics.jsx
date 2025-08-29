import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Package, 
  ShoppingBag,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  PieChart,
  Activity,
  Star,
  MapPin,
  CreditCard,
  Clock
} from 'lucide-react'
import { ordersAPI, productsAPI, publicAPI } from '../../services/api'

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  })
  
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [periodFilter, setPeriodFilter] = useState('month')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchAnalyticsData()
  }, [periodFilter])
  
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch statistics
      const [ordersResponse, productsResponse] = await Promise.all([
        ordersAPI.getStats(),
        productsAPI.getAll()
      ])
      
      if (ordersResponse.data) {
        const orderStats = ordersResponse.data.stats || {}
        const orders = ordersResponse.data.recent_orders || []
        
        setStats({
          totalRevenue: orderStats.revenue?.total || 0,
          monthlyRevenue: orderStats.revenue?.monthly || 0,
          totalOrders: orderStats.orders?.total || 0,
          totalCustomers: orderStats.customers?.total || 0,
          totalProducts: productsResponse.data?.products?.length || 0,
          conversionRate: orderStats.conversion_rate || 0,
          averageOrderValue: orderStats.average_order_value || 0,
          revenueGrowth: orderStats.growth?.revenue || 0,
          orderGrowth: orderStats.growth?.orders || 0,
          customerGrowth: orderStats.growth?.customers || 0
        })
        
        setRecentOrders(orders.slice(0, 5))
      }
      
      // Mock data for demonstration
      setSalesData([
        { name: 'Jan', revenue: 125000, orders: 45 },
        { name: 'Feb', revenue: 98000, orders: 38 },
        { name: 'Mar', revenue: 156000, orders: 52 },
        { name: 'Apr', revenue: 187000, orders: 61 },
        { name: 'Mai', revenue: 203000, orders: 68 },
        { name: 'Jun', revenue: 165000, orders: 55 },
      ])
      
      setTopProducts([
        { name: 'Body Bébé Coton Bio', sales: 156, revenue: 234000 },
        { name: 'Robe Fillette Été', sales: 142, revenue: 213000 },
        { name: 'Chaussons Bébé', sales: 98, revenue: 147000 },
        { name: 'Ensemble 2 Pièces', sales: 87, revenue: 174000 },
        { name: 'Barboteuse Coton', sales: 76, revenue: 114000 }
      ])
      
      setPaymentMethods([
        { name: 'Mobile Money', percentage: 65, amount: 1250000 },
        { name: 'WhatsApp', percentage: 25, amount: 480000 },
        { name: 'Cash', percentage: 10, amount: 192000 }
      ])
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques & Analytics</h1>
          <p className="text-gray-600 mt-2">Analyse complète des performances de votre boutique</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="input-field"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download size={18} />
            <span>Exporter</span>
          </button>
          <button 
            onClick={fetchAnalyticsData}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Chiffre d'Affaires Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalRevenue.toLocaleString()} FCFA
              </p>
              <div className="flex items-center mt-2">
                {stats.revenueGrowth >= 0 ? (
                  <ArrowUp className="text-green-500" size={16} />
                ) : (
                  <ArrowDown className="text-red-500" size={16} />
                )}
                <p className={`text-sm ml-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.revenueGrowth)}% ce mois
                </p>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Commandes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                {stats.orderGrowth >= 0 ? (
                  <ArrowUp className="text-green-500" size={16} />
                ) : (
                  <ArrowDown className="text-red-500" size={16} />
                )}
                <p className={`text-sm ml-1 ${stats.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.orderGrowth)}% ce mois
                </p>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Clients Uniques</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
              <div className="flex items-center mt-2">
                {stats.customerGrowth >= 0 ? (
                  <ArrowUp className="text-green-500" size={16} />
                ) : (
                  <ArrowDown className="text-red-500" size={16} />
                )}
                <p className={`text-sm ml-1 ${stats.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.customerGrowth)}% ce mois
                </p>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Panier Moyen</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.averageOrderValue.toLocaleString()} FCFA
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-blue-500" size={16} />
                <p className="text-blue-600 text-sm ml-1">{stats.conversionRate}% conversion</p>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Évolution des Ventes</h3>
            <div className="flex items-center space-x-4">
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
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {salesData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{item.name}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${(item.revenue / 250000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium">
                    {(item.revenue / 1000).toFixed(0)}k FCFA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits les Plus Vendus</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                    <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.sales} ventes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    {(product.revenue / 1000).toFixed(0)}k FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods & Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthodes de Paiement</h3>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{method.name}</span>
                  <span className="text-sm text-gray-600">{method.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{method.amount.toLocaleString()} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes Récentes</h3>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{order.order_number}</p>
                  <p className="text-xs text-gray-600">
                    {order.customer_first_name} {order.customer_last_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    {parseFloat(order.total_amount).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
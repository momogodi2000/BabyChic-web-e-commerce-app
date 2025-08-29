import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'

const AdminFinances = () => {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('month')
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedTransactions: 0,
    refunds: 0,
    recentTransactions: [],
    monthlyTrend: []
  })

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      // Replace with actual API call
      const response = await fetch(`/api/admin/finances?period=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFinancialData(data)
      } else {
        console.error('Failed to fetch financial data')
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinancialData()
  }, [dateRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { 
      style: 'currency', 
      currency: 'XAF' 
    }).format(amount)
  }

  const stats = [
    {
      title: 'Chiffre d\'affaires total',
      value: formatCurrency(financialData.totalRevenue),
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenus mensuels',
      value: formatCurrency(financialData.monthlyRevenue),
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Paiements en attente',
      value: formatCurrency(financialData.pendingPayments),
      change: '-2.1%',
      trend: 'down',
      icon: Wallet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Transactions complétées',
      value: financialData.completedTransactions,
      change: '+12.5%',
      trend: 'up',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Financière</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des finances et transactions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          
          <button
            onClick={fetchFinancialData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Évolution du chiffre d'affaires</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Graphique en cours d'implémentation</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Répartition des paiements</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Graphique en cours d'implémentation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transactions récentes</h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filtrer</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Chargement des transactions...</p>
            </div>
          ) : financialData.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune transaction trouvée</p>
              <p className="text-sm">Les transactions apparaîtront ici une fois que les données seront disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Méthode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.recentTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Complétée' :
                           transaction.status === 'pending' ? 'En attente' : 'Échouée'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminFinances
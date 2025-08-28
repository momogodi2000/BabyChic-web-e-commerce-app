import { useState, useEffect } from 'react'
import { Search, Eye, Edit, Package, Truck } from 'lucide-react'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    // Mock data for demo
    setOrders([
      {
        id: 'BC2024001',
        customer: 'Marie Ngozi',
        email: 'marie.ngozi@email.com',
        phone: '+237 6XX XXX XXX',
        items: 3,
        total: 45000,
        status: 'En cours',
        date: '2024-01-15T10:30:00',
        address: 'Quartier Emana, Yaoundé'
      },
      {
        id: 'BC2024002',
        customer: 'Paul Biya',
        email: 'paul.biya@email.com',
        phone: '+237 6XX XXX XXX',
        items: 2,
        total: 32000,
        status: 'Livré',
        date: '2024-01-15T09:15:00',
        address: 'Quartier Bastos, Yaoundé'
      },
      {
        id: 'BC2024003',
        customer: 'Alice Kamga',
        email: 'alice.kamga@email.com',
        phone: '+237 6XX XXX XXX',
        items: 1,
        total: 28000,
        status: 'En préparation',
        date: '2024-01-14T16:45:00',
        address: 'Quartier Melen, Yaoundé'
      }
    ])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré':
        return 'bg-green-100 text-green-800'
      case 'En cours':
        return 'bg-blue-100 text-blue-800'
      case 'En préparation':
        return 'bg-yellow-100 text-yellow-800'
      case 'Annulé':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2">Suivez et gérez toutes vos commandes</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600 mt-1">En cours</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">8</p>
              <p className="text-sm text-gray-600 mt-1">En préparation</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-sm text-gray-600 mt-1">En livraison</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">125</p>
              <p className="text-sm text-gray-600 mt-1">Livrées</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID commande ou nom client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="En préparation">En préparation</option>
                <option value="En livraison">En livraison</option>
                <option value="Livré">Livré</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select className="input-field">
                <option value="">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Commande</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Articles</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Total</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.address}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{order.items} article{order.items > 1 ? 's' : ''}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900">
                        {order.total.toLocaleString()} FCFA
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="En cours">En cours</option>
                        <option value="En préparation">En préparation</option>
                        <option value="En livraison">En livraison</option>
                        <option value="Livré">Livré</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(order.date).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Marquer comme prêt"
                        >
                          <Package size={16} />
                        </button>
                        <button 
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Envoyer en livraison"
                        >
                          <Truck size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Affichage de 1 à {orders.length} sur {orders.length} commandes
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Précédent
                </button>
                <button className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders

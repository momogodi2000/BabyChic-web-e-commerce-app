import { useState, useEffect } from 'react'
import { 
  Search, 
  Eye, 
  Edit, 
  Package, 
  Truck,
  DollarSign,
  Calendar,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Mail,
  MessageCircle,
  CreditCard,
  X,
  Save,
  RefreshCw,
  FileText,
  Star
} from 'lucide-react'
import { ordersAPI } from '../../services/api'
import OrderExport from '../../components/Admin/OrderExport'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'view', 'edit', 'payment'
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    pendingPayments: 0
  })
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, statusFilter, paymentFilter, periodFilter])

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 3000)
  }

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter) params.status = statusFilter
      if (paymentFilter) params.payment_status = paymentFilter
      if (periodFilter) params.period = periodFilter
      
      const response = await ordersAPI.getAll(params)
      
      if (response.data && response.data.orders) {
        const ordersList = response.data.orders.map(order => ({
          id: order.order_number,
          customer: `${order.customer_first_name} ${order.customer_last_name}`,
          customer_first_name: order.customer_first_name,
          customer_last_name: order.customer_last_name,
          email: order.customer_email,
          phone: order.customer_phone,
          items: order.items || [],
          itemCount: order.items?.length || 0,
          total: parseFloat(order.total_amount),
          subtotal: parseFloat(order.subtotal || order.total_amount),
          shipping_cost: parseFloat(order.shipping_cost || 0),
          tax: parseFloat(order.tax || 0),
          status: order.status,
          statusText: translateOrderStatus(order.status),
          payment_status: order.payment_status || 'pending',
          payment_method: order.payment_method || 'N/A',
          date: order.created_at,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address,
          address: `${order.shipping_address?.address || ''}, ${order.shipping_address?.city || ''}`,
          notes: order.notes || '',
          tracking_number: order.tracking_number || ''
        }))
        
        setOrders(ordersList)
        
        // Calculate stats
        setStats({
          total: ordersList.length,
          pending: ordersList.filter(o => o.status === 'pending').length,
          processing: ordersList.filter(o => o.status === 'processing').length,
          shipped: ordersList.filter(o => o.status === 'shipped').length,
          delivered: ordersList.filter(o => o.status === 'delivered').length,
          cancelled: ordersList.filter(o => o.status === 'cancelled').length,
          totalRevenue: ordersList.reduce((sum, o) => sum + o.total, 0),
          pendingPayments: ordersList.filter(o => o.payment_status === 'pending').length
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
      showNotification('Erreur lors du chargement des commandes', 'error')
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
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-indigo-100 text-indigo-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const openModal = (type, order = null) => {
    setModalType(type)
    setSelectedOrder(order)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setSelectedOrder(null)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus, statusText: translateOrderStatus(newStatus) } : order
      ))
      showNotification('Statut mis à jour avec succès', 'success')
    } catch (error) {
      console.error('Error updating order status:', error)
      showNotification('Erreur lors de la mise à jour du statut', 'error')
    }
  }

  const validatePayment = async (orderId) => {
    try {
      await ordersAPI.validatePayment(orderId)
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, payment_status: 'paid' } : order
      ))
      showNotification('Paiement validé avec succès', 'success')
      fetchOrders() // Refresh to get updated data
    } catch (error) {
      console.error('Error validating payment:', error)
      showNotification('Erreur lors de la validation du paiement', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2">Suivez et gérez toutes vos commandes et paiements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download size={18} />
            <span>Exporter</span>
          </button>
          <button 
            onClick={fetchOrders}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Commandes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">En Attente</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">En Préparation</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.processing}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <RefreshCw className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Livrées</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRevenue.toLocaleString()} F</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
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
              Statut Commande
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="processing">En préparation</option>
              <option value="shipped">Expédié</option>
              <option value="delivered">Livré</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut Paiement
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les paiements</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
              <option value="failed">Échoué</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select 
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <button 
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setPaymentFilter('')
                setPeriodFilter('')
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Commandes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Commande</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Articles</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Paiement</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.address}</p>
                        {order.tracking_number && (
                          <p className="text-xs text-blue-600">Suivi: {order.tracking_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {order.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone size={12} className="mr-1" />
                          {order.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{order.itemCount} article{order.itemCount > 1 ? 's' : ''}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-gray-900">
                          {order.total.toLocaleString()} FCFA
                        </span>
                        {order.payment_method && (
                          <p className="text-xs text-gray-600">{order.payment_method}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="processing">En préparation</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status === 'paid' ? 'Payé' : 
                           order.payment_status === 'pending' ? 'En attente' :
                           order.payment_status === 'failed' ? 'Échoué' : 'Remboursé'}
                        </span>
                        {order.payment_status === 'pending' && (
                          <button
                            onClick={() => validatePayment(order.id)}
                            className="text-xs text-green-600 hover:text-green-800 underline"
                          >
                            Valider
                          </button>
                        )}
                      </div>
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
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => openModal('view', order)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => openModal('payment', order)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Gérer paiement"
                        >
                          <CreditCard size={16} />
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Marquer comme expédié"
                        >
                          <Truck size={16} />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Contacter client"
                        >
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="text-gray-500">
                      <Package size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Aucune commande trouvée</p>
                      <p className="text-sm">Les commandes apparaîtront ici une fois passées par les clients.</p>
                    </div>
                  </td>
                </tr>
              )}
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
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                Précédent
              </button>
              <button className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalType === 'view' && 'Détails de la Commande'}
                {modalType === 'payment' && 'Gestion du Paiement'}
                {modalType === 'edit' && 'Modifier la Commande'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalType === 'view' && selectedOrder && (
                <div className="space-y-6">
                  {/* Order Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Informations Client</h4>
                        <div className="space-y-2">
                          <p><strong>Nom:</strong> {selectedOrder.customer}</p>
                          <p><strong>Email:</strong> {selectedOrder.email}</p>
                          <p><strong>Téléphone:</strong> {selectedOrder.phone}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Adresse de Livraison</h4>
                        {selectedOrder.shipping_address ? (
                          <div className="space-y-1">
                            <p>{selectedOrder.shipping_address.address}</p>
                            <p>{selectedOrder.shipping_address.city}</p>
                            <p>{selectedOrder.shipping_address.postal_code}</p>
                            <p>{selectedOrder.shipping_address.country}</p>
                          </div>
                        ) : (
                          <p className="text-gray-600">Aucune adresse de livraison</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Détails Commande</h4>
                        <div className="space-y-2">
                          <p><strong>N° Commande:</strong> {selectedOrder.id}</p>
                          <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}</p>
                          <p>
                            <strong>Statut:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                              {selectedOrder.statusText}
                            </span>
                          </p>
                          <p>
                            <strong>Paiement:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                              {selectedOrder.payment_status === 'paid' ? 'Payé' : 
                               selectedOrder.payment_status === 'pending' ? 'En attente' :
                               selectedOrder.payment_status === 'failed' ? 'Échoué' : 'Remboursé'}
                            </span>
                          </p>
                          {selectedOrder.tracking_number && (
                            <p><strong>Suivi:</strong> {selectedOrder.tracking_number}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Résumé Financier</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Sous-total:</span>
                            <span>{selectedOrder.subtotal.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Livraison:</span>
                            <span>{selectedOrder.shipping_cost.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TVA:</span>
                            <span>{selectedOrder.tax.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>{selectedOrder.total.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Articles Commandés</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium">Produit</th>
                            <th className="text-left py-3 px-4 font-medium">Prix Unitaire</th>
                            <th className="text-left py-3 px-4 font-medium">Quantité</th>
                            <th className="text-left py-3 px-4 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <img 
                                      src={item.product?.featured_image || '/placeholder-product.jpg'} 
                                      alt={item.product?.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                      <p className="font-medium">{item.product?.name || 'Produit'}</p>
                                      <p className="text-sm text-gray-600">SKU: {item.product?.sku || 'N/A'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{(item.unit_price || 0).toLocaleString()} FCFA</td>
                                <td className="py-3 px-4">{item.quantity || 1}</td>
                                <td className="py-3 px-4 font-medium">{((item.unit_price || 0) * (item.quantity || 1)).toLocaleString()} FCFA</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="py-6 text-center text-gray-500">
                                Aucun article disponible
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalType === 'payment' && selectedOrder && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-900 mt-2">Gestion du Paiement</h4>
                    <p className="text-gray-600">Commande #{selectedOrder.id}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Informations Paiement</h5>
                      <div className="space-y-2">
                        <p><strong>Montant:</strong> {selectedOrder.total.toLocaleString()} FCFA</p>
                        <p><strong>Méthode:</strong> {selectedOrder.payment_method}</p>
                        <p>
                          <strong>Statut:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                            {selectedOrder.payment_status === 'paid' ? 'Payé' : 
                             selectedOrder.payment_status === 'pending' ? 'En attente' :
                             selectedOrder.payment_status === 'failed' ? 'Échoué' : 'Remboursé'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Actions</h5>
                      <div className="space-y-3">
                        {selectedOrder.payment_status === 'pending' && (
                          <button 
                            onClick={() => validatePayment(selectedOrder.id)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Valider le Paiement
                          </button>
                        )}
                        {selectedOrder.payment_status === 'paid' && (
                          <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Rembourser
                          </button>
                        )}
                        <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          Envoyer Reçu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <OrderExport 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  )
}

export default AdminOrders

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Eye, 
  Filter,
  Upload,
  X,
  Save,
  Tag,
  Star,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react'
import { productsAPI } from '../../services/api'
import ProductVariants from '../../components/Admin/ProductVariants'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'add', 'edit', 'delete', 'view', 'category', 'variants'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    status: 'active',
    featured_image: '',
    images: [],
    tags: '',
    sku: '',
    weight: '',
    dimensions: ''
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageUploadStatus, setImageUploadStatus] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    outOfStock: 0
  })
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchTerm, selectedCategory, selectedStatus])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory
      if (selectedStatus) params.status = selectedStatus
      
      const response = await productsAPI.getAll(params)
      
      if (response.data && response.data.products) {
        const productsList = response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category?.name || 'Non catégorisé',
          category_id: product.category?.id,
          price: parseFloat(product.price),
          stock: product.stock_quantity || 0,
          status: product.status,
          image: product.featured_image || '/placeholder-product.jpg',
          sku: product.sku,
          tags: product.tags,
          weight: product.weight,
          dimensions: product.dimensions,
          created_at: product.created_at
        }))
        
        setProducts(productsList)
        
        // Calculate stats
        setStats({
          total: productsList.length,
          active: productsList.filter(p => p.status === 'active').length,
          inactive: productsList.filter(p => p.status === 'inactive').length,
          outOfStock: productsList.filter(p => p.stock === 0).length
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      showNotification('Erreur lors du chargement des produits', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Placeholder for categories - should be implemented in API
      setCategories([
        { id: 1, name: 'Layette 0-2 ans', slug: 'layette' },
        { id: 2, name: 'Enfants 3-10 ans', slug: 'enfants' },
        { id: 3, name: 'Mode Féminine', slug: 'femmes' },
        { id: 4, name: 'Chaussures', slug: 'chaussures' },
        { id: 5, name: 'Accessoires', slug: 'accessoires' }
      ])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 3000)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: '',
      status: 'active',
      featured_image: '',
      images: [],
      tags: '',
      sku: '',
      weight: '',
      dimensions: ''
    })
    setSelectedFiles([])
    setImageUploadStatus('')
  }

  const openModal = (type, product = null) => {
    setModalType(type)
    setSelectedProduct(product)
    
    if (type === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock_quantity: product.stock.toString(),
        category_id: product.category_id?.toString() || '',
        status: product.status,
        featured_image: product.image,
        images: [],
        tags: product.tags || '',
        sku: product.sku || '',
        weight: product.weight || '',
        dimensions: product.dimensions || ''
      })
    } else {
      resetForm()
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setSelectedProduct(null)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: parseInt(formData.category_id) || null
      }

      let createdProduct
      if (modalType === 'add') {
        const response = await productsAPI.create(productData)
        createdProduct = response.data.product
        showNotification('Produit créé avec succès', 'success')
      } else if (modalType === 'edit') {
        await productsAPI.update(selectedProduct.id, productData)
        showNotification('Produit mis à jour avec succès', 'success')
      }

      // Upload images if any selected
      if (selectedFiles.length > 0 && (createdProduct || selectedProduct)) {
        setImageUploadStatus('Téléchargement des images...')
        const productId = createdProduct ? createdProduct.id : selectedProduct.id
        await handleImageUpload(productId)
      }

      fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
      showNotification('Erreur lors de l\'enregistrement du produit', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await productsAPI.delete(selectedProduct.id)
      showNotification('Produit supprimé avec succès', 'success')
      fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Error deleting product:', error)
      showNotification('Erreur lors de la suppression du produit', 'error')
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600 bg-red-100', text: 'Rupture' }
    if (stock < 5) return { color: 'text-orange-600 bg-orange-100', text: 'Stock faible' }
    return { color: 'text-green-600 bg-green-100', text: 'En stock' }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', text: 'Actif' },
      'inactive': { color: 'bg-gray-100 text-gray-800', text: 'Inactif' },
      'draft': { color: 'bg-yellow-100 text-yellow-800', text: 'Brouillon' }
    }
    return statusConfig[status] || statusConfig['active']
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      showNotification('Maximum 5 images autorisées', 'error')
      return
    }
    setSelectedFiles(files)
  }

  const handleImageUpload = async (productId) => {
    if (selectedFiles.length === 0) return

    try {
      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('images', file)
      })

      await productsAPI.uploadImages(productId, formData)
      setImageUploadStatus('Images téléchargées avec succès')
      setSelectedFiles([])
    } catch (error) {
      console.error('Error uploading images:', error)
      setImageUploadStatus('Erreur lors du téléchargement')
      showNotification('Erreur lors du téléchargement des images', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-2">Gérez votre catalogue de produits BabyChic</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => openModal('category')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Tag size={18} />
            <span>Gérer Catégories</span>
          </button>
          <button
            onClick={() => openModal('add')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Ajouter un Produit</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Produits</p>
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
              <p className="text-gray-600 text-sm font-medium">Produits Actifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Produits Inactifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inactive}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <X className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ruptures de Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.outOfStock}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="text-red-600" size={24} />
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
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nom du produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Produits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Produit</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Catégorie</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Prix</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  const statusBadge = getStatusBadge(product.status)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{product.category}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">
                          {product.price.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-medium text-gray-900">{product.stock}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openModal('view', product)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openModal('edit', product)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openModal('variants', product)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Variantes"
                          >
                            <Tag size={16} />
                          </button>
                          <button
                            onClick={() => openModal('delete', product)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="text-gray-500">
                      <Package size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                      <p className="text-sm">Ajoutez vos premiers produits pour commencer à vendre.</p>
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
              Affichage de 1 à {products.length} sur {products.length} produits
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
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalType === 'add' && 'Ajouter un Produit'}
                {modalType === 'edit' && 'Modifier le Produit'}
                {modalType === 'delete' && 'Supprimer le Produit'}
                {modalType === 'view' && 'Détails du Produit'}
                {modalType === 'category' && 'Gérer les Catégories'}
                {modalType === 'variants' && 'Gestion des Variantes'}
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
              {(modalType === 'add' || modalType === 'edit') && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du Produit *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          className="input-field"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix (FCFA) *
                          </label>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="input-field"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock *
                          </label>
                          <input
                            type="number"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                            className="input-field"
                            required
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                          className="input-field"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="input-field"
                        >
                          <option value="active">Actif</option>
                          <option value="inactive">Inactif</option>
                          <option value="draft">Brouillon</option>
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Images du Produit (max 5)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            {selectedFiles.length > 0 
                              ? `${selectedFiles.length} fichier(s) sélectionné(s)` 
                              : "Sélectionnez des images (JPEG, PNG, WebP)"}
                          </p>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            onChange={handleFileSelect}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          />
                          {imageUploadStatus && (
                            <p className="mt-2 text-sm text-blue-600">{imageUploadStatus}</p>
                          )}
                          {/* URL fallback */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Ou entrez une URL d'image :</p>
                            <input
                              type="url"
                              value={formData.featured_image}
                              onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                              placeholder="https://exemple.com/image.jpg"
                              className="input-field text-sm"
                            />
                          </div>
                        </div>
                        {selectedFiles.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {Array.from(selectedFiles).map((file, index) => (
                              <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                                <p className="truncate">{file.name}</p>
                                <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({...formData, sku: e.target.value})}
                          className="input-field"
                          placeholder="Code unique du produit"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (séparés par des virgules)
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          className="input-field"
                          placeholder="nouveau, tendance, promotion"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Poids (kg)
                          </label>
                          <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            className="input-field"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dimensions
                          </label>
                          <input
                            type="text"
                            value={formData.dimensions}
                            onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                            className="input-field"
                            placeholder="L x l x h (cm)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>{modalType === 'add' ? 'Ajouter' : 'Modifier'}</span>
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'view' && selectedProduct && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Nom du Produit</h4>
                        <p className="text-gray-700">{selectedProduct.name}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Description</h4>
                        <p className="text-gray-700">{selectedProduct.description || 'Aucune description'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Prix</h4>
                          <p className="text-gray-700">{selectedProduct.price.toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Stock</h4>
                          <p className="text-gray-700">{selectedProduct.stock}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Catégorie</h4>
                        <p className="text-gray-700">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Statut</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedProduct.status).color}`}>
                          {getStatusBadge(selectedProduct.status).text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'delete' && selectedProduct && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h4>
                    <p className="text-gray-600 mt-2">
                      Êtes-vous sûr de vouloir supprimer le produit <strong>{selectedProduct.name}</strong> ?
                      Cette action est irréversible.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'category' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Tag className="mx-auto h-12 w-12 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-900 mt-2">Gestion des Catégories</h4>
                    <p className="text-gray-600">Fonctionnalité à implémenter</p>
                  </div>
                </div>
              )}

              {modalType === 'variants' && selectedProduct && (
                <ProductVariants 
                  product={selectedProduct}
                  onUpdate={(updatedProduct) => {
                    // Update the product in the list
                    setProducts(products.map(p => 
                      p.id === updatedProduct.id ? updatedProduct : p
                    ));
                    // You could also call an API to save the variants
                    closeModal();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

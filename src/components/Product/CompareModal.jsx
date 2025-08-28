import { useTranslation } from 'react-i18next'
import { X, ShoppingCart, Heart } from 'lucide-react'
import { useCompare } from '../../context/CompareContext'
import { useCart } from '../../context/CartContext'

const CompareModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()

  if (!isOpen) return null

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1
    })
  }

  const features = [
    { key: 'name', label: 'Nom' },
    { key: 'price', label: 'Prix' },
    { key: 'category', label: 'Catégorie' },
    { key: 'sizes', label: 'Tailles disponibles' },
    { key: 'colors', label: 'Couleurs disponibles' },
    { key: 'material', label: 'Matière' },
    { key: 'care', label: 'Entretien' }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-6xl">
          <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Comparaison de Produits ({compareList.length}/3)
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={clearCompare}
                    className="text-sm text-red-600 hover:text-red-500 transition-colors"
                  >
                    Tout supprimer
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {compareList.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Heart size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Aucun produit à comparer
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ajoutez des produits pour les comparer
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <td className="w-32 p-4"></td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 text-center min-w-64">
                            <div className="relative">
                              <button
                                onClick={() => removeFromCompare(product.id)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                              >
                                <X size={12} />
                              </button>
                              <img
                                src={product.images?.[0] || product.image || '/api/placeholder/200/200'}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                              />
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {product.name}
                              </h3>
                              <div className="space-y-2">
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="w-full btn-primary text-sm"
                                >
                                  <ShoppingCart size={16} className="mr-2" />
                                  Ajouter au panier
                                </button>
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature) => (
                        <tr key={feature.key} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
                            {feature.label}
                          </td>
                          {compareList.map((product) => (
                            <td key={product.id} className="p-4 text-center text-gray-600 dark:text-gray-300">
                              {feature.key === 'price' ? (
                                <span className="font-bold text-primary-500">
                                  {product.price?.toLocaleString()} FCFA
                                </span>
                              ) : feature.key === 'category' ? (
                                product.category?.name || product.category || '-'
                              ) : feature.key === 'sizes' ? (
                                product.variants?.sizes?.join(', ') || 'Taille unique'
                              ) : feature.key === 'colors' ? (
                                product.variants?.colors?.join(', ') || 'Couleur unique'
                              ) : (
                                product[feature.key] || '-'
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareModal

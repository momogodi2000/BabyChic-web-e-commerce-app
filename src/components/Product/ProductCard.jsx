import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useState, useRef, useEffect, memo } from 'react'
import { toast } from '../../utils/toast'
import { createIntersectionObserver } from '../../utils/performance'

const ProductCard = memo(({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef(null)
  const cardRef = useRef(null)

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!imageRef.current) return

    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !imageLoaded && !imageError) {
            const img = entry.target
            img.src = img.dataset.src
            img.onload = () => setImageLoaded(true)
            img.onerror = () => setImageError(true)
            observer.unobserve(img)
          }
        })
      },
      { rootMargin: '50px' }
    )

    observer.observe(imageRef.current)
    return () => observer.disconnect()
  }, [imageLoaded, imageError])

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast.warning('Ce produit n\'est plus en stock')
      return
    }
    
    setIsAddingToCart(true)
    try {
      addToCart(product, 1)
      toast.success(`${product.name} ajouté au panier`, {
        action: {
          text: 'Voir le panier',
          handler: () => window.location.href = '/cart'
        }
      })
      setTimeout(() => setIsAddingToCart(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Erreur lors de l\'ajout au panier')
      setIsAddingToCart(false)
    }
  }

  const toggleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  if (viewMode === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex p-4">
          <div className="flex-shrink-0 w-32 h-32">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 ml-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary-600">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={toggleLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.inStock && !isAddingToCart
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShoppingCart size={16} className="inline mr-1" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
          {/* Image with lazy loading and error handling */}
          <img
            ref={imageRef}
            data-src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className={`w-full h-64 object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: imageError ? 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)' : 'none',
              backgroundSize: imageError ? '20px 20px' : 'none',
              backgroundPosition: imageError ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'none'
            }}
          />
          
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Eye size={32} className="mx-auto mb-2" />
                <p className="text-sm">Image non disponible</p>
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.originalPrice && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Rupture
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleLike}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-white/90 text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            </button>
            <Link
              to={`/product/${product.id}`}
              className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-primary-500 transition-colors duration-200"
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                product.inStock && !isAddingToCart
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Ajout...
                </div>
              ) : (
                <>
                  <ShoppingCart size={16} className="inline mr-2" />
                  {product.inStock ? 'Ajouter au Panier' : 'Indisponible'}
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-primary-500 font-medium bg-primary-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">(24)</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'En stock' : 'Rupture'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600">
              {product.price.toLocaleString()} FCFA
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

// Add display name for debugging
ProductCard.displayName = 'ProductCard'

export default ProductCard

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { publicAPI } from '../services/api'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await publicAPI.getProduct(id)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      // Mock data for development
      setProduct({
        id: parseInt(id),
        name: "Ensemble Bébé Rose Pastel Premium",
        price: 15000,
        originalPrice: 20000,
        description: "Ensemble bébé en coton bio ultra-doux, parfait pour les tout-petits. Comprend un body à manches longues et un pantalon assorti. Matière hypoallergénique et certifiée OEKO-TEX.",
        images: [
          "/api/placeholder/600/600",
          "/api/placeholder/600/600",
          "/api/placeholder/600/600",
          "/api/placeholder/600/600"
        ],
        category: "Layette 0-2 ans",
        rating: 4.8,
        reviewCount: 24,
        inStock: true,
        sizes: ["0-3m", "3-6m", "6-9m", "9-12m"],
        colors: ["Rose", "Bleu", "Blanc"],
        material: "100% Coton Bio",
        care: ["Lavage machine 30°", "Pas de sèche-linge", "Repassage doux"],
        features: [
          "Matière hypoallergénique",
          "Coutures plates pour plus de confort",
          "Pressions faciles à manipuler",
          "Certifié OEKO-TEX Standard 100"
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille')
      return
    }

    setIsAddingToCart(true)
    try {
      addToCart({
        ...product,
        selectedSize,
        quantity
      }, quantity)
      // Show success message
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded animate-pulse"></div>
              <div className="bg-gray-300 h-6 rounded animate-pulse"></div>
              <div className="bg-gray-300 h-20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <Link to="/catalog" className="btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-500">Accueil</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-primary-500">Catalogue</Link>
            <span>/</span>
            <Link to={`/catalog/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-500">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-primary-500 font-medium bg-primary-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-lg font-medium text-gray-900 ml-2">{product.rating}</span>
                <span className="text-gray-600">({product.reviewCount} avis)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-primary-600">
                {product.price.toLocaleString()} FCFA
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} FCFA
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Taille</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  product.inStock && !isAddingToCart
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAddingToCart ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Ajout en cours...
                  </div>
                ) : (
                  <>
                    <ShoppingCart size={20} className="inline mr-2" />
                    {product.inStock ? 'Ajouter au Panier' : 'Indisponible'}
                  </>
                )}
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 border rounded-lg transition-colors ${
                  isLiked
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                <Truck className="text-primary-500" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Livraison</h4>
                  <p className="text-sm text-gray-600">Gratuite dès 25k FCFA</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                <Shield className="text-primary-500" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Garantie</h4>
                  <p className="text-sm text-gray-600">Qualité assurée</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                <RotateCcw className="text-primary-500" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Retour</h4>
                  <p className="text-sm text-gray-600">7 jours gratuit</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du Produit</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Matière:</span>
                  <span className="font-medium">{product.material}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-2">Entretien:</span>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {product.care.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-gray-600 block mb-2">Caractéristiques:</span>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

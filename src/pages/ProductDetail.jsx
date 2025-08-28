import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, MessageSquare, User } from 'lucide-react'
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
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    author: ''
  })

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await publicAPI.getProduct(id)
      if (response.data) {
        const product = response.data
        setProduct({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          originalPrice: product.original_price ? parseFloat(product.original_price) : null,
          description: product.description,
          images: product.images?.length > 0 ? product.images.map(img => img.url) : [product.featured_image || "/api/placeholder/600/600"],
          category: product.category?.name || "Non catégorisé",
          rating: product.rating || 0,
          reviewCount: product.reviews_count || 0,
          inStock: product.stock_quantity > 0,
          stockQuantity: product.stock_quantity,
          sizes: product.sizes ? product.sizes.split(',').map(s => s.trim()) : [],
          colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
          material: product.material || "Non spécifié",
          care: product.care_instructions ? product.care_instructions.split(',').map(c => c.trim()) : [],
          features: product.features ? product.features.split(',').map(f => f.trim()) : [],
          reviews: []
        })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      // Mock reviews for development since backend reviews API might not be ready
      setReviews([
        {
          id: 1,
          author: 'Marie L.',
          rating: 5,
          comment: 'Très beau produit, qualité exceptionnelle ! Mon bébé est très à l\'aise dedans.',
          date: '2024-01-15'
        },
        {
          id: 2,
          author: 'Sophie K.',
          rating: 4,
          comment: 'Joli design et matière douce. La taille correspond bien.',
          date: '2024-01-10'
        },
        {
          id: 3,
          author: 'Charlotte M.',
          rating: 5,
          comment: 'Parfait pour mon petit bout de chou. Je recommande vivement !',
          date: '2024-01-08'
        }
      ])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    try {
      // For now, just add to local state since backend API might not be ready
      const review = {
        id: Date.now(),
        author: newReview.author,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      }
      
      setReviews([review, ...reviews])
      setNewReview({ rating: 5, comment: '', author: '' })
      setShowReviewForm(false)
      
      // Update product rating
      if (product) {
        const newReviewCount = product.reviewCount + 1
        const newRating = ((product.rating * product.reviewCount) + newReview.rating) / newReviewCount
        setProduct({
          ...product,
          rating: Math.round(newRating * 10) / 10,
          reviewCount: newReviewCount
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Erreur lors de l\'ajout du commentaire')
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

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Avis Clients ({reviews.length})
            </h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary flex items-center space-x-2"
            >
              <MessageSquare size={16} />
              <span>Laisser un avis</span>
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">Donner votre avis</h4>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="input-field"
                    placeholder="Entrez votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className="p-1"
                      >
                        <Star
                          size={24}
                          className={`${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Partagez votre expérience avec ce produit..."
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Publier l'avis
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <User size={20} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="font-semibold text-gray-900">{review.author}</h5>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Aucun avis pour le moment</p>
                <p className="text-gray-400">Soyez le premier à donner votre avis sur ce produit !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

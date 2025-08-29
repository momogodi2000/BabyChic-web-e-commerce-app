import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle, CreditCard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  
  const generateWhatsAppMessage = () => {
    const total = getCartTotal() + (getCartTotal() >= 25000 ? 0 : 2500)
    const itemsList = cart.map(item => 
      `• ${item.name} (${item.selectedSize || 'Taille standard'}) - Qté: ${item.quantity} - ${(item.price * item.quantity).toLocaleString()} FCFA`
    ).join('\n')
    
    const message = `*Commande BabyChic*\n\n` +
      `Bonjour, je souhaite passer une commande :\n\n` +
      `${itemsList}\n\n` +
      `*Sous-total:* ${getCartTotal().toLocaleString()} FCFA\n` +
      `*Livraison:* ${getCartTotal() >= 25000 ? 'Gratuite' : '2,500 FCFA'}\n` +
      `*Total à payer:* ${total.toLocaleString()} FCFA\n\n` +
      `Merci de me confirmer la disponibilité et les modalités de livraison.`
    
    return encodeURIComponent(message)
  }
  
  const handleWhatsAppPayment = () => {
    const whatsappNumber = "+237696969696" // Replace with actual business number
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8">
              Découvrez notre collection et ajoutez vos produits préférés au panier
            </p>
            <Link to="/catalog" className="btn-primary">
              Découvrir nos Produits
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/catalog" 
              className="p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Mon Panier ({cart.length} article{cart.length !== 1 ? 's' : ''})
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Vider le panier
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/product/${item.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-500 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">Taille: {item.selectedSize}</p>
                    )}
                    <p className="text-lg font-bold text-primary-600 mt-2">
                      {item.price.toLocaleString()} FCFA
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Récapitulatif de la commande
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{getCartTotal().toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison:</span>
                  <span className="font-medium">
                    {getCartTotal() >= 25000 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      '2,500 FCFA'
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {(getCartTotal() + (getCartTotal() >= 25000 ? 0 : 2500)).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {getCartTotal() < 25000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    🚚 Ajoutez {(25000 - getCartTotal()).toLocaleString()} FCFA pour bénéficier de la livraison gratuite
                  </p>
                </div>
              )}

              {!showPaymentOptions ? (
                <>
                  <button 
                    onClick={() => setShowPaymentOptions(true)}
                    className="w-full btn-primary text-center block mb-4"
                  >
                    Choisir le Mode de Paiement
                  </button>
                  
                  <Link 
                    to="/catalog" 
                    className="w-full btn-outline text-center block"
                  >
                    Continuer mes Achats
                  </Link>
                </>
              ) : (
                <div className="space-y-3 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Choisissez votre mode de paiement</h4>
                  
                  <Link 
                    to="/checkout" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-center block transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard size={18} />
                    <span>Paiement Mobile (MTN/Orange)</span>
                  </Link>
                  
                  <button
                    onClick={handleWhatsAppPayment}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={18} />
                    <span>Commander via WhatsApp</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowPaymentOptions(false)}
                    className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
                  >
                    Retour
                  </button>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold text-center">
                    Orange Money
                  </div>
                  <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold text-center">
                    MTN MoMo
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <MessageCircle size={14} className="text-green-500" />
                  <span>Ou commandez directement via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

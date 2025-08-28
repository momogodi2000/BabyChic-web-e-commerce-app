import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, MapPin, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { publicAPI } from '../services/api'

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Delivery Info
    address: '',
    city: 'Yaoundé',
    quarter: '',
    landmark: '',
    // Payment
    paymentMethod: 'orange-money',
    deliveryOnly: false // New option for delivery payment
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const getDeliveryFee = () => {
    return getCartTotal() >= 25000 ? 0 : 2000
  }

  const getPaymentAmount = () => {
    if (formData.deliveryOnly) {
      return getDeliveryFee() // Only pay delivery fee now
    }
    return getCartTotal() + getDeliveryFee() // Full payment
  }

  const getRemainingBalance = () => {
    if (formData.deliveryOnly) {
      return getCartTotal() // Amount to pay on delivery
    }
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Create order with delivery payment options
    const orderData = {
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      })),
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      delivery: {
        address: formData.address,
        city: formData.city,
        quarter: formData.quarter,
        landmark: formData.landmark
      },
      payment: {
        method: formData.paymentMethod
      },
      deliveryOnly: formData.deliveryOnly
    }

    try {
      // Create order using the backend API
      const response = await publicAPI.createOrder(orderData)
      
      if (response.data) {
        const { order, receipt } = response.data
        
        clearCart()
        navigate('/order-success', { 
          state: { 
            orderId: order.orderNumber,
            total: order.total,
            remainingBalance: order.remainingBalance || 0,
            paymentAmount: getPaymentAmount(),
            deliveryOption: order.deliveryOption,
            receiptUrl: receipt?.downloadUrl
          }
        })
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <Link to="/catalog" className="btn-primary">
              Retourner au Catalogue
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 1, name: 'Informations', icon: User },
    { id: 2, name: 'Livraison', icon: MapPin },
    { id: 3, name: 'Paiement', icon: CreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            to="/cart" 
            className="p-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser ma Commande</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <step.icon size={20} />
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step.id ? 'text-primary-500' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations Personnelles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+237 6XX XXX XXX"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="btn-primary"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Adresse de Livraison
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse complète *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="input-field"
                        placeholder="Numéro, rue, immeuble..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville *
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="input-field"
                        >
                          <option value="Yaoundé">Yaoundé</option>
                          <option value="Douala">Douala (bientôt disponible)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quartier *
                        </label>
                        <input
                          type="text"
                          name="quarter"
                          value={formData.quarter}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                          placeholder="Ex: Emana, Melen, Bastos..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Point de repère
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Ex: Face à la pharmacie, près de l'école..."
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="btn-outline"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="btn-primary"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mode de Paiement
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="orange-money"
                        name="paymentMethod"
                        value="orange-money"
                        checked={formData.paymentMethod === 'orange-money'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600"
                      />
                      <label htmlFor="orange-money" className="flex items-center space-x-3">
                        <div className="bg-orange-500 text-white px-3 py-2 rounded font-semibold text-sm">
                          Orange Money
                        </div>
                        <span>Paiement sécurisé avec Orange Money</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="mtn-momo"
                        name="paymentMethod"
                        value="mtn-momo"
                        checked={formData.paymentMethod === 'mtn-momo'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600"
                      />
                      <label htmlFor="mtn-momo" className="flex items-center space-x-3">
                        <div className="bg-yellow-500 text-black px-3 py-2 rounded font-semibold text-sm">
                          MTN MoMo
                        </div>
                        <span>Paiement sécurisé avec MTN Mobile Money</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="btn-outline"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Finaliser la Commande
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Récapitulatif
              </h3>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-600">
                        {item.selectedSize && `Taille: ${item.selectedSize} - `}Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pt-4 border-t border-gray-200">
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
                      '2,000 FCFA'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>
                    {(getCartTotal() + (getCartTotal() >= 25000 ? 0 : 2000)).toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <p className="text-xs text-gray-500">
                  Vos données de paiement sont protégées et chiffrées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

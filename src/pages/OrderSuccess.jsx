import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Download, Home, ShoppingBag, CreditCard } from 'lucide-react'

const OrderSuccess = () => {
  const location = useLocation()
  const { 
    orderId, 
    total, 
    remainingBalance, 
    paymentAmount, 
    deliveryOption,
    receiptUrl 
  } = location.state || {}

  useEffect(() => {
    // Track conversion for analytics
    console.log('Order completed:', { orderId, total })
  }, [orderId, total])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-fade-in">
            <CheckCircle size={48} className="text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
            Commande Confirmée !
          </h1>
          <p className="text-lg text-gray-600 mb-8 animate-slide-up">
            Merci pour votre confiance. Votre commande a été reçue et sera traitée dans les plus brefs délais.
          </p>

          {/* Order Details */}
          {orderId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de votre commande
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Numéro de commande</p>
                  <p className="font-semibold text-primary-600">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="font-semibold">{total?.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                    En préparation
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Livraison estimée</p>
                  <p className="font-semibold">2-3 jours ouvrables</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Prochaines étapes
            </h3>
            <div className="text-left space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Vous recevrez un SMS de confirmation sous peu</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Notre équipe préparera votre commande</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Un livreur vous contactera pour la livraison</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Livraison à l'adresse indiquée sous 2-3 jours</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-600 mb-4">
              Notre équipe est disponible pour répondre à toutes vos questions
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">📞</span>
                <span className="font-medium">+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">📧</span>
                <span className="font-medium">contact@babychic.cm</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
            <Link to="/" className="btn-primary flex items-center space-x-2">
              <Home size={20} />
              <span>Retour à l'Accueil</span>
            </Link>
            <Link to="/catalog" className="btn-outline flex items-center space-x-2">
              <ShoppingBag size={20} />
              <span>Continuer mes Achats</span>
            </Link>
          </div>

          {/* Social Sharing */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Partagez votre expérience BabyChic !</p>
            <div className="flex items-center justify-center space-x-4">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-500 transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

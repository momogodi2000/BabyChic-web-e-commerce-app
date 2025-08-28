import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import NewsletterSubscribe from '../Newsletter/NewsletterSubscribe'

const Footer = () => {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('header.companyName')}</h3>
                <p className="text-xs text-gray-400">{t('header.companySlogan')}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.allProducts')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/layette-0-2" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('navigation.layette0_2')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/enfants-3-10" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('navigation.children3_10')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/femmes" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('navigation.women')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('common.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.help')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.sizeGuide')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.returnPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.shippingInfo')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.termsOfUse')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">
                    {t('footer.address')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">+237 6XX XXX XXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">contact@babychic.cm</p>
              </div>
            </div>

            {/* Physical Store */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-2">{t('footer.physicalStore')}</h5>
              <p className="text-xs text-gray-400 mb-1">{t('footer.storeLocation')}</p>
              <p className="text-xs text-gray-400">{t('footer.storeHours')}</p>
            </div>

            {/* Newsletter */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-2">{t('footer.newsletter')}</h5>
              <p className="text-xs text-gray-400 mb-3">{t('footer.newsletterDescription')}</p>
              <NewsletterSubscribe />
            </div>

            {/* Payment Methods */}
            <div>
              <h5 className="text-sm font-semibold mb-2">{t('footer.paymentMethods')}</h5>
              <div className="flex space-x-2">
                <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Orange Money
                </div>
                <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                  MTN MoMo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 dark:border-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>{t('footer.copyright')}</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.legalNotices')}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

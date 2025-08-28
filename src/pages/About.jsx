import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Heart, Award, Users, MapPin, Clock, Phone, Star } from 'lucide-react'

const About = () => {
  const { t } = useTranslation()

  const values = [
    {
      icon: <Award size={32} />,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description'),
      color: 'text-yellow-500'
    },
    {
      icon: <Users size={32} />,
      title: t('about.values.service.title'),
      description: t('about.values.service.description'),
      color: 'text-blue-500'
    },
    {
      icon: <Heart size={32} />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: 'text-red-500'
    }
  ]

  const stats = [
    { number: '1000+', label: 'Clients satisfaits', icon: <Users size={24} /> },
    { number: '500+', label: 'Produits disponibles', icon: <Star size={24} /> },
    { number: '3', label: 'Années d\'expérience', icon: <Award size={24} /> },
    { number: '24/7', label: 'Support client', icon: <Heart size={24} /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {t('about.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/catalog" className="btn-secondary">
                {t('home.discoverCollection')}
              </Link>
              <Link to="/contact" className="btn-outline text-white border-white hover:bg-white hover:text-primary-600">
                {t('common.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {t('about.story.content')}
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {t('about.mission.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('about.mission.content')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/logo-babychic-2.png" 
                  alt="BabyChic Store" 
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute -top-4 -left-4 bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                  BC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Les principes qui guident notre entreprise au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${value.color}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notre Impact
            </h2>
            <p className="text-xl text-primary-100">
              Des chiffres qui témoignent de notre succès
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Physical Store Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="Boutique BabyChic Emana" 
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Boutique Emana</h3>
                <p className="text-lg">Yaoundé, Cameroun</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('about.store.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {t('about.store.description')}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                    <MapPin className="text-primary-600 dark:text-primary-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {t('common.address')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.store.address')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                    <Clock className="text-primary-600 dark:text-primary-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Heures d'ouverture
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.store.hours')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                    <Phone className="text-primary-600 dark:text-primary-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Contact direct
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      +237 6XX XXX XXX
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/contact" className="btn-primary text-center">
                  {t('contact.visit.directions')}
                </Link>
                <Link to="/catalog" className="btn-outline text-center">
                  {t('home.discoverCollection')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Rejoignez la Famille BabyChic
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Découvrez dès maintenant notre collection et profitez d'une expérience d'achat unique
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/catalog" className="btn-primary">
                {t('home.discoverCollection')}
              </Link>
              <Link to="/contact" className="btn-outline">
                {t('common.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

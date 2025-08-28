import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Star, Truck, Shield, Headphones, Heart } from 'lucide-react'
import { publicAPI } from '../services/api'
import NewsletterSubscribe from '../components/Newsletter/NewsletterSubscribe'

const Home = () => {
  const { t } = useTranslation()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
    fetchCategories()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await publicAPI.getProducts({ featured: true, limit: 8 })
      setFeaturedProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching featured products:', error)
      // Set mock data for development
      setFeaturedProducts([
        {
          id: 1,
          name: "Ensemble Bébé Rose",
          price: 15000,
          images: ["/api/placeholder/300/300"],
          category: { name: "Layette 0-2 ans" },
          slug: "ensemble-bebe-rose"
        },
        {
          id: 2,
          name: "Robe Fillette Bleu",
          price: 22000,
          images: ["/api/placeholder/300/300"],
          category: { name: "Enfants 3-10 ans" },
          slug: "robe-fillette-bleu"
        },
        {
          id: 3,
          name: "Top Femme Élégant",
          price: 35000,
          images: ["/api/placeholder/300/300"],
          category: { name: "Mode Féminine" },
          slug: "top-femme-elegant"
        },
        {
          id: 4,
          name: "Chaussures Enfant",
          price: 18000,
          images: ["/api/placeholder/300/300"],
          category: { name: "Chaussures" },
          slug: "chaussures-enfant"
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await publicAPI.getCategories()
      const apiCategories = response.data.categories || []
      
      // Transform API categories with enhanced data
      const transformedCategories = apiCategories.slice(0, 4).map((cat, index) => ({
        name: cat.name,
        slug: cat.slug,
        image: cat.image || "/api/placeholder/400/300",
        description: cat.description || getDefaultDescription(cat.name),
        link: `/catalog/${cat.slug}`,
        color: getColorForCategory(index)
      }))
      
      setCategories(transformedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Set mock data for development
      setCategories([
        {
          name: t('navigation.layette0_2'),
          slug: "layette-0-2",
          image: "/api/placeholder/400/300",
          description: "Vêtements doux et confortables pour les tout-petits",
          link: "/catalog/layette-0-2",
          color: "from-pink-400 to-pink-600"
        },
        {
          name: t('navigation.children3_10'),
          slug: "enfants-3-10",
          image: "/api/placeholder/400/300",
          description: "Mode tendance pour les enfants grandissants",
          link: "/catalog/enfants-3-10",
          color: "from-blue-400 to-blue-600"
        },
        {
          name: t('navigation.women'),
          slug: "femmes",
          image: "/api/placeholder/400/300",
          description: "Élégance et style pour les mamans",
          link: "/catalog/femmes",
          color: "from-purple-400 to-purple-600"
        },
        {
          name: t('navigation.accessories'),
          slug: "accessoires",
          image: "/api/placeholder/400/300",
          description: "Sacs, chaussures et bijoux",
          link: "/catalog/accessoires",
          color: "from-green-400 to-green-600"
        }
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const getDefaultDescription = (categoryName) => {
    const descriptions = {
      'Layette 0-2 ans': 'Vêtements doux et confortables pour les tout-petits',
      'Enfants 3-10 ans': 'Mode tendance pour les enfants grandissants', 
      'Mode Féminine': 'Élégance et style pour les mamans',
      'Accessoires': 'Sacs, chaussures et bijoux',
      'Chaussures': 'Chaussures confortables pour toute la famille'
    }
    return descriptions[categoryName] || 'Découvrez notre sélection'
  }

  const getColorForCategory = (index) => {
    const colors = [
      "from-pink-400 to-pink-600",
      "from-blue-400 to-blue-600", 
      "from-purple-400 to-purple-600",
      "from-green-400 to-green-600"
    ]
    return colors[index % colors.length]
  }

  const features = [
    {
      icon: <Truck size={32} />,
      title: t('home.features.fastDelivery.title'),
      description: t('home.features.fastDelivery.description')
    },
    {
      icon: <Shield size={32} />,
      title: t('home.features.securePayment.title'),
      description: t('home.features.securePayment.description')
    },
    {
      icon: <Headphones size={32} />,
      title: t('home.features.customerSupport.title'),
      description: t('home.features.customerSupport.description')
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('home.heroTitle')}
                <span className="block text-primary-500 dark:text-primary-400">{t('home.heroSubtitle')}</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                {t('home.heroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/catalog" 
                  className="btn-primary text-center inline-flex items-center justify-center space-x-2"
                >
                  <span>{t('home.discoverCollection')}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/catalog/layette-0-2" 
                  className="btn-outline text-center"
                >
                  {t('home.newLayette')}
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/logo-babychic.jpg" 
                  alt="Mode enfant" 
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute -top-4 -right-4 bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold">
                  -30%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('home.categoriesTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.categoriesDescription')}
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
              <Link 
                key={category.name}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity`}>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <span>Explorer</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.featuredDescription')}
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-600 h-64 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="card group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={product.images?.[0] || product.image || "/api/placeholder/300/300"} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Heart size={16} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.category?.name || product.category}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-500 dark:text-primary-400">
                      {product.price?.toLocaleString()} FCFA
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
                    </div>
                  </div>
                  <Link 
                    to={`/product/${product.slug || product.id}`}
                    className="mt-4 w-full btn-primary text-center"
                  >
                    {t('product.details')}
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/catalog" className="btn-outline">
              {t('home.viewAllProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.newsletter.title')}
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              {t('home.newsletter.description')}
            </p>
            <NewsletterSubscribe variant="hero" />
          </div>
        </div>
      </section>

      {/* Physical Store Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('home.physicalStore.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {t('home.physicalStore.description')}
            </p>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg max-w-md mx-auto mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('home.physicalStore.address')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('home.physicalStore.hours')}
              </p>
              <Link to="/contact" className="btn-primary">
                {t('home.physicalStore.visitStore')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Grid, List, Filter, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/Product/ProductCard'
import { publicAPI } from '../services/api'

const Catalog = () => {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [showFilters, setShowFilters] = useState(false)

  const searchQuery = searchParams.get('search')

  useEffect(() => {
    fetchProducts()
  }, [category, searchQuery, sortBy])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = {
        category,
        search: searchQuery,
        sortBy,
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      }
      const response = await publicAPI.getProducts(params)
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Show empty state instead of mock data
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryTitle = () => {
    const categoryTitles = {
      'layette-0-2': 'Layette 0-2 ans',
      'enfants-3-10': 'Enfants 3-10 ans',
      'femmes': 'Mode Féminine',
      'chaussures': 'Chaussures',
      'accessoires': 'Accessoires'
    }
    return categoryTitles[category] || 'Tous les Produits'
  }

  const getPageTitle = () => {
    if (searchQuery) return `Résultats pour "${searchQuery}"`
    return getCategoryTitle()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600">
            {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                <span>Filtres</span>
              </button>
              
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Prix:</span>
                <select
                  value={`${priceRange[0]}-${priceRange[1]}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number)
                    setPriceRange([min, max])
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="0-100000">Tous les prix</option>
                  <option value="0-20000">Moins de 20,000 FCFA</option>
                  <option value="20000-50000">20,000 - 50,000 FCFA</option>
                  <option value="50000-100000">Plus de 50,000 FCFA</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Toutes les catégories</option>
                    <option value="layette-0-2">Layette 0-2 ans</option>
                    <option value="enfants-3-10">Enfants 3-10 ans</option>
                    <option value="femmes">Mode Féminine</option>
                    <option value="chaussures">Chaussures</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Toutes les tailles</option>
                    <option value="0-6m">0-6 mois</option>
                    <option value="6-12m">6-12 mois</option>
                    <option value="12-24m">12-24 mois</option>
                    <option value="2-3y">2-3 ans</option>
                    <option value="4-6y">4-6 ans</option>
                    <option value="7-10y">7-10 ans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilité
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Tous les produits</option>
                    <option value="in-stock">En stock</option>
                    <option value="out-of-stock">Rupture de stock</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou filtres
            </p>
            <button
              onClick={() => {
                setPriceRange([0, 100000])
                setSortBy('newest')
                setShowFilters(false)
              }}
              className="btn-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                Précédent
              </button>
              <button className="px-3 py-2 bg-primary-500 text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog

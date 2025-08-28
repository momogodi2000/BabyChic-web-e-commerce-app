# 👨‍💻 BabyChic Cameroun - Guide de Développement Frontend

> **Guide complet pour les développeurs** - Configuration, workflow et bonnes pratiques

---

## 📋 Table des Matières

1. [Setup Environnement](#setup-environnement)
2. [Workflow de Développement](#workflow-développement)
3. [Standards de Code](#standards-de-code)
4. [Composants et UI](#composants-ui)
5. [Gestion des États](#gestion-états)
6. [API et Services](#api-services)
7. [Testing Strategy](#testing-strategy)
8. [Performance Guidelines](#performance-guidelines)
9. [Déploiement](#déploiement)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Environnement

### Prérequis Système

```bash
# Versions requises
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.30.0

# Vérification des versions
node --version
npm --version
git --version
```

### Installation Initiale

```bash
# 1. Cloner le projet
git clone https://github.com/your-org/babychic-frontend.git
cd babychic-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Lancer le serveur de développement
npm run dev
```

### Configuration IDE (VS Code)

```json
// .vscode/settings.json - Configuration recommandée
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  }
}
```

### Extensions VS Code Recommandées

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.sublime-keybindings",
    "ms-vscode.vscode-react-javascript-snippets"
  ]
}
```

---

## 🔄 Workflow de Développement

### Git Workflow (Feature Branch)

```bash
# 1. Créer une nouvelle branche pour une feature
git checkout main
git pull origin main
git checkout -b feature/product-comparison

# 2. Développer la feature avec commits atomiques
git add .
git commit -m "feat: add product comparison modal component"

# 3. Push et créer la PR
git push origin feature/product-comparison
# Créer Pull Request sur GitHub

# 4. Après review et merge
git checkout main
git pull origin main
git branch -d feature/product-comparison
```

### Convention de Commits (Conventional Commits)

```bash
# Format: type(scope): description
# Types valides: feat, fix, docs, style, refactor, test, chore

# Exemples
feat(catalog): add product filtering by category
fix(cart): resolve quantity update issue
docs(readme): update installation instructions
style(ui): improve mobile responsive design
refactor(auth): simplify login flow
test(product): add unit tests for ProductCard
chore(deps): update react to v18.2.0
```

### Scripts NPM

```json
// package.json - Scripts disponibles
{
  "scripts": {
    "dev": "vite",                        // Serveur de développement
    "build": "vite build",                // Build de production
    "preview": "vite preview",            // Preview du build
    "test": "vitest",                     // Tests unitaires
    "test:ui": "vitest --ui",             // Interface graphique des tests
    "test:coverage": "vitest --coverage", // Tests avec coverage
    "lint": "eslint . --ext js,jsx",      // Linting
    "lint:fix": "eslint . --ext js,jsx --fix", // Fix automatique
    "format": "prettier --write .",       // Formatage code
    "analyze": "npm run build -- --analyze" // Analyse du bundle
  }
}
```

---

## 📏 Standards de Code

### Structure de Fichier

```jsx
/**
 * Template standard pour un composant React
 * 
 * 1. Imports (grouped by type)
 * 2. Types/PropTypes
 * 3. Component definition
 * 4. Exports
 */

// 1. React imports
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Third-party imports
import { toast } from 'react-hot-toast';

// 3. Internal imports (hooks, services, utils)
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/products';
import { formatPrice } from '../../utils/formatters';

// 4. Component imports
import LoadingSpinner from '../LoadingSpinner';

// 5. Types (si TypeScript)
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// 6. Composant principal
const ProductCard = ({ product, onAddToCart }) => {
  // Hooks (toujours en haut)
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // État local
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Effects
  useEffect(() => {
    // Logique d'effet
  }, []);
  
  // Callbacks mémorisés
  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(t('product.added_to_cart'));
    }
  }, [product, onAddToCart, t]);
  
  // Render guards
  if (loading) return <LoadingSpinner />;
  
  // Render principal
  return (
    <article className="product-card">
      {/* JSX content */}
    </article>
  );
};

// 7. PropTypes (si pas TypeScript)
ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func
};

// 8. Default props
ProductCard.defaultProps = {
  onAddToCart: null
};

// 9. Export
export default ProductCard;
```

### Conventions de Nommage

```jsx
// 1. Composants: PascalCase
const ProductCard = () => {};
const AdminDashboard = () => {};

// 2. Fichiers: même nom que le composant
ProductCard.jsx
AdminDashboard.jsx

// 3. Hooks: camelCase avec préfixe 'use'
const useAuth = () => {};
const useLocalStorage = () => {};

// 4. Services: camelCase avec suffixe 'Service'
const productService = {};
const authService = {};

// 5. Utilitaires: camelCase
const formatPrice = () => {};
const validateEmail = () => {};

// 6. Constants: SCREAMING_SNAKE_CASE
const API_ENDPOINTS = {};
const DEFAULT_LANGUAGE = 'fr';

// 7. Variables: camelCase
const isLoading = false;
const userProfile = {};
```

### CSS Classes et Styling

```jsx
// 1. Utiliser Tailwind classes utilitaires
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// 2. Grouper les classes par catégorie
<div className={cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'p-4 m-2',
  // Background & Colors  
  'bg-white text-gray-900',
  // Border & Effects
  'rounded-lg shadow-sm border',
  // States
  'hover:shadow-md transition-shadow',
  // Responsive
  'sm:p-6 md:flex-row'
)}>

// 3. Classes conditionnelles
<button className={cn(
  'btn-base',
  {
    'btn-primary': variant === 'primary',
    'btn-secondary': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled
  }
)}>

// 4. Éviter les styles inline (sauf valeurs dynamiques)
// ❌ Éviter
<div style={{ color: 'red', padding: '1rem' }}>

// ✅ Préférer
<div className="text-red-500 p-4">

// ✅ OK pour valeurs dynamiques
<div style={{ backgroundColor: themeColor }}>
```

---

## 🧩 Composants et UI

### Architecture des Composants

```
src/components/
├── Layout/              # Composants de mise en page
│   ├── Header.jsx      # Navigation principale
│   ├── Footer.jsx      # Pied de page
│   └── Sidebar.jsx     # Barre latérale
├── UI/                 # Composants d'interface de base
│   ├── Button.jsx      # Boutons réutilisables
│   ├── Input.jsx       # Champs de saisie
│   ├── Modal.jsx       # Modales
│   └── Card.jsx        # Cartes
├── Product/            # Composants liés aux produits
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   └── ProductFilter.jsx
└── Cart/               # Composants du panier
    ├── CartItem.jsx
    ├── CartSummary.jsx
    └── CartDrawer.jsx
```

### Composant UI de Base

```jsx
// components/UI/Button.jsx - Bouton réutilisable
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  loading,
  ...props
}, ref) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
```

### Composant Composite

```jsx
// components/Product/ProductGrid.jsx - Grille de produits
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ProductCard from './ProductCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';

const ProductGrid = ({ 
  products = [], 
  loading = false,
  itemsPerPage = 12,
  showPagination = true 
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination des produits
  const paginatedProducts = useMemo(() => {
    if (!showPagination) return products;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // États de chargement et vide
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="🛍️"
        title={t('products.no_products')}
        description={t('products.no_products_description')}
      />
    );
  }

  return (
    <>
      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="h-full"
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('pagination.previous')}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  page === currentPage
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('pagination.next')}
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
```

---

## 🔄 Gestion des États

### Context Pattern

```jsx
// context/CartContext.jsx - Panier avec reducer pattern
import { createContext, useContext, useReducer, useEffect } from 'react';

// Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // Article déjà présent, augmenter la quantité
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return { ...state, items: updatedItems };
      }

      // Nouvel article
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case CART_ACTIONS.LOAD_CART:
      return { ...state, items: action.payload.items };

    default:
      return state;
  }
};

// État initial
const initialState = {
  items: [],
  isOpen: false
};

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persistance localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: JSON.parse(savedCart)
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { ...product, quantity }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id: productId }
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Sélecteurs mémorisés
  const cartItemsCount = state.items.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    // State
    items: state.items,
    isOpen: state.isOpen,
    cartItemsCount,
    cartTotal,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

### Custom Hooks

```jsx
// hooks/useLocalStorage.js - Hook pour localStorage
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // État avec fonction de lazy initialization
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value) => {
    try {
      // Permettre à value d'être une fonction pour la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Écouter les changements dans d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

// hooks/useDebounce.js - Hook pour debouncing
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Utilisation
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Effectuer la recherche
      searchProducts(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher des produits..."
    />
  );
};
```

---

## 🌐 API et Services

### Service Layer Architecture

```jsx
// services/api.js - Configuration API centralisée
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Instance principale
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteurs pour token et erreurs
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Factory pour créer des services
export const createApiService = (basePath) => {
  return {
    get: (endpoint = '', params = {}) => 
      api.get(`${basePath}${endpoint}`, { params }),
    
    post: (endpoint = '', data = {}) => 
      api.post(`${basePath}${endpoint}`, data),
    
    put: (endpoint = '', data = {}) => 
      api.put(`${basePath}${endpoint}`, data),
    
    patch: (endpoint = '', data = {}) => 
      api.patch(`${basePath}${endpoint}`, data),
    
    delete: (endpoint = '') => 
      api.delete(`${basePath}${endpoint}`)
  };
};

export default api;
```

### Services Spécialisés

```jsx
// services/productService.js - Service produits
import { createApiService } from './api';

const productApi = createApiService('/public/products');

export const productService = {
  // Récupérer tous les produits
  async getProducts(params = {}) {
    try {
      const response = await productApi.get('', params);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors du chargement des produits'
      };
    }
  },

  // Récupérer un produit par slug
  async getProductBySlug(slug) {
    try {
      const response = await productApi.get(`/${slug}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Produit non trouvé'
      };
    }
  },

  // Recherche de produits
  async searchProducts(query, filters = {}) {
    const params = {
      search: query,
      ...filters
    };

    return this.getProducts(params);
  },

  // Produits populaires
  async getPopularProducts(limit = 8) {
    return this.getProducts({ 
      sort: 'popularity', 
      limit 
    });
  }
};

// services/orderService.js - Service commandes
import { createApiService } from './api';

const orderApi = createApiService('/public/orders');

export const orderService = {
  // Créer une commande
  async createOrder(orderData) {
    try {
      const response = await orderApi.post('', orderData);
      return {
        success: true,
        data: response.data.data,
        message: 'Commande créée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création de la commande'
      };
    }
  },

  // Vérifier le statut d'une commande
  async getOrderStatus(orderNumber) {
    try {
      const response = await orderApi.get(`/${orderNumber}/status`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Commande non trouvée'
      };
    }
  }
};
```

### React Query Integration (Optionnel)

```jsx
// hooks/useProducts.js - Hook React Query pour produits
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

// Clés de cache
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (slug) => [...productKeys.details(), slug]
};

// Hook pour récupérer la liste des produits
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true
  });
};

// Hook pour récupérer un produit par slug
export const useProduct = (slug) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Hook pour la recherche avec debouncing
export const useProductSearch = (query, filters = {}) => {
  const debouncedQuery = useDebounce(query, 300);
  
  return useQuery({
    queryKey: productKeys.list({ search: debouncedQuery, ...filters }),
    queryFn: () => productService.searchProducts(debouncedQuery, filters),
    enabled: debouncedQuery.length >= 2,
    keepPreviousData: true
  });
};

// Usage dans un composant
const ProductCatalog = () => {
  const [filters, setFilters] = useState({});
  
  const {
    data: productsResult,
    isLoading,
    error,
    refetch
  } = useProducts(filters);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!productsResult?.success) return <ErrorMessage error={productsResult.error} />;

  return (
    <div>
      <ProductFilters onChange={setFilters} />
      <ProductGrid products={productsResult.data} />
    </div>
  );
};
```

---

## 🧪 Testing Strategy

### Types de Tests

```jsx
// 1. Tests Unitaires - Composants isolés
// __tests__/components/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductCard from '../components/Product/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 25000,
  featured_image: '/test.jpg',
  is_in_stock: true
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('25000 CFA')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});

// 2. Tests d'Intégration - Avec contextes
// __tests__/integration/Cart.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import Cart from '../pages/Cart';

const CartWithProvider = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

describe('Cart Integration', () => {
  it('adds and removes items correctly', () => {
    render(
      <CartWithProvider>
        <Cart />
        <ProductCard product={mockProduct} />
      </CartWithProvider>
    );

    // Ajouter un produit
    fireEvent.click(screen.getByText('Ajouter au panier'));
    expect(screen.getByText('1 article')).toBeInTheDocument();

    // Supprimer le produit
    fireEvent.click(screen.getByText('Supprimer'));
    expect(screen.getByText('Panier vide')).toBeInTheDocument();
  });
});

// 3. Tests E2E - Playwright
// e2e/checkout.spec.js
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/');

  // Ajouter un produit au panier
  await page.click('[data-testid="product-card"]:first-child button');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

  // Aller au panier
  await page.click('[data-testid="cart-button"]');
  await expect(page.locator('h1')).toHaveText('Panier');

  // Procéder au checkout
  await page.click('text=Commander');
  
  // Remplir le formulaire
  await page.fill('[name="customer_email"]', 'test@example.com');
  await page.fill('[name="customer_phone"]', '+237600000000');
  
  // Valider la commande
  await page.click('text=Passer la commande');
  await expect(page.locator('h1')).toHaveText('Commande confirmée');
});
```

### Test Utilities

```jsx
// utils/test-utils.jsx - Utilitaires de test
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Provider de test avec tous les contextes
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </CartProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

// Render personnalisé avec providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mocks courants
export const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 25000,
  featured_image: '/test.jpg',
  is_in_stock: true,
  rating_average: 4.5,
  rating_count: 10
};

export const mockUser = {
  id: '1',
  email: 'admin@test.com',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'User'
};
```

---

## ⚡ Performance Guidelines

### Optimisation des Composants

```jsx
// 1. React.memo pour éviter les re-renders
const ProductCard = React.memo(({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      {/* Contenu du produit */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparaison personnalisée si nécessaire
  return prevProps.product.id === nextProps.product.id;
});

// 2. useMemo pour les calculs coûteux
const ProductList = ({ products, filters }) => {
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Logique de filtrage complexe
      return applyFilters(product, filters);
    }).sort((a, b) => {
      // Logique de tri
      return sortProducts(a, b, filters.sort);
    });
  }, [products, filters]);

  return <ProductGrid products={filteredProducts} />;
};

// 3. useCallback pour les fonctions
const ProductCatalog = () => {
  const [filters, setFilters] = useState({});
  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);
  
  const handleProductSelect = useCallback((product) => {
    // Logique de sélection
  }, []);

  return (
    <div>
      <ProductFilters onChange={handleFilterChange} />
      <ProductGrid products={products} onSelect={handleProductSelect} />
    </div>
  );
};
```

### Code Splitting Avancé

```jsx
// 1. Lazy loading par route
const HomePage = lazy(() => import('../pages/Home'));
const CatalogPage = lazy(() => import('../pages/Catalog'));

// 2. Lazy loading conditionnel
const AdminDashboard = lazy(() => 
  import('../pages/Admin/Dashboard').then(module => ({
    default: module.AdminDashboard
  }))
);

// 3. Preload des composants critiques
const ProductDetailPage = lazy(() => {
  const componentImport = import('../pages/ProductDetail');
  
  // Precharger après 2 secondes d'inactivité
  setTimeout(() => {
    componentImport;
  }, 2000);
  
  return componentImport;
});

// 4. Code splitting par feature
const ComparisonModal = lazy(() => 
  import('../components/Product/ComparisonModal')
);

const ProductCard = ({ product }) => {
  const [showComparison, setShowComparison] = useState(false);
  
  return (
    <div>
      {/* Contenu de la carte */}
      
      {showComparison && (
        <Suspense fallback={<div>Chargement...</div>}>
          <ComparisonModal product={product} />
        </Suspense>
      )}
    </div>
  );
};
```

### Image Optimization

```jsx
// components/OptimizedImage.jsx
const OptimizedImage = ({ 
  src, 
  alt, 
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  loading = 'lazy'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Générer les URLs pour différentes tailles
  const generateSrcSet = (baseSrc) => {
    return [
      `${baseSrc}?w=400&q=80 400w`,
      `${baseSrc}?w=800&q=80 800w`,
      `${baseSrc}?w=1200&q=80 1200w`
    ].join(', ');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder pendant le chargement */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Image principale */}
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={loading}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
      
      {/* Fallback en cas d'erreur */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};
```

---

## 🚀 Déploiement

### Build et Optimisation

```bash
# 1. Vérifications avant build
npm run lint
npm run test
npm audit

# 2. Build de production
npm run build

# 3. Preview local du build
npm run preview

# 4. Analyse du bundle
npm run build -- --analyze
```

### Configuration Vite Optimisée

```javascript
// vite.config.js - Configuration production
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
      }
    })
  ],
  
  build: {
    // Optimisations de build
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    
    rollupOptions: {
      output: {
        // Chunking strategy
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    },
    
    // Taille maximale des chunks
    chunkSizeWarningLimit: 600
  },
  
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  
  // Configuration des assets
  assetsInclude: ['**/*.woff2', '**/*.woff']
}));
```

### Variables d'Environnement Production

```bash
# .env.production
VITE_API_URL=https://api.babychic.cm/api
VITE_APP_ENV=production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

---

## 🔧 Troubleshooting

### Problèmes Courants

#### 1. Hydration Mismatch (SSR)
```jsx
// Solution: useEffect pour le contenu dynamique
const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; // Placeholder
  }

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
};
```

#### 2. Memory Leaks
```jsx
// Solution: Cleanup dans useEffect
const ProductTimer = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    // ✅ Cleanup important
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchProductData(product.id).then(data => {
      if (mounted) {
        setData(data);
      }
    });

    // ✅ Éviter les setState après unmount
    return () => {
      mounted = false;
    };
  }, [product.id]);
};
```

#### 3. Performance Issues
```jsx
// Diagnostic avec React DevTools Profiler
// 1. Identifier les composants qui re-render souvent
// 2. Vérifier les dépendances useEffect
// 3. Mémoriser les calculs coûteux

// Solution: Optimisation ciblée
const ExpensiveComponent = React.memo(({ data, filters }) => {
  const processedData = useMemo(() => {
    // Calcul coûteux
    return heavyProcessing(data, filters);
  }, [data, filters]);

  return <div>{processedData.map(...)}</div>;
});
```

### Debug Tools

```jsx
// utils/debug.js - Utilitaires de debug
export const debugLog = (message, data) => {
  if (import.meta.env.DEV) {
    console.log(`🐛 ${message}:`, data);
  }
};

export const debugPerformance = (label, fn) => {
  if (import.meta.env.DEV) {
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
  }
  return fn();
};

// Hook pour debug re-renders
export const useWhyDidYouUpdate = (name, props) => {
  const previous = useRef();
  
  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedKeys = {};
      
      allKeys.forEach(key => {
        if (previous.current[key] !== props[key]) {
          changedKeys[key] = {
            from: previous.current[key],
            to: props[key]
          };
        }
      });
      
      if (Object.keys(changedKeys).length) {
        console.log('[why-did-you-update]', name, changedKeys);
      }
    }
    
    previous.current = props;
  });
};
```

---

## 📚 Ressources et Références

### Documentation Officielle
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

### Outils de Développement
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Axe Accessibility](https://www.deque.com/axe/browser-extensions/)

### Testing
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**© 2024 BabyChic Cameroun - Guide de Développement Frontend v1.0**

*Ce guide évolue avec les pratiques de l'équipe de développement*
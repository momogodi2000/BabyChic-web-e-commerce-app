import { createContext, useContext, useState, useEffect } from 'react'

const CompareContext = createContext()

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([])

  useEffect(() => {
    // Load from localStorage on mount
    const savedCompare = localStorage.getItem('babychic-compare')
    if (savedCompare) {
      try {
        setCompareList(JSON.parse(savedCompare))
      } catch (error) {
        console.error('Error loading compare list:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever compareList changes
    localStorage.setItem('babychic-compare', JSON.stringify(compareList))
  }, [compareList])

  const addToCompare = (product) => {
    setCompareList(prevList => {
      // Check if product already exists
      if (prevList.some(item => item.id === product.id)) {
        return prevList
      }
      
      // Limit to 3 products for comparison
      if (prevList.length >= 3) {
        return [...prevList.slice(1), product]
      }
      
      return [...prevList, product]
    })
  }

  const removeFromCompare = (productId) => {
    setCompareList(prevList => prevList.filter(item => item.id !== productId))
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const isInCompare = (productId) => {
    return compareList.some(item => item.id === productId)
  }

  const getCompareCount = () => {
    return compareList.length
  }

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    getCompareCount
  }

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}

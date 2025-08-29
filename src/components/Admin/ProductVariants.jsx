import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { productsAPI } from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save,
  X,
  Copy,
  Package,
  Palette,
  Ruler,
  Image as ImageIcon
} from 'lucide-react';

const ProductVariants = ({ product, onUpdate }) => {
  const { t } = useTranslation();
  const [variants, setVariants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: product?.price || 0,
    stock_quantity: 0,
    size: '',
    color: '',
    weight: '',
    images: []
  });

  // Initialize variants from product data
  useEffect(() => {
    if (product?.variants) {
      try {
        const productVariants = typeof product.variants === 'string' 
          ? JSON.parse(product.variants) 
          : product.variants;
        setVariants(Array.isArray(productVariants) ? productVariants : []);
      } catch (e) {
        setVariants([]);
      }
    } else {
      // Create variants from colors and sizes if they exist
      const colors = product?.colors ? 
        (typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors) : [];
      const sizes = product?.sizes ? 
        (typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes) : [];

      if (colors.length > 0 || sizes.length > 0) {
        const generatedVariants = [];
        
        if (colors.length > 0 && sizes.length > 0) {
          // Create combinations of colors and sizes
          colors.forEach(color => {
            sizes.forEach(size => {
              generatedVariants.push({
                id: Date.now() + Math.random(),
                name: `${product.name} - ${color} ${size}`,
                sku: `${product.sku || 'PROD'}-${color.substr(0,3).toUpperCase()}-${size}`,
                price: product.price,
                stock_quantity: Math.floor(product.stock_quantity / (colors.length * sizes.length)),
                size: size,
                color: color,
                weight: product.weight || '',
                images: []
              });
            });
          });
        } else if (colors.length > 0) {
          // Only colors
          colors.forEach(color => {
            generatedVariants.push({
              id: Date.now() + Math.random(),
              name: `${product.name} - ${color}`,
              sku: `${product.sku || 'PROD'}-${color.substr(0,3).toUpperCase()}`,
              price: product.price,
              stock_quantity: Math.floor(product.stock_quantity / colors.length),
              size: '',
              color: color,
              weight: product.weight || '',
              images: []
            });
          });
        } else if (sizes.length > 0) {
          // Only sizes
          sizes.forEach(size => {
            generatedVariants.push({
              id: Date.now() + Math.random(),
              name: `${product.name} - ${size}`,
              sku: `${product.sku || 'PROD'}-${size}`,
              price: product.price,
              stock_quantity: Math.floor(product.stock_quantity / sizes.length),
              size: size,
              color: '',
              weight: product.weight || '',
              images: []
            });
          });
        }

        setVariants(generatedVariants);
      }
    }
  }, [product]);

  const handleAddVariant = () => {
    const variant = {
      ...newVariant,
      id: Date.now() + Math.random(),
      name: newVariant.name || `${product.name} - Variant ${variants.length + 1}`
    };
    
    setVariants([...variants, variant]);
    setNewVariant({
      name: '',
      sku: '',
      price: product?.price || 0,
      stock_quantity: 0,
      size: '',
      color: '',
      weight: '',
      images: []
    });
  };

  const handleUpdateVariant = (index, field, value) => {
    const updatedVariants = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };

  const handleDeleteVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleDuplicateVariant = (index) => {
    const variantToDuplicate = variants[index];
    const duplicatedVariant = {
      ...variantToDuplicate,
      id: Date.now() + Math.random(),
      name: `${variantToDuplicate.name} (Copy)`,
      sku: `${variantToDuplicate.sku}-COPY`
    };
    setVariants([...variants, duplicatedVariant]);
  };

  const handleSave = async () => {
    try {
      // Update the product with variants
      const updatedProduct = {
        ...product,
        variants: JSON.stringify(variants),
        // Update total stock to sum of all variants
        stock_quantity: variants.reduce((sum, variant) => sum + (parseInt(variant.stock_quantity) || 0), 0)
      };
      
      // Make API call to update the product
      const response = await productsAPI.updateProduct(product.id, updatedProduct);
      
      onUpdate(response.product || updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving variants:', error);
      // You could show a toast notification here
      alert('Erreur lors de la sauvegarde des variantes');
    }
  };

  const getTotalStock = () => {
    return variants.reduce((sum, variant) => sum + (parseInt(variant.stock_quantity) || 0), 0);
  };

  const getAveragePrice = () => {
    if (variants.length === 0) return 0;
    const total = variants.reduce((sum, variant) => sum + (parseFloat(variant.price) || 0), 0);
    return (total / variants.length).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">
            {t('admin.products.variants.title')}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {variants.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800 p-2"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>{t('admin.common.save')}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 p-2"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{t('admin.products.variants.totalStock')}</p>
          <p className="text-2xl font-bold text-gray-900">{getTotalStock()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{t('admin.products.variants.averagePrice')}</p>
          <p className="text-2xl font-bold text-gray-900">{getAveragePrice()} XAF</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{t('admin.products.variants.totalVariants')}</p>
          <p className="text-2xl font-bold text-gray-900">{variants.length}</p>
        </div>
      </div>

      {/* Add New Variant Form */}
      {isEditing && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {t('admin.products.variants.addNew')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.variants.variantName')}
              </label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('admin.products.variants.variantNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="SKU-VAR-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.price')}
              </label>
              <input
                type="number"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Palette className="inline h-4 w-4 mr-1" />
                {t('admin.products.color')}
              </label>
              <input
                type="text"
                value={newVariant.color}
                onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('admin.products.colorPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Ruler className="inline h-4 w-4 mr-1" />
                {t('admin.products.size')}
              </label>
              <input
                type="text"
                value={newVariant.size}
                onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('admin.products.sizePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.stock')}
              </label>
              <input
                type="number"
                value={newVariant.stock_quantity}
                onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAddVariant}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('admin.products.variants.add')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Variants List */}
      <div className="space-y-4">
        {variants.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('admin.products.variants.noVariants')}</p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('admin.products.variants.addFirst')}
              </button>
            )}
          </div>
        ) : (
          variants.map((variant, index) => (
            <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.products.variants.variantName')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{variant.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-600">{variant.sku}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.products.price')}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleUpdateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{variant.price} XAF</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.products.stock')}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={variant.stock_quantity}
                      onChange={(e) => handleUpdateVariant(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className={`font-medium ${variant.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {variant.stock_quantity}
                    </p>
                  )}
                </div>

                {/* Color and Size */}
                <div className="col-span-full grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Palette className="inline h-4 w-4 mr-1" />
                      {t('admin.products.color')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => handleUpdateVariant(index, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        {variant.color && (
                          <div 
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: variant.color.toLowerCase() }}
                          />
                        )}
                        <span className="text-gray-600">{variant.color || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Ruler className="inline h-4 w-4 mr-1" />
                      {t('admin.products.size')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="text-gray-600">{variant.size || 'N/A'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {isEditing && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDuplicateVariant(index)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title={t('admin.products.variants.duplicate')}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVariant(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title={t('admin.products.variants.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductVariants;
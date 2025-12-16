import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '../../store/slices/adminSlice';
import { useToast } from '../../contexts/ToastContext';
import api from '../../utils/api';

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState(product?.images || ['']);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '1',
      image: '',
      isAvailable: true,
      featured: false
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data.data || data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to hardcoded categories
      setCategories(['Coffee', 'Tea', 'Beverages', 'Snacks', 'Desserts', 'Breakfast', 'Lunch']);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image || imageUrls[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&crop=center',
        images: imageUrls.filter(url => url.trim() !== ''),
        stock: parseInt(data.stock),
        isAvailable: Boolean(data.isAvailable),
        featured: Boolean(data.featured)
      };
      
      if (product) {
        await dispatch(updateProduct({ id: product._id, productData: formattedData }));
        toast.success('Product updated successfully! ✅');
      } else {
        await dispatch(createProduct(formattedData));
        toast.success('Product created successfully! 🎉');
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-spacing w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-amber-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="form-spacing">
            <label className="block text-sm font-semibold text-amber-800 mb-3">Product Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="form-spacing">
            <label className="block text-sm font-semibold text-amber-800 mb-3">Product Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-3">Price (₹)</label>
              <input
                {...register('price', { 
                  required: 'Price is required', 
                  min: { value: 0.01, message: 'Price must be greater than 0' }
                })}
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-3">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={typeof cat === 'string' ? cat : cat._id} value={typeof cat === 'string' ? cat : cat.name}>
                    {typeof cat === 'string' ? cat : cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-3">Stock Quantity</label>
              <input
                {...register('stock', { 
                  required: 'Stock is required', 
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                type="number"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                placeholder="0"
              />
              {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-3">Main Image URL</label>
              <input
                {...register('image')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="bg-blue-50 card-spacing rounded-2xl border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Images (Optional)</h3>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...imageUrls];
                      newUrls[index] = e.target.value;
                      setImageUrls(newUrls);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Image URL ${index + 1}`}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newUrls = imageUrls.filter((_, i) => i !== index);
                        setImageUrls(newUrls);
                      }}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setImageUrls([...imageUrls, ''])}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Another Image URL
              </button>
            </div>
          </div>

          <div className="bg-amber-50 card-spacing rounded-2xl border border-amber-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Settings</h3>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <label className="flex items-center cursor-pointer">
                <input
                  {...register('isAvailable')}
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-3 text-base font-medium text-gray-700">Available for Sale</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-3 text-base font-medium text-gray-700">Featured Product</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
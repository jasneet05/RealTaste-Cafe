import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Eye, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAllProducts, deleteProduct } from '../../store/slices/adminSlice';

import { useToast } from '../../contexts/ToastContext';
import ProductForm from '../../components/admin/ProductForm';
import ProductDetailModal from '../../components/ui/ProductDetailModal';
import BulkImport from '../../components/admin/BulkImport';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { products = [], loading } = useSelector(state => state.admin);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    dispatch(fetchAllProducts());
    fetchCategoriesData();
  }, [dispatch]);

  const fetchCategoriesData = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === '' || product.category === selectedCategory
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setActionLoading(true);
      try {
        await dispatch(deleteProduct(id));
        toast.success('Product deleted successfully! 🗑️');
      } catch (err) {
        toast.error('Failed to delete product');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleView = (product) => {
    setViewingProduct(product);
  };

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing mb-12 border-2 border-amber-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-1">Manage your menu items and inventory</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowBulkImport(!showBulkImport)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>{showBulkImport ? 'Hide' : 'Show'} Bulk Import</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>
        </div>

        {showBulkImport && (
          <div className="mb-8">
            <BulkImport 
              type="products" 
              onSuccess={() => {
                dispatch(fetchAllProducts());
                setShowBulkImport(false);
              }} 
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-amber-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Products ({products.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Product</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Category</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Price</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Stock</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Status</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="table-cell-spacing whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60&h=60&fit=crop&crop=center'} 
                            alt={product.name}
                            className="h-14 w-14 rounded-xl object-cover shadow-md"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-amber-900 font-serif">{product.name}</div>
                            <div className="text-sm text-amber-700 line-clamp-1 font-serif">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">{product.category}</td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif font-bold">₹{product.price}</td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">{product.stock}</td>
                      <td className="table-cell-spacing whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full font-serif ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleView(product)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(product)}
                            className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-50 transition-all"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg font-medium">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-amber-200">
            <div className="text-center py-20 card-spacing">
              <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by adding your first product to the menu</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-lg"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <ProductForm 
            product={editingProduct} 
            onClose={handleCloseModal} 
          />
        )}

        {viewingProduct && (
          <ProductDetailModal 
            product={viewingProduct} 
            onClose={() => setViewingProduct(null)} 
          />
        )}
        
        {actionLoading && <LoadingOverlay message="Processing product action..." />}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import api from '../../utils/api';
import BulkImport from '../../components/admin/BulkImport';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data.data || data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setActionLoading(true);
      try {
        await api.delete(`/api/categories/${id}`);
        setCategories(categories.filter(cat => cat._id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (categoryData) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory._id}`, categoryData);
      } else {
        await api.post('/api/categories', categoryData);
      }
      handleCloseModal();
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing mb-12 border-2 border-amber-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
              <p className="text-gray-600 mt-1">Organize your menu items by categories</p>
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
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>

        {showBulkImport && (
          <div className="mb-8">
            <BulkImport 
              type="categories" 
              onSuccess={() => {
                fetchCategories();
                setShowBulkImport(false);
              }} 
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-amber-200">
            <div className="text-center py-20 card-spacing">
              <Tag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No categories found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Create categories to organize your menu items</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-lg"
              >
                Create First Category
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-amber-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Categories ({categories.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Name</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Slug</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Status</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Created</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-200">
                  {categories.filter(category => category && category._id).map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="table-cell-spacing whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-amber-100 p-2 rounded-full mr-4">
                            <Tag className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-amber-900 font-serif">{category.name || 'Unnamed'}</div>
                            {category.description && (
                              <div className="text-sm text-amber-700 line-clamp-1 font-serif">{category.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">{category.slug || '-'}</td>
                      <td className="table-cell-spacing whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full font-serif ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleEdit(category)}
                            className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-50 transition-all"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(category._id)}
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
          </div>
        )}

        {showModal && (
          <CategoryForm 
            category={editingCategory} 
            onClose={handleCloseModal}
            onSave={handleSaveCategory}
          />
        )}
        
        {actionLoading && <LoadingOverlay message={editingCategory ? "Updating category..." : "Adding category..."} />}
      </div>
    </AdminLayout>
  );
};

const CategoryForm = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    isActive: category?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await onSave({ ...formData, slug });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-spacing w-full max-w-2xl shadow-2xl border-2 border-amber-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="h-6 w-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-spacing">
            <label className="block text-sm font-semibold text-amber-800 mb-3">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="form-spacing">
            <label className="block text-sm font-semibold text-amber-800 mb-3">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              placeholder="Enter category description"
            />
          </div>

          <div className="bg-amber-50 card-spacing rounded-2xl border border-amber-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="ml-3 text-base font-medium text-gray-700">Active Category</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
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

export default AdminCategories;
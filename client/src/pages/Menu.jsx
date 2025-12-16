import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';

const Menu = () => {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [filterRating, setFilterRating] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const avgRating = product?.reviews?.length > 0 
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
      : 0;
    const matchesRating = filterRating === 0 || avgRating >= filterRating;
    return matchesCategory && matchesSearch && matchesRating && product.isAvailable;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        const aRating = a?.reviews?.length > 0 ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
        const bRating = b?.reviews?.length > 0 ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
        return bRating - aRating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy, filterRating]);

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 text-white section-spacing relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative container mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="mb-6">
            <Coffee className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-6 text-yellow-100">Takeaway Menu</h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto mb-4">Fresh food & beverages ready for pickup 🛒☕</p>
          <p className="text-lg text-yellow-300 italic font-serif">
            "Order karo online, fresh banake denge" - Order online, we'll make it fresh for you
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
            <input
              type="text"
              placeholder="What would you like to order? 🍽️"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 shadow-md text-lg bg-white/80 backdrop-blur-sm font-serif"
            />
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border-2 border-amber-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">Minimum Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={2}>2+ Stars</option>
                <option value={1}>1+ Stars</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-amber-700">
                Showing {paginatedProducts.length} of {filteredProducts.length} items
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-3 rounded-full font-serif font-semibold transition-all transform hover:scale-105 ${
              selectedCategory === 'All'
                ? 'bg-amber-700 text-yellow-100 shadow-lg'
                : 'bg-white/80 text-amber-800 hover:bg-amber-100 border-2 border-amber-300 hover:border-amber-400 backdrop-blur-sm'
            }`}
          >
            🍽️ All Items
          </button>
          {categories.filter(cat => cat.isActive).map(category => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-3 rounded-full font-serif font-semibold transition-all transform hover:scale-105 ${
                selectedCategory === category.name
                  ? 'bg-amber-700 text-yellow-100 shadow-lg'
                  : 'bg-white/80 text-amber-800 hover:bg-amber-100 border-2 border-amber-300 hover:border-amber-400 backdrop-blur-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl mx-4 card-spacing">
            <div className="text-6xl mb-6">😔</div>
            <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">Nothing matches your taste</h3>
            <p className="text-amber-700 text-lg">Try a different search or explore all our offerings</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-white/80 border-2 border-amber-300 rounded-full disabled:opacity-50 hover:bg-amber-100 transition-all"
                >
                  <ChevronLeft className="h-5 w-5 text-amber-700" />
                  <span className="ml-1 text-amber-700 font-serif">Previous</span>
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-serif font-bold transition-all ${
                        currentPage === page
                          ? 'bg-amber-700 text-yellow-100 shadow-lg'
                          : 'bg-white/80 text-amber-700 border-2 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-white/80 border-2 border-amber-300 rounded-full disabled:opacity-50 hover:bg-amber-100 transition-all"
                >
                  <span className="mr-1 text-amber-700 font-serif">Next</span>
                  <ChevronRight className="h-5 w-5 text-amber-700" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
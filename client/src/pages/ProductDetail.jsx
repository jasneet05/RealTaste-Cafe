import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };



  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`Added ${quantity} ${product.name} to cart! 🛒`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }
    
    try {
      // Simulate review submission
      toast.success('Review feature coming soon! ⭐');
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setEditingReview(false);
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };



  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">Product not found</h2>
        </div>
      </div>
    );
  }

  const avgRating = product?.reviews?.length > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border-2 border-amber-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(Math.round(avgRating))}</div>
                <span className="ml-2 text-amber-700 font-serif">({product?.reviews?.length || 0} reviews)</span>
              </div>
              <p className="text-amber-800 font-serif text-lg mb-6">{product.description}</p>
              <div className="text-3xl font-bold text-amber-900 mb-6">₹{product.price}</div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border-2 border-amber-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-amber-700 hover:bg-amber-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-serif font-bold text-amber-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-amber-700 hover:bg-amber-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-amber-700 text-yellow-100 py-3 px-6 rounded-lg font-serif font-bold hover:bg-amber-800 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
              
              <button
                onClick={() => {
                  handleAddToCart();
                  window.location.href = '/checkout';
                }}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-serif font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2 mt-4"
              >
                <span>🛒 Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Reviews</h2>
          </div>



          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center mb-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="ml-2 text-amber-700 font-serif text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-amber-800 font-serif">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-amber-700 font-serif">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
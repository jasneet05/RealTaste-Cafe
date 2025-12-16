import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Calendar, DollarSign, ChevronDown, ChevronUp, Eye, Star } from 'lucide-react';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { useToast } from '../contexts/ToastContext';
import api from '../utils/api';

const Orders = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { userOrders: orders = [], loading } = useSelector(state => state.orders);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/products/${reviewingItem.menuItem._id}/review`, reviewData);
      toast.success('Review submitted successfully!');
      setReviewingItem(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user, isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center card-spacing">
          <p className="text-gray-600">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Your Orders</h1>
          <p className="text-amber-700 mb-2">Track your delicious orders</p>
          <p className="text-amber-600 italic font-serif text-sm">
            "Tussi order kita, assi pyaar naal banaya" - You ordered, we made with love
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl card-spacing">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-4">No orders yet</h2>
            <p className="text-amber-700 mb-8 text-lg">Start shopping to see your orders here</p>
            <a 
              href="/menu" 
              className="bg-amber-700 text-yellow-100 px-8 py-4 rounded-full text-lg font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const isExpanded = expandedOrders.has(order._id);
              return (
                <div key={order._id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-amber-200 hover:shadow-2xl transition-all duration-300">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-900">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-serif font-semibold self-start ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-amber-700 font-serif space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm sm:text-base">{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-amber-600 text-sm">at {new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start sm:space-x-6">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-bold text-amber-900">₹{order.totalAmount}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ShoppingBag className="h-4 w-4" />
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors font-serif w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm sm:text-base">{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                          <span className="text-amber-800 font-serif text-sm">{item.menuItem?.name || 'Unknown Item'}</span>
                          <span className="text-amber-600 font-serif text-xs">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
                          <span className="text-gray-600 font-serif text-sm">+{order.items.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-amber-200 pt-6 space-y-4">
                      <h4 className="text-lg font-serif font-bold text-amber-900 mb-4">Order Details</h4>
                      
                      {/* Delivery Address */}
                      {order.shippingAddress && (
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                          <h5 className="font-serif font-semibold text-amber-900 mb-2">Delivery Address</h5>
                          <p className="text-amber-800 font-serif">
                            {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                            {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                        </div>
                      )}
                      
                      {/* Items List */}
                      <div className="space-y-3">
                        <h5 className="font-serif font-semibold text-amber-900">Items Ordered</h5>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 bg-white rounded-2xl border border-amber-200">
                            <img
                              src={item.menuItem?.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                              alt={item.menuItem?.name || 'Unknown Item'}
                              className="w-12 h-12 object-cover rounded-lg self-center sm:self-auto"
                              loading="lazy"
                            />
                            <div className="flex-1 text-center sm:text-left">
                              <h6 className="font-serif font-semibold text-amber-900">{item.menuItem?.name || 'Unknown Item'}</h6>
                              <p className="text-amber-700 font-serif text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-center sm:text-right">
                              <p className="font-serif font-bold text-amber-900">₹{item.price}</p>
                              <p className="text-amber-700 font-serif text-sm">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                              {order.status === 'Delivered' && (
                                <button
                                  onClick={() => setReviewingItem(item)}
                                  className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-full hover:bg-amber-700 transition-colors"
                                >
                                  <Star className="h-3 w-3 inline mr-1" />
                                  Review
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Order Summary */}
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                        <div className="space-y-2">
                          <div className="flex justify-between font-serif text-amber-800">
                            <span>Subtotal:</span>
                            <span>₹{(order.totalAmount - (order.shippingCost || 0)).toFixed(2)}</span>
                          </div>
                          {order.shippingCost > 0 && (
                            <div className="flex justify-between font-serif text-amber-800">
                              <span>Shipping:</span>
                              <span>₹{order.shippingCost.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-amber-200 pt-2 flex justify-between font-serif font-bold text-amber-900 text-lg">
                            <span>Total:</span>
                            <span>₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {reviewingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full">
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
                Review {reviewingItem.menuItem?.name}
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-amber-800 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                        className="text-2xl focus:outline-none"
                      >
                        <Star className={`h-6 w-6 ${star <= reviewData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-amber-800 mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setReviewingItem(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
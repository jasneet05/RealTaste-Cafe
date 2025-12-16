import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, DollarSign, MapPin, CreditCard } from 'lucide-react';
import api from '../utils/api';

const OrderSummary = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link to="/menu" className="text-amber-600 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Order Confirmed!</h1>
          <p className="text-amber-700">Thank you for your order. We'll prepare it with love!</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-amber-50 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span className="font-serif font-semibold text-amber-800">Order Date</span>
              </div>
              <p className="text-amber-900 font-serif">{new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-amber-700 text-sm">{new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-serif font-semibold text-amber-800">Order ID</span>
              </div>
              <p className="text-amber-900 font-serif font-bold">#{order._id.slice(-6)}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-4">Customer Information</h3>
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="text-amber-900 font-serif"><strong>Name:</strong> {order.user?.name || 'Unknown'}</p>
              <p className="text-amber-900 font-serif"><strong>Email:</strong> {order.user?.email || 'Unknown'}</p>
              {order.mobileNumber && (
                <p className="text-amber-900 font-serif"><strong>Mobile:</strong> {order.mobileNumber}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <CreditCard className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-serif font-bold text-amber-900">Payment Method</h3>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="text-amber-900 font-serif">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="bg-amber-50 p-4 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.menuItem?.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={item.menuItem?.name || 'Unknown Item'}
                      className="w-12 h-12 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-serif font-semibold text-amber-900">{item.menuItem?.name || 'Unknown Item'}</p>
                      <p className="text-amber-700 font-serif text-sm">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-amber-900 font-serif">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl mb-8">
            <div className="flex justify-between items-center text-2xl font-serif font-bold text-amber-900">
              <span>Total Amount:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {order.specialInstructions && (
            <div className="mb-8">
              <h3 className="text-lg font-serif font-bold text-amber-900 mb-2">Special Instructions</h3>
              <div className="bg-amber-50 p-4 rounded-2xl">
                <p className="text-amber-900 font-serif">{order.specialInstructions}</p>
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-amber-700 font-serif">We'll call you when your order is ready for pickup!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                View All Orders
              </Link>
              <Link
                to="/menu"
                className="border border-amber-600 text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
import { X, Calendar, DollarSign, MapPin, CreditCard } from 'lucide-react';

const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-amber-200">
        <div className="card-spacing">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Order Details</h2>
            <button
              onClick={onClose}
              className="bg-amber-100 p-2 rounded-full hover:bg-amber-200 transition-colors"
            >
              <X className="h-5 w-5 text-amber-800" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-amber-50 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span className="font-serif font-semibold text-amber-800">Order Date</span>
              </div>
              <p className="text-amber-900 font-serif">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-amber-600" />
                <span className="font-serif font-semibold text-amber-800">Total Amount</span>
              </div>
              <p className="text-2xl font-bold text-amber-900 font-serif">₹{order.totalAmount}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-4">Customer Information</h3>
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="text-amber-900 font-serif"><strong>Name:</strong> {order.user?.name || 'Unknown'}</p>
              <p className="text-amber-900 font-serif"><strong>Email:</strong> {order.user?.email || 'Unknown'}</p>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-serif font-bold text-amber-900">Delivery Address</h3>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl">
                <p className="text-amber-900 font-serif">{order.shippingAddress}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <CreditCard className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-serif font-bold text-amber-900">Payment Method</h3>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="text-amber-900 font-serif">{order.paymentMethod || 'Not specified'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="bg-amber-50 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-serif font-semibold text-amber-900">{item.menuItem?.name || 'Unknown Item'}</p>
                    <p className="text-amber-700 font-serif">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-amber-900 font-serif">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 border-amber-200">
            <span className="text-xl font-serif font-bold text-amber-900">Status:</span>
            <span className={`px-4 py-2 rounded-full font-serif font-semibold ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
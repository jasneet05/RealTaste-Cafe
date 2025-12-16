import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';

const Cart = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, total } = useSelector(state => state.cart);

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    const item = items.find(item => item._id === id);
    dispatch(removeFromCart(id));
    toast.info(`${item?.name} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl card-spacing">
            <div className="text-6xl mb-6">☕</div>
            <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4">Your cart is empty</h2>
            <p className="text-amber-700 mb-8 text-lg">Let's find something delicious for you!</p>
            <Link 
              to="/menu" 
              className="bg-amber-700 text-yellow-100 px-8 py-4 rounded-full text-lg font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              🍰 Browse Our Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🛒</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Your Order</h1>
          <p className="text-amber-700">Review your delicious selections</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border-2 border-amber-200 card-spacing">
          <div className="divide-y divide-amber-200">
            {items.map(item => (
              <div key={item._id} className="content-spacing flex items-center space-x-6">
                <img 
                  src={item.image || 'https://placehold.co/80x80/f3f4f6/6b7280?text=No+Image'} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-2xl shadow-md"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-amber-900">{item.name}</h3>
                  <p className="text-amber-700 font-semibold text-lg">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-3 bg-amber-50 rounded-full p-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="p-2 rounded-full bg-white text-amber-700 hover:bg-amber-100 shadow-sm transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-8 text-center font-bold text-lg text-amber-900">{item.quantity}</span>
                  
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="p-2 rounded-full bg-amber-700 text-yellow-100 hover:bg-amber-800 shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-xl font-bold text-amber-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-amber-50 card-spacing">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-serif font-bold text-amber-900">💰 Total:</span>
              <span className="text-3xl font-bold text-amber-700">₹{total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/menu" 
                className="flex-1 bg-white text-amber-800 py-4 px-6 rounded-full text-center font-serif font-bold hover:bg-amber-100 transition-all duration-300 border-2 border-amber-300"
              >
                ☕ Continue Shopping
              </Link>
              <Link 
                to="/checkout" 
                className="flex-1 bg-amber-700 text-yellow-100 py-4 px-6 rounded-full text-center font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🛒 Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
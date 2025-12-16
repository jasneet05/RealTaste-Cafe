import { X, Star, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { useToast } from '../../contexts/ToastContext';

const ProductDetailModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🛒`);
    onClose();
  };

  const averageRating = product?.ratings?.length > 0 
    ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-amber-200">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-amber-800" />
          </button>
          
          <img 
            src={product.image || 'https://placehold.co/600x400/f3f4f6/6b7280?text=No+Image'} 
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-3xl"
          />
        </div>
        
        <div className="card-spacing">
          <div className="mb-4">
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-serif">
              {product.category}
            </span>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-amber-900 mb-4">{product.name}</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-amber-800 font-serif font-medium">
                {averageRating.toFixed(1)} ({product.numOfReviews} reviews)
              </span>
            </div>
            <div className="text-3xl font-bold text-amber-700 font-serif">₹{product.price}</div>
          </div>
          
          <p className="text-amber-800 mb-6 leading-relaxed font-serif text-lg">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="text-sm text-amber-700 font-serif">Stock Available</p>
              <p className="text-xl font-bold text-amber-900 font-serif">{product.stock}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl">
              <p className="text-sm text-amber-700 font-serif">Status</p>
              <p className={`text-xl font-bold font-serif ${product.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                {product.isAvailable ? 'Available' : 'Out of Stock'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className="w-full bg-amber-700 text-yellow-100 py-4 px-6 rounded-full font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{product.isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
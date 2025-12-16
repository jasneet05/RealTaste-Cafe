import { useDispatch } from 'react-redux';
import { Plus, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { useToast } from '../../contexts/ToastContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = [
    product.image,
    ...(product.images || [])
  ].filter(img => img && img.trim() !== '');
  
  const hasMultipleImages = allImages.length > 1;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const averageRating = product?.reviews?.length > 0 
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
    : 0;

  if (!product) {
    return null;
  }

  return (
    <Link to={`/product/${product._id}`} className="block bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden card-hover group border-2 border-amber-100 hover:border-amber-200 animate-fade-in">
      <div className="relative overflow-hidden">
        <img 
          src={allImages[currentImageIndex] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center'} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Image Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-amber-700 text-yellow-100 px-4 py-2 rounded-full font-serif font-bold shadow-lg transform group-hover:scale-110 transition-transform">
            ₹{product.price}
          </div>
        </div>
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              ⭐ Featured
            </div>
          </div>
        )}
        
        {/* Multiple Images Indicator */}
        {hasMultipleImages && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
              {currentImageIndex + 1}/{allImages.length}
            </div>
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white font-bold text-lg bg-red-600 px-6 py-3 rounded-full shadow-xl">
              Out of Stock
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            {product.category}
          </span>
        </div>
        
        {/* Product Name */}
        <h3 className="text-xl font-serif font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-amber-700 mb-4 line-clamp-2 leading-relaxed font-serif">
          {product.description}
        </p>
        
        {/* Rating and Stock */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-amber-700 font-serif ml-2">
              {averageRating.toFixed(1)} ({product.numOfReviews || 0})
            </span>
          </div>
          <div className="text-sm text-amber-600 font-serif font-semibold">
            Stock: {product.stock}
          </div>
        </div>
        
        {/* Action Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          disabled={!product.isAvailable}
          className="w-full bg-gradient-to-r from-amber-700 to-orange-700 text-yellow-100 py-3 px-4 rounded-2xl font-serif font-bold hover:from-amber-800 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{product.isAvailable ? 'Add to Cart' : 'Unavailable'}</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
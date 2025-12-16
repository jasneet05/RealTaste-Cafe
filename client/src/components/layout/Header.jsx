import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Coffee, ShoppingCart, User, Menu, X } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useToast } from '../../contexts/ToastContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    toast.info('See you soon! 👋');
  };

  return (
    <header className="bg-amber-50/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="bg-amber-700 p-1.5 sm:p-2 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-100" />
            </div>
            <span className="text-xl sm:text-3xl font-serif font-bold text-amber-900">
              Real Taste
            </span>
          </Link>

          <nav className="hidden md:flex items-center justify-center flex-1 space-x-2">
            <Link to="/" className="px-6 py-3 text-amber-800 hover:text-amber-900 font-semibold transition-all duration-300 rounded-full hover:bg-amber-100 font-serif text-sm">🏠 Home</Link>
            <Link to="/menu" className="px-6 py-3 text-amber-800 hover:text-amber-900 font-semibold transition-all duration-300 rounded-full hover:bg-amber-100 font-serif text-sm">🍽️ Menu</Link>
            <Link to="/about" className="px-6 py-3 text-amber-800 hover:text-amber-900 font-semibold transition-all duration-300 rounded-full hover:bg-amber-100 font-serif text-sm">📖 About</Link>
            <Link to="/contact" className="px-6 py-3 text-amber-800 hover:text-amber-900 font-semibold transition-all duration-300 rounded-full hover:bg-amber-100 font-serif text-sm">📍 Location</Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/cart" className="relative p-2 sm:p-3 text-amber-800 hover:text-amber-900 transition-all duration-300 rounded-full hover:bg-amber-100 group">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-yellow-100 text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-md animate-bounce">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-amber-800 hover:text-amber-900 transition-all duration-300 rounded-full hover:bg-amber-100 group"
                >
                  <div className="bg-amber-700 p-1 rounded-full">
                    <User className="h-4 w-4 text-yellow-100" />
                  </div>
                  <span className="hidden md:block font-semibold font-serif">{user.name}</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-amber-50 rounded-2xl shadow-xl py-2 z-50 border-2 border-amber-200">
                    <Link to="/profile" className="block px-5 py-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900 transition-all duration-300 font-serif" onClick={() => setIsProfileDropdownOpen(false)}>👤 Profile</Link>
                    <Link to="/orders" className="block px-5 py-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900 transition-all duration-300 font-serif" onClick={() => setIsProfileDropdownOpen(false)}>📋 Orders</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-5 py-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900 transition-all duration-300 font-serif" onClick={() => setIsProfileDropdownOpen(false)}>⚙️ Admin</Link>
                    )}
                    <hr className="my-2 border-amber-300" />
                    <button onClick={handleLogout} className="block w-full text-left px-5 py-2 text-red-700 hover:bg-red-100 transition-all duration-300 font-serif">🚪 Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 sm:px-6 sm:py-3 text-amber-800 hover:text-amber-900 font-semibold transition-all duration-300 rounded-full hover:bg-amber-100 font-serif text-sm sm:text-base">Sign In</Link>
                <Link to="/register" className="bg-amber-700 text-yellow-100 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-md font-serif text-sm sm:text-base">Join Us</Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-amber-800 hover:text-amber-900 rounded-lg hover:bg-amber-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-200">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>🏠 Home</Link>
              <Link to="/menu" className="text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>🍽️ Menu</Link>
              <Link to="/about" className="text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>📖 About</Link>
              <Link to="/contact" className="text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>📍 Location</Link>
              {isAuthenticated && user && (
                <div className="pt-2 border-t border-amber-200 mt-2 space-y-2">
                  <Link to="/profile" className="block text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>👤 Profile</Link>
                  <Link to="/orders" className="block text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>📋 Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>⚙️ Admin</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left text-red-700 hover:text-red-800 py-3 px-4 rounded-lg hover:bg-red-100 transition-all font-serif">🚪 Sign Out</button>
                </div>
              )}
              {!isAuthenticated && (
                <div className="pt-2 border-t border-amber-200 mt-2 space-y-2">
                  <Link to="/login" className="block text-amber-800 hover:text-amber-900 py-3 px-4 rounded-lg hover:bg-amber-100 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="block bg-amber-700 text-yellow-100 py-3 px-4 rounded-lg font-bold hover:bg-amber-800 transition-all font-serif" onClick={() => setIsMobileMenuOpen(false)}>Join Us</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
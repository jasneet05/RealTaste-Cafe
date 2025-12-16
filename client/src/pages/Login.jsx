import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useToast } from '../contexts/ToastContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error, user, isAuthenticated } = useSelector(state => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, user, navigate, dispatch]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data));
      if (result.type === 'auth/login/fulfilled') {
        toast.success('Welcome back! ☕');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center px-6 sm:px-8 lg:px-12">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
          <div className="text-center mb-8">
            <div className="bg-amber-700 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Coffee className="h-8 w-8 text-yellow-100" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-amber-900">Welcome Back</h2>
            <p className="mt-2 text-amber-700">Sign in to your cafe account ☕</p>
          </div>
        
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl font-serif">
                ⚠️ {error}
              </div>
            )}
          
            <div className="form-spacing">
              <label htmlFor="email" className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                📧 Email Address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please enter a valid email'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-serif">{errors.email.message}</p>
              )}
            </div>
          
            <div className="form-spacing">
              <label htmlFor="password" className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-amber-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-serif">{errors.password.message}</p>
              )}
            </div>
          
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-yellow-100 py-4 px-6 rounded-full font-serif font-bold hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg text-lg button-spacing"
            >
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          
            <div className="text-center mt-8">
              <p className="text-amber-700 font-serif">
                New to our cafe?{' '}
                <Link to="/register" className="text-amber-800 hover:text-amber-900 font-bold underline">
                  Join our community 🎉
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
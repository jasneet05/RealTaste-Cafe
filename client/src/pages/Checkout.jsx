import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, Mail, Shield } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import api from '../utils/api';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { items, total } = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newOrderData = {
        items: items.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: parseFloat(total.toFixed(2)),
        paymentMethod: 'Cash',
        mobileNumber: data.mobileNumber,
        specialInstructions: data.specialInstructions
      };

      // Check if OTP verification is enabled
      try {
        const settingsResponse = await api.get('/api/settings');
        const otpEnabled = settingsResponse.data?.data?.otpVerification ?? true;
        
        if (otpEnabled) {
          // Send OTP to user's email
          await api.post('/api/otp/send', { email: user.email });
          setOrderData(newOrderData);
          setShowOTPStep(true);
          setResendTimer(60);
          toast.success('OTP sent to your email! 📧');
        } else {
          // Direct order placement without OTP
          const response = await api.post('/api/orders', newOrderData);
          
          if (response.data.success) {
            dispatch(clearCart());
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
          } else {
            throw new Error(response.data.message || 'Failed to place order');
          }
        }
      } catch (settingsError) {
        // Fallback: Direct order placement if settings fetch fails
        const response = await api.post('/api/orders', newOrderData);
        
        if (response.data.success) {
          dispatch(clearCart());
          toast.success('Order placed successfully! 🎉');
          navigate('/orders');
        } else {
          throw new Error(response.data.message || 'Failed to place order');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      // Verify OTP
      const verifyResponse = await api.post('/api/otp/verify', { email: user.email, otp });
      
      if (verifyResponse.data.success) {
        // Place order via API
        const response = await api.post('/api/orders', orderData);
        
        if (response.data.success) {
          dispatch(clearCart());
          toast.success('Order placed successfully! 🎉');
          navigate('/orders');
        } else {
          throw new Error(response.data.message || 'Failed to place order');
        }
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Order placement failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await api.post('/api/otp/send', { email: user.email });
      setResendTimer(60);
      toast.success('OTP resent to your email! 📧');
    } catch (err) {
      toast.error('Failed to resend OTP');
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    } else if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, user, items.length, navigate]);

  if (!isAuthenticated || !user || items.length === 0) {
    return null;
  }

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🛒</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Place Order</h1>
          <p className="text-amber-700">Complete your takeaway order</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-8 flex items-center">
              <span className="mr-3">📝</span> Order Information
            </h2>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Pickup Location:</span>
              </div>
              <p className="text-blue-900 font-semibold mt-1">UpalHeri, Rajpura, Punjab 140401</p>
              <p className="text-blue-700 text-sm mt-1">Near Shahdil Hair Saloon</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📱 Mobile Number
                </label>
                <input
                  {...register('mobileNumber', { 
                    required: 'Mobile number is required for order confirmation',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Please enter a valid 10-digit mobile number'
                    }
                  })}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="We'll call you when your order is ready"
                  maxLength={10}
                />
                {errors.mobileNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.mobileNumber.message}</p>
                )}
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Payment Method:</span>
                  <span className="text-amber-900 font-semibold">Pay at Shop</span>
                </div>
                <p className="text-amber-700 text-sm mt-2">Pay when you pick up your order at our shop</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  {...register('specialInstructions')}
                  rows={2}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Any special requests for your order preparation"
                />
              </div>

              {!showOTPStep ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending OTP...' : `Proceed to Verify - ₹${total.toFixed(2)}`}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-900">OTP Verification</span>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">Enter the 6-digit OTP sent to {user.email}</p>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex space-x-3 mb-3">
                    <button
                      type="button"
                      onClick={handleOTPVerification}
                      disabled={otpLoading || otp.length !== 6}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      {otpLoading ? 'Verifying...' : 'Verify & Place Order'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOTPStep(false);
                        setOtp('');
                        setError('');
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-8 flex items-center">
              <span className="mr-3">📋</span> Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=50&h=50&fit=crop&crop=center'} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
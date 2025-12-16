const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = 'font-bold transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none button-spacing';
  
  const variants = {
    primary: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-amber-500',
    secondary: 'bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-50 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-amber-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-amber-600 hover:text-amber-600 hover:bg-amber-50 hover:scale-105 focus:ring-amber-500',
    ghost: 'text-gray-700 hover:text-amber-600 hover:bg-amber-50 hover:scale-105 focus:ring-amber-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
    xl: 'px-12 py-5 text-xl rounded-2xl'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
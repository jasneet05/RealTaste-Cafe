const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'lg',
  shadow = 'md',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl transition-all duration-300 card-spacing';
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-2' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'content-spacing',
    md: 'card-spacing',
    lg: 'card-spacing',
    xl: 'card-spacing'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl'
  };
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
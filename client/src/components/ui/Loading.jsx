import { Coffee } from 'lucide-react';

const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center content-spacing">
      <div className="relative">
        <Coffee className={`${sizeClasses[size]} text-amber-600 animate-pulse`} />
        <div className="absolute inset-0 animate-spin">
          <div className={`${sizeClasses[size]} border-2 border-amber-200 border-t-amber-600 rounded-full`}></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{text}</p>
    </div>
  );
};

export default Loading;
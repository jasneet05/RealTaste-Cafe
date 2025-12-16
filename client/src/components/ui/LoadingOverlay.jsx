import { Coffee } from 'lucide-react';

const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-blue-200 text-center">
        <div className="relative mb-6">
          <Coffee className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
          <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-ping"></div>
        </div>
        <h3 className="text-xl font-serif font-bold text-blue-900 mb-2">{message}</h3>
        <p className="text-blue-700 font-serif text-sm">Please wait...</p>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
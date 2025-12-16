import { Coffee, Wrench, Clock } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <Coffee className="h-24 w-24 text-yellow-300 mx-auto mb-4 animate-bounce" />
            <Wrench className="h-8 w-8 text-yellow-400 absolute top-0 right-1/3 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-yellow-100">
          Under Maintenance
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-amber-200 leading-relaxed">
          We're brewing something special! Our takeaway service is temporarily unavailable while we make improvements.
        </p>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-yellow-400/30">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-yellow-300 mr-2" />
            <span className="text-yellow-300 font-semibold">Expected Duration</span>
          </div>
          <p className="text-amber-200 text-lg">
            We'll be back online shortly. Thank you for your patience!
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-amber-300 font-serif text-lg">
            "Thoda wait karo, better taste leke aayenge" - Wait a bit, we'll come back with better taste
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-amber-200">
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>+91 9465520816</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>hello@realtastecafe.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
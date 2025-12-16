import { Coffee } from 'lucide-react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <Coffee className="h-16 w-16 text-yellow-300 mx-auto animate-bounce" />
          <div className="absolute -inset-4 bg-yellow-300/20 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-yellow-100 mb-4">Real Taste Café</h2>
        <p className="text-amber-200 font-serif mb-6">Brewing something special...</p>
        <p className="text-yellow-300 italic font-serif text-sm">
          "Thoda intezaar karo, swaad aa raha hai" - Wait a bit, taste is coming
        </p>
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
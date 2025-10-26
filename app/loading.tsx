export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Spinning circle */}
          <div className="absolute inset-0 border-4 border-[#CBA135]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#CBA135] rounded-full animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-[#CBA135]/10 rounded-full animate-pulse"></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#CBA135] rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Yükleniyor...
        </h2>
        <p className="text-gray-600 text-sm">
          İçerik hazırlanıyor
        </p>
        
        {/* Progress bar */}
        <div className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-[#CBA135] to-amber-500 rounded-full loading-animation"></div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .loading-animation {
          animation: loading 1.5s ease-in-out infinite;
        }
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}} />
    </div>
  );
}


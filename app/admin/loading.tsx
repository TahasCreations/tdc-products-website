export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-[#CBA135]/20 rounded-full"></div>
          
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#CBA135] border-r-[#CBA135] rounded-full animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-gradient-to-br from-[#CBA135]/20 to-amber-500/20 rounded-full animate-pulse"></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <span className="text-[#CBA135] font-bold text-lg">T</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Admin Panel Yükleniyor
        </h2>
        <p className="text-gray-400 text-sm">
          Yönetim paneli hazırlanıyor...
        </p>
        
        {/* Progress bar */}
        <div className="mt-6 w-64 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-[#CBA135] via-amber-500 to-[#CBA135] rounded-full loading-animation"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-16 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
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


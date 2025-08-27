import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-2xl text-orange-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sayfa Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız sayfa mevcut değil</p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>404:</strong> Bu sayfa bulunamadı veya taşınmış olabilir.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                Ürünler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

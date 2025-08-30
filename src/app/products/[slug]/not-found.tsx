import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-error-warning-line text-4xl text-red-500"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-600 mb-8">
          Aradığınız ürün mevcut değil veya kaldırılmış olabilir. Lütfen farklı bir ürün aramayı deneyin.
        </p>
        <div className="space-y-4">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="ri-arrow-left-line"></i>
            Ürünlere Geri Dön
          </Link>
          <br />
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
          >
            <i className="ri-home-line"></i>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

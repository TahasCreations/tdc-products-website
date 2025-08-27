import WhatsAppButton from '../../components/WhatsAppButton';
import ProductCard from '../../ProductCard';
import AddToCartButton from '../../AddToCartButton';
import AnimatedText from '../../animated-text';

// Ürünleri API'den çek
async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
    return [];
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Figür Gölgeleri */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-100 to-red-100 rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-50 animate-float"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-60 left-1/2 w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 transform rotate-45 opacity-40 animate-pulse"></div>
        <div className="absolute bottom-60 right-1/4 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg opacity-30 animate-bounce-slow"></div>
        
        {/* Floating Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30 animate-slide-right"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-purple-200 to-transparent opacity-30 animate-slide-left"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TDC Figür
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Premium kalitede anime, gaming ve film karakter figürleri. 
              Koleksiyonunuzu tamamlayın.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/products"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Ürünleri Keşfet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/blog"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Blog
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden TDC Figür?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Premium kalite, hızlı teslimat ve müşteri memnuniyeti garantisi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-award-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Kalite</h3>
              <p className="text-gray-600">En yüksek kalitede üretilen figürler, detaylı işçilik ve dayanıklı malzemeler.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-truck-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı Teslimat</h3>
              <p className="text-gray-600">Türkiye geneli hızlı ve güvenli teslimat, özenli paketleme.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-customer-service-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">7/24 Destek</h3>
              <p className="text-gray-600">Müşteri memnuniyeti odaklı hizmet, her zaman yanınızdayız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En popüler ve yeni eklenen figürlerimizi keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Tüm Ürünleri Gör
              <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Güncel Kalın
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Yeni ürünler ve özel fırsatlardan haberdar olun
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Abone Ol
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
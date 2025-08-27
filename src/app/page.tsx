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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Figür Gölgeleri */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-50 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-40 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-60 animate-float"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-60 left-1/2 w-8 h-8 bg-gradient-to-br from-indigo-200 to-purple-200 transform rotate-45 opacity-50 animate-pulse"></div>
        <div className="absolute bottom-60 right-1/4 w-12 h-12 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-lg opacity-40 animate-bounce-slow"></div>
        
        {/* Floating Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-40 animate-slide-right"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-purple-300 to-transparent opacity-40 animate-slide-left"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            {/* TDC Products Logo */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-logo-appear">
                TDC Products
              </h1>
            </div>
            
            {/* Tagline */}
            <div className="space-y-4">
              <p className="text-2xl md:text-3xl font-fredoka text-gray-700 animate-text-slide-up delay-300">
                Premium Figürler & Koleksiyon Ürünleri
              </p>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-text-slide-up delay-500">
                En sevdiğiniz karakterlerin detaylı ve kaliteli figürlerini keşfedin. 
                Her ürün özenle seçilmiş malzemelerle üretilmiştir.
              </p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-text-slide-up delay-700">
            <a
              href="/products"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-fredoka font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Ürünleri Keşfet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/blog"
              className="px-10 py-5 border-3 border-gray-400 text-gray-700 font-fredoka font-semibold text-lg rounded-full hover:border-gray-500 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Blog
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bubblegum text-gray-800 mb-6 animate-text-slide-down delay-200">
              Neden TDC Products?
            </h2>
            <p className="text-xl font-fredoka text-gray-600 max-w-3xl mx-auto animate-text-slide-up delay-400">
              Kalite ve güvenilirlik odaklı hizmet anlayışımızla sizlere en iyi deneyimi sunuyoruz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 animate-text-slide-left delay-500">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <i className="ri-award-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bubblegum text-gray-800 mb-6 text-center">Premium Kalite</h3>
              <p className="text-gray-600 text-center font-fredoka">En yüksek kalitede malzemelerle üretilen figürler, detaylı işçilik ve dayanıklı yapı.</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 animate-text-slide-up delay-600">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <i className="ri-truck-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bubblegum text-gray-800 mb-6 text-center">Hızlı Teslimat</h3>
              <p className="text-gray-600 text-center font-fredoka">Türkiye geneli hızlı ve güvenli teslimat, özenli paketleme ile kapınıza kadar.</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 animate-text-slide-right delay-700">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <i className="ri-customer-service-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bubblegum text-gray-800 mb-6 text-center">7/24 Destek</h3>
              <p className="text-gray-600 text-center font-fredoka">Müşteri memnuniyeti odaklı hizmet, her zaman yanınızda olan destek ekibi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bubblegum text-gray-800 mb-6 animate-text-slide-down delay-300">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-xl font-fredoka text-gray-600 max-w-3xl mx-auto animate-text-slide-up delay-500">
              En popüler ve yeni eklenen figürlerimizi keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any, index: number) => (
              <div key={product.id} className={`animate-text-slide-up delay-${(index + 1) * 200}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-text-slide-up delay-1000">
            <a
              href="/products"
              className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-fredoka font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Tüm Ürünleri Gör
              <i className="ri-arrow-right-line ml-3 text-xl"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bubblegum text-gray-800 mb-6 animate-text-slide-down delay-200">
            Güncel Kalın
          </h2>
          <p className="text-xl font-fredoka text-gray-600 mb-10 animate-text-slide-up delay-400">
            Yeni ürünler ve özel fırsatlardan haberdar olun
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-text-slide-up delay-600">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-fredoka text-lg"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-fredoka font-semibold text-lg rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
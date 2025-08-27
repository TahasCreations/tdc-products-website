import WhatsAppButton from '../../components/WhatsAppButton';
import ProductCard from '../../ProductCard';
import AddToCartButton from '../../AddToCartButton';
import AnimatedText from '../../animated-text';

export default async function HomePage() {
  // Ürünleri API'den çek
  let products = [];
  
  try {
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });
    
    if (productsResponse.ok) {
      products = await productsResponse.json();
    }
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    // Hata durumunda boş array kullan
    products = [];
  }

  // Öne çıkan ürünler (ilk 6 ürün)
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <AnimatedText 
              text="TDC Products"
              className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
            />
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Premium anime, gaming ve film figürleri. Koleksiyonunuzu bizimle büyütün.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 text-lg"
              >
                Ürünleri Keşfet
              </a>
              <a 
                href="/about" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-300 text-lg"
              >
                Hakkımızda
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden TDC Products?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium kalite, uygun fiyat ve geniş ürün yelpazesi ile figür tutkunlarının tercihi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-medal-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Kalite</h3>
              <p className="text-gray-600">
                En yüksek kalitede üretilen figürler, detaylı işçilik ve dayanıklı malzemeler.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shipping-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">
                Türkiye geneli hızlı ve güvenli teslimat, özenli paketleme.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">7/24 Destek</h3>
              <p className="text-gray-600">
                Müşteri memnuniyeti odaklı hizmet, her zaman yanınızdayız.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En popüler ve yeni eklenen figürlerimizi keşfedin.
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="ri-shopping-bag-line text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz ürün yok</h3>
              <p className="text-gray-600">Yakında harika ürünler eklenecek!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <a 
              href="/products" 
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
            >
              Tüm Ürünleri Gör
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kategoriler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İlgi alanınıza göre figürlerimizi keşfedin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="/products?category=anime" className="group">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white p-8 h-64 flex flex-col justify-center items-center text-center hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10">
                  <i className="ri-gamepad-line text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Anime Figürleri</h3>
                  <p className="opacity-90">En sevdiğiniz anime karakterlerinin figürleri</p>
                </div>
              </div>
            </a>
            
            <a href="/products?category=gaming" className="group">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-8 h-64 flex flex-col justify-center items-center text-center hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10">
                  <i className="ri-controller-line text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Gaming Figürleri</h3>
                  <p className="opacity-90">Oyun dünyasının efsane karakterleri</p>
                </div>
              </div>
            </a>
            
            <a href="/products?category=film" className="group">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 h-64 flex flex-col justify-center items-center text-center hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10">
                  <i className="ri-movie-line text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Film Figürleri</h3>
                  <p className="opacity-90">Sinemanın unutulmaz karakterleri</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Güncel Kalın
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Yeni ürünler ve özel fırsatlardan haberdar olmak için bültenimize abone olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
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
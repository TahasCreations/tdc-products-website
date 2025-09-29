import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TDC Plugin Sistemi Entegrasyon Örneği
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Bu örnek, TDC plugin sistemini herhangi bir web sitesine nasıl entegre edeceğinizi gösterir.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Link href="/products" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold mb-2">E-Commerce Plugin</h3>
                <p className="text-gray-600">
                  Ürün yönetimi, kategori sistemi ve sipariş takibi için e-commerce plugin'ini kullanın.
                </p>
              </div>
            </Link>
            
            <Link href="/pricing" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Pricing Plugin</h3>
                <p className="text-gray-600">
                  Dinamik fiyat hesaplama ve vergi hesaplamaları için pricing plugin'ini kullanın.
                </p>
              </div>
            </Link>
            
            <Link href="/plugins" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">⚙️</div>
                <h3 className="text-xl font-semibold mb-2">Plugin Yönetimi</h3>
                <p className="text-gray-600">
                  Plugin'leri etkinleştirin, devre dışı bırakın ve durumlarını izleyin.
                </p>
              </div>
            </Link>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hızlı Başlangıç
            </h2>
            <div className="bg-gray-100 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-2">1. Plugin Sistemini Başlatın</h3>
              <p className="text-sm text-gray-700 mb-4">
                Layout.tsx dosyasında plugin sistemi otomatik olarak başlatılır ve temel plugin'ler yüklenir.
              </p>
              
              <h3 className="font-semibold mb-2">2. Plugin API'lerini Kullanın</h3>
              <p className="text-sm text-gray-700 mb-4">
                Herhangi bir bileşende plugin registry'den plugin'leri alabilir ve API'lerini kullanabilirsiniz.
              </p>
              
              <h3 className="font-semibold mb-2">3. Kendi Plugin'inizi Oluşturun</h3>
              <p className="text-sm text-gray-700">
                Plugin interface'ini implement ederek kendi özel plugin'inizi oluşturabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

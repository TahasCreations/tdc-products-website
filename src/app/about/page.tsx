import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Hikayemizi Öğren
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TDC Products olarak, hayallerinizi gerçeğe dönüştürme tutkumuzla 3D baskı teknolojisinin sınırlarını zorluyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <p className="text-gray-700 mb-4">
                2020 yılında İzmir&apos;de kurulan TDC Products, anime, oyun ve film tutkunlarının hayallerini gerçeğe dönüştürme amacıyla yola çıktı. 
                En son 3D baskı teknolojilerini kullanarak, sevdiğiniz karakterlerin detaylı ve kaliteli figürlerini üretiyoruz.
              </p>
              <p className="text-gray-700 mb-4">
                Her figür, saatler süren tasarım süreci ve özenli üretim aşamalarından geçerek sizlere ulaşıyor. 
                Kalite ve müşteri memnuniyeti bizim için her şeyden önce geliyor.
              </p>
              <p className="text-gray-700">
                Bugün Türkiye&apos;nin dört bir yanından müşterilerimize hizmet veriyor, 
                koleksiyonlarınızı zenginleştirmek için çalışıyoruz.
              </p>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1601582585289-250ed79444c4?q=80&w=1200&auto=format&fit=crop"
                alt="TDC Products Workshop"
                width={600}
                height={400}
                className="rounded-xl object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz ve Değerlerimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kaliteli ürünler ve müşteri memnuniyeti odaklı yaklaşımımızla sektörde öncü olmaya devam ediyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalite</h3>
              <p className="text-gray-600">En yüksek kalite standartlarında üretim yapıyor, her detaya özen gösteriyoruz.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">İnovasyon</h3>
              <p className="text-gray-600">Sürekli gelişen teknolojileri takip ediyor, en son teknikleri kullanıyoruz.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tutku</h3>
              <p className="text-gray-600">Yaptığımız işi seviyor, müşterilerimizin hayallerini gerçekleştirmek için çalışıyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Deneyimli ekibimizle sizlere en iyi hizmeti sunmaya devam ediyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                  alt="Takım Üyesi"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Ahmet Yılmaz</h3>
              <p className="text-orange-600 font-medium">Kurucu & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop"
                  alt="Takım Üyesi"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Elif Kaya</h3>
              <p className="text-orange-600 font-medium">Tasarım Müdürü</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
                  alt="Takım Üyesi"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Mehmet Demir</h3>
              <p className="text-orange-600 font-medium">Üretim Müdürü</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

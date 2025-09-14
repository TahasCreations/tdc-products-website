import Image from "next/image";
import Link from "next/link";
import AIRecommendationEngine from "../../components/ai/AIRecommendationEngine";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -right-10 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-5">
            Güvenilirlik ve Şeffaflık
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Hakkımızda
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            TDC Products, kalite, güven ve zarafeti buluşturan figür ve koleksiyon ürünleri sunar. Amacımız, her siparişte sorunsuz bir deneyim ve uzun ömürlü memnuniyet.
          </p>

          {/* Trust bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3">
              <i className="ri-shield-check-line text-blue-600 text-xl"></i>
              <span className="text-slate-700 text-sm font-medium">SSL Güvenli Ödeme</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3">
              <i className="ri-recycle-line text-green-600 text-xl"></i>
              <span className="text-slate-700 text-sm font-medium">14 Gün İade Garantisi</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3">
              <i className="ri-truck-line text-purple-600 text-xl"></i>
              <span className="text-slate-700 text-sm font-medium">Hızlı & Güvenli Kargo</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3">
              <i className="ri-customer-service-2-line text-orange-600 text-xl"></i>
              <span className="text-slate-700 text-sm font-medium">7/24 Destek</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Hikayemiz</h2>
            <div className="space-y-4 text-white leading-relaxed">
              <p>
                2020 yılında İzmir&apos;de kurulan TDC Products, anime, oyun ve film tutkunlarının koleksiyonlarına değer katan özgün ürünler üretme hedefiyle yola çıktı.
              </p>
              <p>
                Her ürünümüz; tasarım, modelleme ve ince işçilikten oluşan özenli bir süreçten geçer. Sürdürülebilir üretim ve etik standartlara bağlı kalırız.
              </p>
              <p>
                Bugün Türkiye&apos;nin dört bir yanına güvenle gönderim yapıyor; şeffaf iletişim ve hızlı destekle yanınızda oluyoruz.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Mutlu Müşteri', value: '10K+' },
                { label: 'Teslim Edilen Ürün', value: '25K+' },
                { label: 'Memnuniyet', value: '%98' },
                { label: 'Ortalama Kargo', value: '24-48s' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-center">
                  <div className="text-2xl font-extrabold text-white">
                    {s.value}
                  </div>
                  <div className="text-xs text-white/80 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-white/20 via-white/10 to-white/20 blur-2xl"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
              <Image
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1200&auto=format&fit=crop"
                alt="TDC Products figür üretim atölyesi - Anime ve oyun karakterleri"
                width={800}
                height={550}
                className="w-full h-auto object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Misyonumuz ve Değerlerimiz</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Kalite, şeffaflık ve kullanıcı deneyimini merkeze alırız.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: 'ri-medal-2-line',
                title: 'Kalite ve Dayanıklılık',
                desc: 'Uzun ömürlü, detaylı ve özenli üretim standartları ile.',
                color: 'from-blue-600 to-indigo-600',
              },
              {
                icon: 'ri-eye-line',
                title: 'Şeffaflık',
                desc: 'Süreçlerimiz, fiyatlandırmamız ve iletişimimiz nettir.',
                color: 'from-purple-600 to-pink-600',
              },
              {
                icon: 'ri-leaf-line',
                title: 'Sürdürülebilirlik',
                desc: 'Malzeme ve paketlemede çevre dostu yaklaşımlar.',
                color: 'from-emerald-600 to-teal-600',
              },
            ].map((v) => (
              <div key={v.title} className="group relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${v.color} text-white mb-4`}>
                  <i className={`${v.icon} text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Müşterilerimiz Ne Diyor?</h2>
            <p className="text-slate-600">Güven inşa eden deneyimler.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Ürün kalitesi harika, paketleme çok özenliydi. Hızlı teslimat için teşekkürler!',
                name: 'Seda K.',
              },
              {
                quote: 'İletişim çok hızlı ve çözüm odaklı. Gönül rahatlığıyla alışveriş yapabilirsiniz.',
                name: 'Barış A.',
              },
              {
                quote: 'Beklentilerimin üzerinde bir işçilik ve detay. Kesinlikle tavsiye ederim.',
                name: 'Mert E.',
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                <i className="ri-double-quotes-l text-2xl text-blue-600"></i>
                <p className="mt-3 text-slate-700 leading-relaxed">{t.quote}</p>
                <div className="mt-4 text-sm font-semibold text-slate-900">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Sorunuz mu var? Size yardımcı olmaktan memnuniyet duyarız.</h3>
          <p className="text-white/80 mt-2">Güvenilir alışveriş deneyimi için bizimle iletişime geçin.</p>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-semibold shadow-sm hover:shadow-md transition">
              İletişime Geç
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Önerileri */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🤖 Size Özel Öneriler
            </h2>
            <p className="text-lg text-gray-600">
              TDC Products&apos;ın en popüler figürleri ve kişiselleştirilmiş öneriler
            </p>
          </div>
          <AIRecommendationEngine 
            context="about"
            limit={6}
            showAlgorithmInfo={false}
            enablePersonalization={true}
          />
        </div>
      </section>
    </>
  );
}

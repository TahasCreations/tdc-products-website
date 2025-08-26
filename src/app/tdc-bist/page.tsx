const stockData = [
  {
    symbol: "TDC",
    name: "TDC Products",
    price: 45.67,
    change: 2.34,
    changePercent: 5.4,
    volume: "1.2M",
    marketCap: "156.7M"
  },
  {
    symbol: "THYAO",
    name: "Türk Hava Yolları",
    price: 234.50,
    change: -12.30,
    changePercent: -4.98,
    volume: "45.2M",
    marketCap: "324.1B"
  },
  {
    symbol: "GARAN",
    name: "Garanti Bankası",
    price: 67.89,
    change: 1.23,
    changePercent: 1.85,
    volume: "23.7M",
    marketCap: "287.3B"
  },
  {
    symbol: "ASELS",
    name: "Aselsan",
    price: 89.12,
    change: 3.45,
    changePercent: 4.03,
    volume: "8.9M",
    marketCap: "67.2B"
  }
];

const marketIndices = [
  {
    name: "BIST 100",
    value: 9234.56,
    change: 123.45,
    changePercent: 1.35
  },
  {
    name: "BIST 30",
    value: 8567.89,
    change: 89.12,
    changePercent: 1.05
  },
  {
    name: "BIST 50",
    value: 7890.12,
    change: 67.34,
    changePercent: 0.86
  }
];

export default function TdcBistPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              TDC BİST
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Borsa İstanbul verilerini takip edin ve piyasa analizlerimizi inceleyin.
            </p>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Piyasa Genel Görünümü</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {marketIndices.map((index) => (
              <div key={index.name} className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{index.name}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {index.value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center text-sm ${
                  index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="font-medium">
                    {index.changePercent >= 0 ? '+' : ''}{index.changePercent}%
                  </span>
                  <span className="ml-2">
                    ({index.change >= 0 ? '+' : ''}{index.change.toFixed(2)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stock Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Hisse Senedi Verileri</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hisse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Değişim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hacim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Piyasa Değeri
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockData.map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₺{stock.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                        </div>
                        <div className={`text-sm ${
                          stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stock.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stock.marketCap}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Teknik Analiz</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">TDC Hisse Grafiği</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600">Grafik burada görüntülenecek</p>
                  <p className="text-sm text-gray-500 mt-2">Canlı veri entegrasyonu</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">BIST 100 Endeksi</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-gray-600">Endeks grafiği burada görüntülenecek</p>
                  <p className="text-sm text-gray-500 mt-2">Günlük değişim analizi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market News */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Piyasa Haberleri</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "TDC Products Yeni Ürün Lansmanı",
                excerpt: "Şirketimiz yeni anime figür serisini piyasaya sürdü.",
                date: "15 Ocak 2024",
                category: "Şirket Haberleri"
              },
              {
                title: "BIST 100 Rekor Seviyede",
                excerpt: "Borsa İstanbul 100 endeksi tarihi zirvesini gördü.",
                date: "14 Ocak 2024",
                category: "Piyasa"
              },
              {
                title: "Teknoloji Hisseleri Yükselişte",
                excerpt: "Teknoloji sektörü hisseleri güçlü performans gösteriyor.",
                date: "13 Ocak 2024",
                category: "Sektör"
              }
            ].map((news, index) => (
              <article key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                    {news.category}
                  </span>
                  <span className="text-xs text-gray-500">{news.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                <p className="text-gray-600 text-sm">{news.excerpt}</p>
                <a href="#" className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm">
                  Devamını Oku →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Yasal Uyarı</h3>
            <p className="text-yellow-700 text-sm">
              Bu sayfada yer alan bilgiler sadece bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımamaktadır. 
              Yatırım kararlarınızı vermeden önce profesyonel finansal danışmanlık almanızı öneririz.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

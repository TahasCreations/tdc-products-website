'use client';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-ink-900 leading-tight">
                Türkiye'nin{' '}
                <span className="bg-gradient-tdc bg-clip-text text-transparent">
                  tasarım & figür
                </span>{' '}
                pazarı
              </h1>
              <p className="text-xl text-ink-600 max-w-lg">
                AI destekli arama, özel domainli mağazalar, düşük komisyon. 
                El yapımı sıcaklığı ile AI güvencesini buluşturan platform.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Ürün, mağaza veya kategori ara..."
                  className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-tdc text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary-500 text-white px-8 py-4 rounded-tdc font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg">
                Keşfet
              </button>
              <button className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-tdc font-semibold text-lg hover:bg-primary-50 transition-colors">
                Mağazanı Aç
              </button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-gradient-tdc rounded-tdc p-8 text-white">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-white/20 rounded-tdc mx-auto flex items-center justify-center">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-2xl font-bold">3D Figürler</h3>
                <p className="text-white/80">El yapımı kalite, AI destekli üretim</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

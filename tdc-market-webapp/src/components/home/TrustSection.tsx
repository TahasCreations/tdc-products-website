'use client';

export default function TrustSection() {
  const trustFeatures = [
    {
      icon: '🔒',
      title: 'Güvenli Ödeme',
      description: 'SSL sertifikası ile korumalı ödeme sistemi'
    },
    {
      icon: '🚚',
      title: 'Hızlı Kargo',
      description: 'Türkiye geneli hızlı ve güvenli teslimat'
    },
    {
      icon: '✅',
      title: 'Doğrulanmış Satıcı',
      description: 'Tüm satıcılarımız kimlik doğrulamasından geçmiştir'
    }
  ];

  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Neden TDC Market?
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Güvenli, hızlı ve kaliteli alışveriş deneyimi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center bg-white rounded-tdc p-8 shadow-tdc hover:shadow-tdc-lg transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-tdc rounded-tdc mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-ink-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

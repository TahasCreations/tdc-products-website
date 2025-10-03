'use client';

export default function TrustSection() {
  const features = [
    {
      icon: '🛡️',
      title: 'Güvenli Ödeme',
      description: 'SSL şifreleme ile güvenli ödeme'
    },
    {
      icon: '🚚',
      title: 'Hızlı Kargo',
      description: '2-3 iş gününde teslimat'
    },
    {
      icon: '↩️',
      title: '14 Gün İade',
      description: 'Koşulsuz iade garantisi'
    },
    {
      icon: '🎯',
      title: 'AI Destekli Arama',
      description: 'Akıllı arama algoritması'
    },
    {
      icon: '🏪',
      title: 'Özel Domain',
      description: 'Kendi domaininizle mağaza'
    },
    {
      icon: '💰',
      title: 'Düşük Komisyon',
      description: 'Sadece %7 komisyon'
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
            El yapımı sıcaklığı ile AI güvencesini buluşturan platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-tdc p-8 shadow-tdc hover:shadow-tdc-lg transition-all duration-300 text-center"
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

'use client';

import { 
  ShieldCheckIcon, 
  TruckIcon, 
  CheckBadgeIcon,
  CreditCardIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface TrustFeature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight?: string;
}

const trustFeatures: TrustFeature[] = [
  {
    id: 'secure-payment',
    icon: ShieldCheckIcon,
    title: 'Güvenli Ödeme',
    description: '256-bit SSL şifreleme ile güvenli ödeme',
    highlight: 'SSL'
  },
  {
    id: 'fast-shipping',
    icon: TruckIcon,
    title: 'Hızlı Kargo',
    description: 'Türkiye geneli 1-3 iş gününde teslimat',
    highlight: '1-3 gün'
  },
  {
    id: 'verified-sellers',
    icon: CheckBadgeIcon,
    title: 'Doğrulanmış Satıcı',
    description: 'Tüm satıcılarımız kimlik doğrulamasından geçer',
    highlight: '100%'
  },
  {
    id: 'easy-returns',
    icon: CreditCardIcon,
    title: 'Kolay İade',
    description: '14 gün içinde koşulsuz iade garantisi',
    highlight: '14 gün'
  },
  {
    id: 'customer-support',
    icon: ChatBubbleLeftRightIcon,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda',
    highlight: '7/24'
  },
  {
    id: 'quality-guarantee',
    icon: ClockIcon,
    title: 'Kalite Garantisi',
    description: 'Tüm ürünlerimiz kalite kontrolünden geçer',
    highlight: 'Garanti'
  }
];

export default function TrustSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-ink-900 mb-4">
            Güven & Destek
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Alışveriş deneyiminizi güvenli ve keyifli hale getiren özelliklerimiz
          </p>
        </div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="group bg-white rounded-tdc shadow-tdc hover:shadow-tdc-xl transform hover:-translate-y-2 transition-all duration-300 p-8 text-center focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-tdc rounded-tdc flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Highlight Badge */}
                {feature.highlight && (
                  <div className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {feature.highlight}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-ink-900 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-ink-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-tdc opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 bg-white rounded-tdc shadow-tdc-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {/* Security Certificates */}
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary-600">256-bit</div>
              <div className="text-sm text-ink-600">SSL Şifreleme</div>
            </div>
            
            {/* Customer Satisfaction */}
            <div className="space-y-3">
              <div className="text-3xl font-bold text-success-600">98%</div>
              <div className="text-sm text-ink-600">Müşteri Memnuniyeti</div>
            </div>
            
            {/* Delivery Success */}
            <div className="space-y-3">
              <div className="text-3xl font-bold text-accent-600">99.9%</div>
              <div className="text-sm text-ink-600">Teslimat Başarısı</div>
            </div>
            
            {/* Active Users */}
            <div className="space-y-3">
              <div className="text-3xl font-bold text-warning-600">1M+</div>
              <div className="text-sm text-ink-600">Aktif Kullanıcı</div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-ink-600 mb-6">Güvenilir ödeme yöntemleri</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Payment Method Icons */}
            <div className="w-16 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              VISA
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
              MC
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center text-white font-bold text-sm">
              TR
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
              PP
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded flex items-center justify-center text-white font-bold text-sm">
              IYZ
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


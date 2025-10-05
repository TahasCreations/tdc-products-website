'use client';

import { motion } from 'framer-motion';
import { Shield, RefreshCw, CreditCard, FileText, Lock, Headphones } from 'lucide-react';

export default function PoliciesAssurance() {
  const policies = [
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'İade & Değişim',
      description: '14 gün içinde koşulsuz iade hakkı',
      details: [
        '14 gün içinde iade',
        'Ücretsiz kargo',
        'Hızlı iade süreci',
        'Müşteri dostu politika'
      ]
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Güvenli Ödeme',
      description: 'Tüm ödeme yöntemleri güvenli',
      details: [
        'SSL şifreleme',
        '3D Secure',
        'Çoklu ödeme seçeneği',
        'Güvenli saklama'
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'KVKK & Gizlilik',
      description: 'Kişisel verileriniz güvende',
      details: [
        'KVKK uyumlu',
        'Veri koruma',
        'Şeffaf politika',
        'Güvenli saklama'
      ]
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Güvenlik',
      description: 'En yüksek güvenlik standartları',
      details: [
        '256-bit şifreleme',
        'Güvenli sunucular',
        'Düzenli güncelleme',
        'Güvenlik denetimi'
      ]
    }
  ];

  const assurances = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Orijinal Ürün Garantisi',
      description: 'Tüm ürünlerimiz orijinal ve kaliteli'
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: '7/24 Müşteri Desteği',
      description: 'Her zaman yanınızdayız'
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Hızlı Çözüm',
      description: 'Sorunlarınızı hızla çözüyoruz'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Veri Güvenliği',
      description: 'Kişisel bilgileriniz güvende'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Politikalar</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              & Güvencemiz
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Müşteri haklarınızı koruyan politikalarımız ve güvencelerimiz.
          </p>
        </motion.div>

        {/* Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30 h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mb-6 text-black group-hover:scale-110 transition-transform duration-300">
                  {policy.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#CBA135] transition-colors">
                  {policy.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {policy.description}
                </p>

                {/* Details */}
                <div className="space-y-3">
                  {policy.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#CBA135] rounded-full flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Assurances */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Güvencelerimiz
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assurances.map((assurance, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30"
              >
                <div className="w-12 h-12 bg-[#CBA135]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#CBA135]">
                  {assurance.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {assurance.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {assurance.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Güven Taahhüdümüz
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              TDC Market olarak, müşteri güvenini en önemli değer olarak görüyoruz. 
              Tüm politikalarımız ve güvencelerimiz, müşteri memnuniyetini 
              sağlamak için tasarlanmıştır.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

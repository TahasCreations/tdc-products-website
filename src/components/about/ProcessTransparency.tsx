'use client';

import { motion } from 'framer-motion';
import { Package, Truck, Shield, CheckCircle, Eye, Heart } from 'lucide-react';

export default function ProcessTransparency() {
  const processes = [
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Ürün Seçimi',
      description: 'Sadece kaliteli ve güvenilir tedarikçilerden ürün seçimi yapıyoruz.',
      steps: ['Tedarikçi Değerlendirmesi', 'Kalite Kontrolü', 'Fiyat Analizi', 'Stok Yönetimi']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenlik',
      description: 'Müşteri verilerini korumak için en yüksek güvenlik standartlarını uyguluyoruz.',
      steps: ['SSL Şifreleme', 'KVKK Uyumu', 'Güvenli Ödeme', 'Veri Koruma']
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Teslimat',
      description: 'Hızlı ve güvenli teslimat için optimize edilmiş süreçlerimiz.',
      steps: ['Sipariş Hazırlama', 'Ambalajlama', 'Kargo Gönderimi', 'Teslimat Takibi']
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
            <span className="text-white">Nasıl</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              Üretiyoruz?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Süreçlerimizin şeffaflığı ve kalite kontrolümüz hakkında detaylı bilgi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {processes.map((process, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30 h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mb-6 text-black group-hover:scale-110 transition-transform duration-300">
                  {process.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#CBA135] transition-colors">
                  {process.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">
                  {process.description}
                </p>

                {/* Steps */}
                <div className="space-y-3">
                  {process.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#CBA135] flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transparency Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Şeffaflık Taahhüdümüz
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Tüm süreçlerimizde şeffaflık ilkesini benimsiyoruz. Müşterilerimiz, 
              ürünlerimizin nasıl seçildiğini, nasıl paketlendiğini ve nasıl 
              teslim edildiğini her zaman öğrenebilir.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

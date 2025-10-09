'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export default function ContactCTA() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefon',
      value: '0555 898 82 42',
      description: 'Pazartesi - Cuma: 09:00 - 18:00',
      action: 'tel:05558988242',
      highlight: true
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '0555 898 82 42',
      description: '7/24 Anında Destek',
      action: 'https://wa.me/905558988242',
      highlight: true
    },
    {
      icon: Mail,
      title: 'E-posta',
      value: 'bentahasarii@gmail.com',
      description: '24 saat içinde yanıt',
      action: 'mailto:bentahasarii@gmail.com'
    },
    {
      icon: Clock,
      title: 'Canlı Destek',
      value: 'Online Chat',
      description: 'Anında yardım',
      action: '#',
      comingSoon: true
    }
  ];

  const offices = [
    {
      city: 'İzmir – Bornova',
      address: 'Erzene, 66. Sk. No:5 D:1A, 35040 Bornova/İzmir',
      phone: '0555 898 82 42',
      hours: 'Pazartesi - Cuma: 09:00 - 18:00'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Bizimle</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              İletişime Geçin
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için her zaman buradayız.
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`
                  relative p-6 rounded-2xl border transition-all duration-300 group
                  ${method.highlight 
                    ? 'bg-gradient-to-br from-[#CBA135]/20 to-[#F4D03F]/20 border-[#CBA135]/30 hover:border-[#CBA135] hover:shadow-[0_20px_40px_rgba(203,161,53,0.15)]' 
                    : 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20'
                  }
                  ${method.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {method.comingSoon && (
                  <div className="absolute top-3 right-3 bg-[#CBA135] text-black text-xs px-2 py-1 rounded-full font-medium">
                    Yakında
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${method.highlight 
                      ? 'bg-[#CBA135] text-black group-hover:bg-[#F4D03F]' 
                      : 'bg-white/10 text-white group-hover:bg-white/20'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {method.title}
                    </h3>
                    <p className="text-[#CBA135] font-medium mb-2">
                      {method.value}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {method.description}
                    </p>
                  </div>
                </div>

                {!method.comingSoon && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-[#CBA135]" />
                  </div>
                )}
              </motion.a>
            );
          })}
        </motion.div>

        {/* Offices Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 mb-16 max-w-2xl mx-auto"
        >
          {offices.map((office, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#CBA135]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#CBA135]" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">
                    TDC Products - {office.city}
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      {office.address}
                    </p>
                    <div className="flex items-center space-x-2 text-[#CBA135]">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{office.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-[#CBA135]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-[#CBA135]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Konumumuzu Görün
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            TDC Products İzmir - Bornova ofisimizin konumunu haritada görebilir, 
            ziyaret etmek için yol tarifi alabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://maps.google.com/?q=TDC+Products+Erzene+66+Sk+No+5+Bornova+İzmir"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#CBA135] text-black rounded-xl hover:bg-[#F4D03F] transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Haritada Görüntüle
            </a>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">
              Acil Durum Desteği
            </h3>
            <p className="text-gray-300 mb-4">
              Kritik sorunlarınız için 7/24 acil destek hattımız mevcuttur.
            </p>
            <a
              href="tel:05558988242"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              Acil Destek: 0555 898 82 42
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
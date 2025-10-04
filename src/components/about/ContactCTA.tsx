'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'E-posta',
    value: 'destek@tdcmarket.com',
    description: '7/24 e-posta desteği',
    action: 'mailto:destek@tdcmarket.com'
  },
  {
    icon: Phone,
    title: 'Telefon',
    value: '+90 850 123 45 67',
    description: 'Pazartesi-Cuma 09:00-18:00',
    action: 'tel:+908501234567'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+90 850 123 45 67',
    description: 'Anında mesajlaşma',
    action: 'https://wa.me/908501234567'
  },
  {
    icon: MapPin,
    title: 'Adres',
    value: 'Maslak Mahallesi, Büyükdere Caddesi',
    description: 'No: 123, Sarıyer/İstanbul',
    action: 'https://maps.google.com'
  }
];

const workingHours = [
  { day: 'Pazartesi - Cuma', hours: '09:00 - 18:00' },
  { day: 'Cumartesi', hours: '10:00 - 16:00' },
  { day: 'Pazar', hours: 'Kapalı' }
];

const quickActions = [
  { title: 'Canlı Destek', description: 'Anında yardım alın', icon: MessageCircle, action: '/destek' },
  { title: 'Sipariş Takibi', description: 'Siparişinizi takip edin', icon: ExternalLink, action: '/siparis-takip' },
  { title: 'İade Talebi', description: 'Kolay iade süreci', icon: ExternalLink, action: '/iade' },
  { title: 'Kariyer', description: 'Bizimle çalışın', icon: ExternalLink, action: '/kariyer' }
];

export default function ContactCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Bize Ulaşın</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sorularınız için 7/24 hizmetinizdeyiz. Size en uygun iletişim yöntemini seçin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        onClick={() => window.open(contact.action, '_blank')}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <contact.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{contact.title}</h3>
                          <p className="text-[#CBA135] font-medium mb-1">{contact.value}</p>
                          <p className="text-sm text-gray-500">{contact.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Çalışma Saatleri</h3>
                </div>
                <div className="space-y-3">
                  {workingHours.map((schedule, index) => (
                    <div key={schedule.day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700 font-medium">{schedule.day}</span>
                      <span className="text-[#CBA135] font-semibold">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:border-[#CBA135]">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#CBA135] transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Her Zaman Yanınızdayız</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Müşteri memnuniyeti bizim önceliğimiz. Herhangi bir sorunuz veya öneriniz varsa, 
            bizimle iletişime geçmekten çekinmeyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#CBA135] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => window.open('mailto:destek@tdcmarket.com', '_blank')}
            >
              <Mail className="w-5 h-5 mr-2" />
              E-posta Gönder
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#CBA135] px-8 py-4 text-lg font-semibold"
              onClick={() => window.open('https://wa.me/908501234567', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

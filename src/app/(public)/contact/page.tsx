'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      console.error('Form error:', error);
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'E-posta',
      value: 'info@tdcproducts.com',
      action: () => window.open('mailto:info@tdcproducts.com')
    },
    {
      icon: '📞',
      title: 'Telefon',
      value: '+90 212 555 0123',
      action: () => window.open('tel:+902125550123')
    },
    {
      icon: '📍',
      title: 'Adres',
      value: 'İstanbul, Türkiye',
      action: () => window.open('https://maps.google.com')
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      value: '+90 212 555 0123',
      action: () => window.open('https://wa.me/902125550123')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-coral-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 font-serif"
            >
              İletişim
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              Sorularınız, önerileriniz veya özel koleksiyon talepleriniz için bizimle iletişime geçin
            </motion.p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-ink-900 mb-8 font-serif">
                Mesaj Gönderin
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Adınız ve soyadınız"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="ornek@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-ink-700 mb-2">
                    Konu
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="general">Genel Soru</option>
                    <option value="order">Sipariş Hakkında</option>
                    <option value="custom">Özel Koleksiyon</option>
                    <option value="partnership">İş Ortaklığı</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-ink-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Mesajınızın başlığı"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-coral-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-600 hover:to-coral-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Gönderiliyor...
                    </div>
                  ) : (
                    'Mesaj Gönder'
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-ink-900 mb-8 font-serif">
                İletişim Bilgileri
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                    className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    onClick={info.action}
                  >
                    <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ink-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-ink-600">
                        {info.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-ink-900 mb-6 font-serif">
                  Sosyal Medya
                </h3>
                <div className="flex space-x-4">
                  {[
                    { name: 'Instagram', icon: '📷', url: '#' },
                    { name: 'Twitter', icon: '🐦', url: '#' },
                    { name: 'YouTube', icon: '📺', url: '#' },
                    { name: 'TikTok', icon: '🎵', url: '#' }
                  ].map((social, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open(social.url)}
                      className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-shadow duration-300"
                    >
                      <span className="text-xl">{social.icon}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-12 p-6 bg-gradient-to-r from-indigo-100 to-coral-100 rounded-2xl">
                <h3 className="text-lg font-bold text-ink-900 mb-2">
                  Sık Sorulan Sorular
                </h3>
                <p className="text-ink-600 mb-4">
                  Hızlı yanıtlar için SSS sayfamızı ziyaret edin
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/faq'}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  SSS'yi Görüntüle →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

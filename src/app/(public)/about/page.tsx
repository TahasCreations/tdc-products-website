'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

const team = [
  {
    name: 'Ahmet Yılmaz',
    role: 'Kurucu & CEO',
    image: '/images/team-1.jpg',
    description: '15 yıllık koleksiyon deneyimi'
  },
  {
    name: 'Sarah Johnson',
    role: 'Sanat Direktörü',
    image: '/images/team-2.jpg',
    description: 'Uluslararası sanat ödülleri sahibi'
  },
  {
    name: 'Mehmet Kaya',
    role: 'Üretim Müdürü',
    image: '/images/team-3.jpg',
    description: 'El işçiliği uzmanı'
  }
];

const values = [
  {
    icon: '🎨',
    title: 'Sanatsal Kalite',
    description: 'Her figürde mükemmellik arayışımız'
  },
  {
    icon: '🤝',
    title: 'Müşteri Odaklı',
    description: 'Memnuniyet bizim önceliğimiz'
  },
  {
    icon: '🌍',
    title: 'Global Vizyon',
    description: 'Dünya çapında sanat anlayışı'
  },
  {
    icon: '♻️',
    title: 'Sürdürülebilirlik',
    description: 'Çevre dostu üretim süreçleri'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-coral-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 font-serif">
                  Hakkımızda
                </h1>
                <p className="text-xl text-ink-600 mb-8 leading-relaxed">
                  TDC Products olarak, el işçiliği ve yüksek kalite ile üretilen 
                  premium figür koleksiyonları sunuyoruz. Sanat ve koleksiyon 
                  tutkunları için özel tasarım figürler üretiyoruz.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">2010</div>
                    <div className="text-sm text-ink-600">Kuruluş Yılı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-coral-500 mb-2">50+</div>
                    <div className="text-sm text-ink-600">Sanatçı</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/about-hero.jpg"
                    alt="TDC Products Hakkında"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl font-bold text-ink-900 mb-6 font-serif">
                  Misyonumuz
                </h2>
                <p className="text-lg text-ink-600 leading-relaxed">
                  Sanat ve koleksiyon tutkunları için en kaliteli figürleri 
                  üretmek ve onlara unutulmaz bir deneyim sunmak.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl font-bold text-ink-900 mb-6 font-serif">
                  Vizyonumuz
                </h2>
                <p className="text-lg text-ink-600 leading-relaxed">
                  Dünya çapında tanınan, sanatsal değeri yüksek figür 
                  koleksiyonları ile global bir marka olmak.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl font-bold text-ink-900 mb-6 font-serif">
                  Değerlerimiz
                </h2>
                <p className="text-lg text-ink-600 leading-relaxed">
                  Kalite, güvenilirlik, müşteri memnuniyeti ve 
                  sürdürülebilirlik temel değerlerimizdir.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-indigo-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-ink-900 mb-6 font-serif">
                Değerlerimiz
              </h2>
              <p className="text-xl text-ink-600 max-w-3xl mx-auto">
                Çalışma prensiplerimiz ve değerlerimiz
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-ink-900 mb-4 font-serif">
                    {value.title}
                  </h3>
                  <p className="text-ink-600">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-ink-900 mb-6 font-serif">
                Ekibimiz
              </h2>
              <p className="text-xl text-ink-600 max-w-3xl mx-auto">
                Deneyimli ve yetenekli ekibimizle size en iyi hizmeti sunuyoruz
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="192px"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900 mb-2 font-serif">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-ink-600 text-sm">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-coral-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif"
            >
              Bizimle İletişime Geçin
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-8"
            >
              Sorularınız için bize ulaşın veya özel koleksiyon taleplerinizi paylaşın
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                onClick={() => window.location.href = '/contact'}
              >
                İletişime Geçin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-colors"
                onClick={() => window.location.href = '/collections'}
              >
                Koleksiyonları Görün
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

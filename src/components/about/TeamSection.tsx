'use client';

import { motion } from 'framer-motion';
import { Users, Linkedin, Mail, Award, Heart, Zap } from 'lucide-react';

export default function TeamSection() {
  const teamMembers = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      description: 'E-ticaret ve teknoloji alanında 10+ yıl deneyim',
      image: '/images/team/ceo.jpg',
      linkedin: 'https://linkedin.com/in/ahmetyilmaz',
      email: 'ahmet@tdcmarket.com',
      achievements: ['E-ticaret Uzmanı', 'Teknoloji Lideri']
    },
    {
      name: 'Ayşe Kaya',
      role: 'CTO',
      description: 'Yazılım geliştirme ve sistem mimarisi uzmanı',
      image: '/images/team/cto.jpg',
      linkedin: 'https://linkedin.com/in/aysekaya',
      email: 'ayse@tdcmarket.com',
      achievements: ['Sistem Mimarisi', 'Güvenlik Uzmanı']
    },
    {
      name: 'Mehmet Demir',
      role: 'Operasyon Müdürü',
      description: 'Lojistik ve operasyon yönetimi konusunda uzman',
      image: '/images/team/ops.jpg',
      linkedin: 'https://linkedin.com/in/mehmetdemir',
      email: 'mehmet@tdcmarket.com',
      achievements: ['Lojistik Uzmanı', 'Süreç Optimizasyonu']
    },
    {
      name: 'Fatma Özkan',
      role: 'Müşteri Hizmetleri Müdürü',
      description: 'Müşteri memnuniyeti ve deneyim uzmanı',
      image: '/images/team/customer.jpg',
      linkedin: 'https://linkedin.com/in/fatmaozkan',
      email: 'fatma@tdcmarket.com',
      achievements: ['Müşteri Deneyimi', 'İletişim Uzmanı']
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Müşteri Odaklılık',
      description: 'Her kararımızda müşteri memnuniyetini ön planda tutuyoruz.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'İnovasyon',
      description: 'Sürekli gelişim ve yenilikçi çözümler üretiyoruz.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Kalite',
      description: 'En yüksek standartlarda hizmet ve ürün kalitesi sunuyoruz.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Ekibimiz</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              & Kültürümüz
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            TDC Market'i oluşturan deneyimli ekibimiz ve paylaştığımız değerler.
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30 text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-full flex items-center justify-center mx-auto text-black text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#CBA135] rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-black" />
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#CBA135] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[#CBA135] font-medium text-sm mb-3">
                  {member.role}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>

                {/* Achievements */}
                <div className="space-y-1 mb-4">
                  {member.achievements.map((achievement, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-[#CBA135]/20 text-[#CBA135] text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#CBA135] hover:bg-[#CBA135]/20 transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#CBA135] hover:bg-[#CBA135]/20 transition-colors"
                    aria-label={`${member.name} Email`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Şirket Değerlerimiz
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30"
              >
                <div className="w-12 h-12 bg-[#CBA135]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#CBA135]">
                  {value.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Culture Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Kültürümüz
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              TDC Market olarak, açık iletişim, karşılıklı saygı ve sürekli öğrenme 
              kültürünü benimsiyoruz. Her ekip üyemiz, müşteri memnuniyeti ve 
              şirket başarısı için özveriyle çalışır.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
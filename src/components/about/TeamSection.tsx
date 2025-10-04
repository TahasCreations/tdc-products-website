'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Users, Heart, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio?: string;
  linkedin?: string;
}

const founders: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    role: 'Kurucu & CEO',
    photo: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=AY',
    bio: '10+ yıllık e-ticaret deneyimi ile TDC Market\'i kurdu. Teknoloji ve müşteri deneyimi odaklı yaklaşımı ile şirketi büyüttü.',
    linkedin: 'https://linkedin.com/in/ahmet-yilmaz'
  },
  {
    id: '2',
    name: 'Elif Kaya',
    role: 'Kurucu & CTO',
    photo: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=EK',
    bio: 'Yazılım geliştirme ve teknoloji alanında uzman. TDC Market\'in teknik altyapısını ve inovasyon süreçlerini yönetiyor.',
    linkedin: 'https://linkedin.com/in/elif-kaya'
  },
  {
    id: '3',
    name: 'Mehmet Özkan',
    role: 'Kurucu & COO',
    photo: 'https://via.placeholder.com/300x300/27AE60/FFFFFF?text=MO',
    bio: 'Operasyonlar ve tedarik zinciri yönetiminde deneyimli. Üretim süreçlerini optimize ederek kalite ve verimliliği artırıyor.',
    linkedin: 'https://linkedin.com/in/mehmet-ozkan'
  }
];

const cultureValues = [
  { icon: Users, title: 'Açık İletişim', description: 'Şeffaf ve dürüst iletişim kuruyoruz' },
  { icon: BookOpen, title: 'Sürekli Öğrenme', description: 'Her gün yeni şeyler öğrenmeye odaklanıyoruz' },
  { icon: Heart, title: 'Topluluk Odaklı', description: 'Müşteri ve çalışan topluluğumuzu destekliyoruz' }
];

export default function TeamSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TDC Market'i bugünlere getiren deneyimli ve tutkulu ekibimizi tanıyın
          </p>
        </motion.div>

        {/* Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <Image
                      src={founder.photo}
                      alt={founder.name}
                      width={200}
                      height={200}
                      className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-r from-[#CBA135] to-[#F4D03F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                  <p className="text-[#CBA135] font-semibold mb-4">{founder.role}</p>
                  
                  {founder.bio && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{founder.bio}</p>
                  )}
                  
                  {founder.linkedin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#CBA135] text-[#CBA135] hover:bg-[#CBA135] hover:text-white transition-all duration-300"
                      onClick={() => window.open(founder.linkedin, '_blank')}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team Culture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Çalışma Kültürümüz</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            TDC Market'te çalışma kültürümüzü oluşturan değerler
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cultureValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h4>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=TDC+Market+Team"
              alt="TDC Market Ekibi"
              width={1200}
              height={600}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h4 className="text-2xl font-bold mb-2">TDC Market Ailesi</h4>
              <p className="text-lg">Birlikte büyüyor, birlikte başarıyoruz</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

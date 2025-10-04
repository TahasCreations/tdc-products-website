'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: 'Siparişim ne kadar sürede teslim edilir?',
    a: 'Standart teslimat süremiz 2-5 iş günüdür. Hızlı teslimat seçeneği ile 1-2 iş gününde teslim edebiliriz. Teslimat süresi ürün türüne ve teslimat adresine göre değişiklik gösterebilir.'
  },
  {
    q: 'İade ve değişim politikası nasıl?',
    a: 'Ürünlerinizi teslim aldığınız tarihten itibaren 30 gün içinde iade edebilirsiniz. Ürün orijinal ambalajında ve kullanılmamış durumda olmalıdır. İade kargo ücreti bizim tarafımızdan karşılanır.'
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: 'Kredi kartı, banka kartı, havale/EFT, kapıda ödeme ve taksitli ödeme seçeneklerini kabul ediyoruz. Tüm ödemeler SSL şifreleme ile güvenli bir şekilde işlenir.'
  },
  {
    q: 'Ürünleriniz orijinal mi?',
    a: 'Evet, tüm ürünlerimiz %100 orijinaldir. Sadece yetkili distribütörlerden tedarik ettiğimiz ürünleri satıyoruz. Sahte ürün satışı yapmıyoruz.'
  },
  {
    q: 'Müşteri hizmetlerinize nasıl ulaşabilirim?',
    a: '7/24 müşteri hizmetlerimize WhatsApp, e-posta veya telefon ile ulaşabilirsiniz. Ortalama yanıt süremiz 2 saattir. Canlı destek hattımız da mevcuttur.'
  },
  {
    q: 'Toplu sipariş indirimi var mı?',
    a: 'Evet, 10 adet ve üzeri siparişlerde %5, 50 adet ve üzeri siparişlerde %10 indirim uygularız. Kurumsal müşterilerimiz için özel fiyatlandırma seçenekleri de mevcuttur.'
  },
  {
    q: 'Ürünlerinizde garanti var mı?',
    a: 'Tüm ürünlerimizde üretici garantisi geçerlidir. Ayrıca kendi garantimiz de mevcuttur. Garanti süresi ürün türüne göre 1-3 yıl arasında değişir.'
  },
  {
    q: 'Kargo ücreti ne kadar?',
    a: '150 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde 15 TL kargo ücreti alınır. Hızlı teslimat seçeneği için ek ücret uygulanır.'
  },
  {
    q: 'Ürün stokta yoksa ne yapabilirim?',
    a: 'Stokta olmayan ürünler için bildirim listesine eklenebilirsiniz. Ürün stokta olduğunda size e-posta ile bilgi veririz. Özel üretim talepleriniz için bizimle iletişime geçebilirsiniz.'
  },
  {
    q: 'Gizlilik ve güvenlik nasıl sağlanıyor?',
    a: 'KVKK uyumlu gizlilik politikamız vardır. Kişisel verileriniz SSL şifreleme ile korunur. Ödeme bilgileriniz saklanmaz ve güvenli ödeme sistemleri kullanılır.'
  }
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Sıkça Sorulan Sorular</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Merak ettiğiniz soruların yanıtlarını burada bulabilirsiniz. 
            Aradığınızı bulamazsanız bizimle iletişime geçin.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-2xl px-6 hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#CBA135] transition-colors py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sorunuz mu var?
          </h3>
          <p className="text-gray-600 mb-6">
            Aradığınızı bulamadınız mı? Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:destek@tdcmarket.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              E-posta Gönder
            </a>
            <a
              href="tel:+908501234567"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#CBA135] text-[#CBA135] rounded-lg font-semibold hover:bg-[#CBA135] hover:text-white transition-all duration-300"
            >
              Telefon Et
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    title: 'Sipariş & Teslimat',
    icon: '📦',
    questions: [
      {
        q: 'Siparişim ne zaman kargoya verilir?',
        a: 'Siparişiniz onaylandıktan sonra 1-2 iş günü içinde kargoya verilir. Kargo takip numaranız SMS ve e-posta ile tarafınıza iletilir.',
      },
      {
        q: 'Kargo ücreti ne kadar?',
        a: '500 TL ve üzeri alışverişlerde kargo ücretsizdir. 500 TL altı siparişlerde kargo ücreti 29.90 TL\'dir.',
      },
      {
        q: 'Hangi kargo firmaları ile çalışıyorsunuz?',
        a: 'Yurtiçi Kargo, Aras Kargo ve MNG Kargo ile çalışmaktayız. Sipariş verirken tercih edebilirsiniz.',
      },
    ],
  },
  {
    title: 'İade & Değişim',
    icon: '🔄',
    questions: [
      {
        q: 'İade süresi ne kadar?',
        a: 'Ürünü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.',
      },
      {
        q: 'İade ücreti kim tarafından karşılanır?',
        a: 'Ürün kusurlu veya hatalı gönderilmişse iade ücreti tarafımızdan karşılanır. Müşteri kaynaklı iadeler de iade ücreti alıcıya aittir.',
      },
      {
        q: 'İade sürecim ne kadar sürer?',
        a: 'İade talebiniz onaylandıktan sonra ürünü kargoya vermeniz için 5 gün süreniz var. Ürün depoya ulaştıktan sonra 3-5 iş günü içinde ödemeniz iade edilir.',
      },
    ],
  },
  {
    title: 'Ödeme & Fatura',
    icon: '💳',
    questions: [
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur. Tüm kartlar için taksit imkanı sunuyoruz.',
      },
      {
        q: 'Fatura ne zaman düzenlenir?',
        a: 'Faturanız sipariş onaylandığında otomatik olarak düzenlenir ve e-posta adresinize gönderilir.',
      },
      {
        q: 'Taksit yapabilir miyim?',
        a: 'Evet, kredi kartlarına özel 3, 6, 9 ve 12 taksit seçeneklerimiz bulunmaktadır.',
      },
    ],
  },
  {
    title: 'Hesap & Güvenlik',
    icon: '🔐',
    questions: [
      {
        q: 'Nasıl üye olurum?',
        a: '"Üye Ol" butonuna tıklayarak e-posta adresiniz ile ücretsiz üye olabilirsiniz. Sosyal medya hesaplarınız ile de giriş yapabilirsiniz.',
      },
      {
        q: 'Şifremi unuttum, ne yapmalıyım?',
        a: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama linki gönderebilirsiniz.',
      },
      {
        q: 'Bilgilerim güvende mi?',
        a: 'Tüm verileriniz SSL sertifikası ile şifrelenir. Ödeme bilgilerinizi saklamıyoruz, güvenilir ödeme altyapıları kullanıyoruz.',
      },
    ],
  },
  {
    title: 'Ürünler',
    icon: '🎁',
    questions: [
      {
        q: 'Ürünler orijinal mi?',
        a: 'Evet, satışa sunduğumuz tüm ürünler orijinal ve lisanslıdır. Sahte ürün satışı yapmıyoruz.',
      },
      {
        q: 'Stok bilgisi güncel mi?',
        a: 'Stok bilgilerimiz anlık olarak güncellenmektedir. "Stokta Var" yazan ürünler anında gönderilebilir.',
      },
      {
        q: 'Pre-order nasıl çalışır?',
        a: 'Henüz piyasaya çıkmamış ürünler için ön sipariş verebilirsiniz. Ürün stoklara girdiğinde ilk siz bilgilendirilir ve ürününüz kargoya verilir.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-3 mb-4"
          >
            <HelpCircle className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-lg text-gray-600">
            Aradığınız cevabı bulamadıysanız destek ekibimizle iletişime geçin
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Soru ara..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.title}</span>
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === key;

                  return (
                    <div key={questionIndex}>
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-indigo-600 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 text-gray-700 leading-relaxed bg-gray-50">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Cevabını bulamadın mı?
          </h3>
          <p className="mb-6 text-indigo-100">
            Destek ekibimiz size yardımcı olmak için burada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Canlı Destek</span>
            </button>
            <button className="px-6 py-3 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition-colors flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>E-posta Gönder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


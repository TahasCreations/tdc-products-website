import { Metadata } from 'next';
import { KVKKCompliance } from '@/lib/kvkk/compliance';
import { Shield, FileText, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | TDC Market',
  description: 'Kişisel Verilerin Korunması Kanunu (KVKK) aydınlatma metni ve gizlilik politikası',
};

export default async function KVKKPage() {
  const kvkkText = KVKKCompliance.getKVKKText('1.0');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CBA135] rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#CBA135]" />
            Veri Sorumlusu Bilgileri
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#CBA135] mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Adres</p>
                <p className="text-gray-600 dark:text-gray-400">
                  TDC Market - [Firma Adresi]
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#CBA135] mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Telefon</p>
                <p className="text-gray-600 dark:text-gray-400">
                  <a href="tel:+908501234567" className="hover:text-[#CBA135]">
                    +90 (850) 123 45 67
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#CBA135] mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">E-posta</p>
                <p className="text-gray-600 dark:text-gray-400">
                  <a href="mailto:kvkk@tdcmarket.com" className="hover:text-[#CBA135]">
                    kvkk@tdcmarket.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KVKK Text */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: kvkkText.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Your Rights */}
        <div className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Haklarınız
          </h2>
          <ul className="space-y-2 text-lg">
            <li>✓ Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>✓ İşlenmişse bilgi talep etme</li>
            <li>✓ Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>✓ Silinmesini veya yok edilmesini isteme</li>
            <li>✓ Verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>✓ İşlenen verilerin analiz edilmesine itiraz etme</li>
            <li>✓ Zararınızın giderilmesini talep etme</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/kvkk/basvuru"
            className="bg-[#CBA135] hover:bg-[#B8941F] text-white font-semibold py-4 px-6 rounded-xl transition-colors text-center"
          >
            KVKK Başvuru Formu
          </Link>
          <Link
            href="/kvkk/veri-export"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors text-center"
          >
            Verilerimi İndir
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            Bu metin 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca hazırlanmıştır.
          </p>
          <p className="mt-2">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>
    </div>
  );
}




import { Metadata } from 'next';
import { FileText, CheckCircle, AlertCircle, Clock, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | TDC Market',
  description: 'TDC Market mesafeli satış sözleşmesi, cayma hakkı ve iade koşulları',
};

export default function DistanceSalesAgreementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CBA135] rounded-full mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Satış Yönetmeliği
          </p>
        </div>

        {/* Important Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                Önemli Bilgiler
              </h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li>• Siparişleriniz 1-3 iş günü içinde kargoya verilir</li>
                <li>• 14 gün içinde cayma hakkınız bulunmaktadır</li>
                <li>• Ücretsiz kargo için minimum 500 TL alışveriş yapmanız gerekmektedir</li>
                <li>• Tüm ödemeler SSL ile güvence altındadır</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Agreement Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#CBA135]" />
              1. TARAFLAR
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>SATICI:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Firma Adı: TDC Market</li>
                <li>Adres: [Firma Adresi]</li>
                <li>Telefon: +90 (850) 123 45 67</li>
                <li>E-posta: destek@tdcmarket.com</li>
                <li>Mersis No: [Mersis Numarası]</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                <strong>ALICI:</strong> Web sitesinde kayıtlı müşteri
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#CBA135]" />
              2. KONU
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Bu sözleşme, TDC Market web sitesi üzerinden yapılan satışlara ilişkin hak ve yükümlülükleri düzenlemektedir.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#CBA135]" />
              3. FİYAT VE ÖDEME
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                • Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir.
              </p>
              <p>
                • Ödeme yöntemleri: Kredi kartı, Havale/EFT, Kapıda ödeme
              </p>
              <p>
                • Sipariş onayından sonra ödeme alınır.
              </p>
              <p>
                • Fiyatlar stok durumuna göre değişiklik gösterebilir.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#CBA135]" />
              4. TESLİMAT
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                • Siparişler 1-3 iş günü içinde kargoya verilir.
              </p>
              <p>
                • Teslimat süresi kargo firmasına göre 1-5 iş günü arasındadır.
              </p>
              <p>
                • 500 TL ve üzeri alışverişlerde kargo ücretsizdir.
              </p>
              <p>
                • Kargo takip numarası SMS ve e-posta ile bildirilir.
              </p>
            </div>
          </section>

          {/* Section 5 - CAYMA HAKKI */}
          <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              5. CAYMA HAKKI
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="font-semibold">
                Tüketiciler, mesafeli satış sözleşmesinden, sözleşmenin kurulduğu tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir.
              </p>
              <p>
                <strong>Cayma hakkının kullanılamayacağı durumlar:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Müşterinin isteği ile kişiselleştirilmiş ürünler</li>
                <li>Hızlı bozulabilir veya son kullanma tarihi geçmiş ürünler</li>
                <li>Açıldıktan sonra sağlık veya hijyen açısından iade edilemeyecek ürünler</li>
                <li>Dijital içerikler (indirildikten sonra)</li>
              </ul>
              <p className="mt-4">
                <strong>İade süreci:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>İade talebinizi <Link href="/iade" className="text-[#CBA135] hover:underline">İade Formu</Link> üzerinden oluşturun</li>
                <li>Onay sonrası ürünü orijinal ambalajında kargoya verin</li>
                <li>İade kargo ücreti müşteriye aittir (ürün hatası durumunda ücretsiz)</li>
                <li>Ürün kontrol edildikten sonra ödeme 14 iş günü içinde iade edilir</li>
              </ol>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. GARANTİ VE SORUMLULUK
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Ürünler, üretici garantisi kapsamındadır. Garanti koşulları ürün sayfasında belirtilmiştir.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. UYUŞMAZLIK ÇÖZÜMÜ
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Uyuşmazlıklar öncelikle müzakere ile çözülmeye çalışılır. Çözülemezse Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. KİŞİSEL VERİLERİN KORUNMASI
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Kişisel verileriniz,{' '}
              <Link href="/kvkk" className="text-[#CBA135] hover:underline">
                KVKK Aydınlatma Metni
              </Link>
              {' '}kapsamında işlenmektedir.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm space-y-2">
          <p>
            Bu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Satış Yönetmeliği uyarınca hazırlanmıştır.
          </p>
          <p>
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link
              href="/iade"
              className="text-[#CBA135] hover:underline font-semibold"
            >
              İade ve Değişim
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/kvkk"
              className="text-[#CBA135] hover:underline font-semibold"
            >
              KVKK Aydınlatma Metni
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/iletisim"
              className="text-[#CBA135] hover:underline font-semibold"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




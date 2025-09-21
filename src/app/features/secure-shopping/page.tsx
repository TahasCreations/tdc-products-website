'use client';

import Link from 'next/link';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  CreditCardIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function SecureShoppingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheckIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Güvenli Alışveriş
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SSL sertifikası ile güvenli ödeme sistemi
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <LockClosedIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SSL Şifreleme</h3>
              <p className="text-gray-600">
                Tüm verileriniz 256-bit SSL şifreleme ile korunur ve güvenli şekilde işlenir.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <CreditCardIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Güvenli Ödeme</h3>
              <p className="text-gray-600">
                Kredi kartı bilgileriniz saklanmaz, güvenli ödeme sistemleri kullanılır.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <CheckBadgeIcon className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Güvenlik Sertifikası</h3>
              <p className="text-gray-600">
                Uluslararası güvenlik standartlarına uygun sertifikalı altyapı.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            %100 Güvenli Alışveriş
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Kişisel ve finansal bilgileriniz en yüksek güvenlik standartlarında korunur.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-pink-600 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i className="ri-shopping-bag-line mr-2"></i>
            Güvenle Alışveriş Yap
          </Link>
        </div>
      </section>
    </div>
  );
}

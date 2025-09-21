'use client';

import Link from 'next/link';
import { 
  HeartIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function CustomerSatisfactionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Müşteri Memnuniyeti
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              %100 müşteri memnuniyeti garantisi
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <StarIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5 Yıldız Hizmet</h3>
              <p className="text-gray-600">
                Müşterilerimizden aldığımız 5 yıldız değerlendirmeler kalitemizi kanıtlıyor.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7/24 Destek</h3>
              <p className="text-gray-600">
                Her zaman yanınızdayız. Sorularınız için 7/24 müşteri hizmetleri.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Memnuniyet Garantisi</h3>
              <p className="text-gray-600">
                Memnun kalmadığınız ürünleri 30 gün içinde iade edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Müşteri Memnuniyeti Önceliğimiz
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sizin memnuniyetiniz bizim için en önemli değer. Her zaman yanınızdayız.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i className="ri-shopping-bag-line mr-2"></i>
            Memnuniyetle Alışveriş Yap
          </Link>
        </div>
      </section>
    </div>
  );
}

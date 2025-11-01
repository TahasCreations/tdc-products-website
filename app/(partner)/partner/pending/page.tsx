import { Clock, CheckCircle2, MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-6 sm:p-8 text-white text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2">Başvurunuz İnceleniyor</h1>
            <p className="text-sm sm:text-base text-white/90">Başvurunuz ekibimiz tarafından değerlendiriliyor</p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="space-y-6 mb-8">
              {/* Timeline */}
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                <div className="relative">
                  <div className="absolute left-[-33px] w-4 h-4 bg-green-600 rounded-full border-4 border-white" />
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Başvuru Alındı</p>
                      <p className="text-sm text-gray-600">Başvurunuz sistemimize kaydedildi</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-33px] w-4 h-4 bg-yellow-600 rounded-full border-4 border-white animate-pulse" />
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">İnceleme Aşamasında</p>
                      <p className="text-sm text-gray-600">Ekibimiz başvurunuzu değerlendiriyor</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-33px] w-4 h-4 bg-gray-300 rounded-full border-4 border-white" />
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-400">Onay</p>
                      <p className="text-sm text-gray-400">Sonuç e-posta ile bildirilecek</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-2">İnceleme Süresi</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Başvurular genellikle <span className="font-bold text-blue-600">24-48 saat</span> içinde 
                    değerlendirilir. Yoğun dönemlerde bu süre uzayabilir.
                  </p>
                  <p className="text-sm text-gray-700">
                    Başvuru sonucunuz kayıtlı e-posta adresinize bildirilecektir.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-center text-sm sm:text-base"
              >
                Anasayfaya Dön
              </Link>
              <Link
                href="/destek"
                className="flex-1 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:shadow-md transition-all font-semibold text-center text-sm sm:text-base"
              >
                Destek
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

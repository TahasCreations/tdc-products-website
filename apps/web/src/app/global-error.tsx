'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-error-warning-line text-2xl text-red-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Kritik Hata</h1>
                <p className="text-gray-600">Uygulama genelinde bir hata oluştu</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Hata:</strong> {error.message}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                  >
                    Tekrar Dene
                  </button>
                  <Link
                    href="/"
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 text-center"
                  >
                    Ana Sayfa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

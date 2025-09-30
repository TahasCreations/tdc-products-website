import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TDC Market Admin',
  description: 'TDC Market yönetim paneli',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">TDC Market Admin</h1>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <a
                      href="/products"
                      className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Ürünler
                    </a>
                    <a
                      href="/orders"
                      className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Siparişler
                    </a>
                    <a
                      href="/customers"
                      className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Müşteriler
                    </a>
                    <a
                      href="/analytics"
                      className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Analitik
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-sm text-gray-500">AI Öneriler Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}


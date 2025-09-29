import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { initializePluginSystem } from '../../src/lib/plugin-system'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TDC Plugin Integration Example',
  description: 'Cross-site plugin integration example for TDC platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Plugin sistemini başlat
  const registry = await initializePluginSystem();

  // Plugin'leri keşfet ve yükle
  await registry.discoverPlugins();
  
  // E-commerce plugin'ini etkinleştir
  try {
    await registry.enable('ecommerce', {
      enabled: true,
      settings: { 
        currency: 'TRY', 
        taxRate: 0.18,
        autoSync: true,
        syncInterval: 300000
      }
    });
  } catch (error) {
    console.warn('E-commerce plugin could not be enabled:', error);
  }

  // Pricing plugin'ini etkinleştir
  try {
    await registry.enable('pricing-plugin', {
      enabled: true,
      settings: { 
        currency: 'TRY',
        defaultMarkup: 1.2
      }
    });
  } catch (error) {
    console.warn('Pricing plugin could not be enabled:', error);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    TDC Plugin Integration
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-600 hover:text-gray-900">
                    Ana Sayfa
                  </a>
                  <a href="/products" className="text-gray-600 hover:text-gray-900">
                    Ürünler
                  </a>
                  <a href="/pricing" className="text-gray-600 hover:text-gray-900">
                    Fiyat Hesaplama
                  </a>
                  <a href="/plugins" className="text-gray-600 hover:text-gray-900">
                    Plugin Yönetimi
                  </a>
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
  )
}

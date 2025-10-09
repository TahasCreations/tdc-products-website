import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import '../src/app/globals.css'
import { ThemeProvider } from '../src/components/providers/ThemeProvider'
import { CartProvider } from '../src/contexts/CartContext'
import { WishlistProvider } from '../src/contexts/WishlistContext'
import { CompareProvider } from '../src/contexts/CompareContext'
import SessionProviderWrapper from '../src/components/providers/SessionProviderWrapper'
import PWAInstaller from '../src/components/PWAInstaller'
import ConditionalHeader from '../components/layout/ConditionalHeader'
import { ToastProvider } from '../src/components/ui/Toast'
import BottomNavigation from '../src/components/ui/BottomNavigation'
import { FloatingThemeToggle } from '../src/components/ui/ThemeToggle'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TDC Products — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
  description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Products\'ta. Özel figürler, tasarım ürünleri ve daha fazlası.',
  keywords: 'TDC Products, özel figürler, koleksiyon, el yapımı, tasarım, elektronik, moda, ev yaşamı',
  authors: [{ name: 'TDC Products' }],
  creator: 'TDC Products',
  publisher: 'TDC Products',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tdcmarket.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  themeColor: '#CBA135',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TDC Products',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    title: 'TDC Products — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Products\'ta.',
    url: 'https://tdcmarket.com',
    siteName: 'TDC Products',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TDC Products - Özel Figürlerden Elektroniğe',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDC Products — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Products\'ta.',
    images: ['/twitter-image.jpg'],
    creator: '@tdcmarket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5A63F2" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TDC Products" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          <SessionProviderWrapper>
            <ThemeProvider>
              <ToastProvider>
                <CartProvider>
                  <WishlistProvider>
                    <CompareProvider>
                      <ConditionalHeader />
                      {children}
                      <BottomNavigation />
                      <FloatingThemeToggle />
                      <PWAInstaller />
                    </CompareProvider>
                  </WishlistProvider>
                </CartProvider>
              </ToastProvider>
            </ThemeProvider>
          </SessionProviderWrapper>
        </div>
      </body>
    </html>
  )
}

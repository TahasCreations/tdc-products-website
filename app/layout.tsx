import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import '../src/app/globals.css'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import SessionProviderWrapper from '../src/components/providers/SessionProviderWrapper'
import PWAInstaller from '../src/components/PWAInstaller'

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
  title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
  description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te. Özel figürler, tasarım ürünleri ve daha fazlası.',
  keywords: 'TDC Market, özel figürler, koleksiyon, el yapımı, tasarım, elektronik, moda, ev yaşamı',
  authors: [{ name: 'TDC Market' }],
  creator: 'TDC Market',
  publisher: 'TDC Market',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tdcmarket.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te.',
    url: 'https://tdcmarket.com',
    siteName: 'TDC Market',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TDC Market - Özel Figürlerden Elektroniğe',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te.',
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
    <html lang="tr" className={`${inter.variable} ${manrope.variable}`}>
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
        <meta name="apple-mobile-web-app-title" content="TDC Market" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          <SessionProviderWrapper>
            <ThemeProvider>
              {children}
              <PWAInstaller />
            </ThemeProvider>
          </SessionProviderWrapper>
        </div>
      </body>
    </html>
  )
}

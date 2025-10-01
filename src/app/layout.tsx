import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import PWAInstaller from '@/components/PWAInstaller'

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
  title: 'TDC Products - Premium Figür & Koleksiyon Dünyası',
  description: 'El işçiliği ve yüksek kalite ile üretilen premium figür koleksiyonları. Sanat ve koleksiyon tutkunları için özel tasarım figürler.',
  keywords: 'figür, koleksiyon, anime, premium, el işçiliği, sanat, TDC Products',
  authors: [{ name: 'TDC Products' }],
  creator: 'TDC Products',
  publisher: 'TDC Products',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tdcproducts.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TDC Products - Premium Figür & Koleksiyon Dünyası',
    description: 'El işçiliği ve yüksek kalite ile üretilen premium figür koleksiyonları.',
    url: 'https://tdcproducts.com',
    siteName: 'TDC Products',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TDC Products - Premium Figür Koleksiyonları',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDC Products - Premium Figür & Koleksiyon Dünyası',
    description: 'El işçiliği ve yüksek kalite ile üretilen premium figür koleksiyonları.',
    images: ['/twitter-image.jpg'],
    creator: '@tdcproducts',
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
        <meta name="apple-mobile-web-app-title" content="TDC Admin" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          <ThemeProvider>
            {children}
            <PWAInstaller />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
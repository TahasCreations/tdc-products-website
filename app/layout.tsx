import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../src/app/globals.css';
import { Providers } from './providers';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: 'TDC Market - Türkiye\'nin E-Ticaret Platformu',
    template: '%s | TDC Market',
  },
  description: 'TDC Market\'te binlerce ürün, güvenli alışveriş ve hızlı teslimat. Figürlerden elektroniğe, modadan ev eşyalarına kadar her şey burada!',
  keywords: ['e-ticaret', 'online alışveriş', 'figür', 'elektronik', 'moda', 'TDC Market'],
  authors: [{ name: 'TDC Market' }],
  creator: 'TDC Market',
  publisher: 'TDC Market',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'TDC Market',
    title: 'TDC Market - Türkiye\'nin E-Ticaret Platformu',
    description: 'TDC Market\'te binlerce ürün, güvenli alışveriş ve hızlı teslimat.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TDC Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDC Market - Türkiye\'nin E-Ticaret Platformu',
    description: 'TDC Market\'te binlerce ürün, güvenli alışveriş ve hızlı teslimat.',
    images: ['/og-image.jpg'],
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#CBA135' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Manifest temporarily disabled to fix 404 errors */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

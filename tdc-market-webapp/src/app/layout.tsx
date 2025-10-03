import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

const manrope = Manrope({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-manrope'
});

export const metadata: Metadata = {
  title: {
    default: 'TDC Market - Türkiye\'nin Tasarım & Figür Pazarı',
    template: '%s | TDC Market'
  },
  description: 'AI destekli arama, özel domainli mağazalar, düşük komisyon. El yapımı sıcaklığı ile AI güvencesini buluşturan platform.',
  keywords: [
    '3D figür',
    'dekoratif obje',
    'el yapımı',
    'tasarım',
    'hediye',
    'koleksiyon',
    '3D yazıcı',
    'figür',
    'dekorasyon',
    'e-ticaret'
  ],
  authors: [{ name: 'TDC Market' }],
  creator: 'TDC Market',
  publisher: 'TDC Market',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TDC Market",
  },
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
    type: "website",
    locale: 'tr_TR',
    url: 'https://tdcmarket.com',
    siteName: "TDC Market",
    title: "TDC Market - Türkiye'nin Tasarım & Figür Pazarı",
    description: "AI destekli arama, özel domainli mağazalar, düşük komisyon. El yapımı sıcaklığı ile AI güvencesini buluşturan platform.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TDC Market - 3D Figür Pazarı',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TDC Market - Türkiye'nin Tasarım & Figür Pazarı",
    description: "AI destekli arama, özel domainli mağazalar, düşük komisyon.",
    images: ['/og-image.jpg'],
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
    yandex: 'your-yandex-verification-code',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TDC Market" />
      </head>
      <body className={`${inter.className} ${manrope.variable} transition-colors duration-300`}>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <a href="#main-content" className="skip-link">
            Ana içeriğe geç
          </a>
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

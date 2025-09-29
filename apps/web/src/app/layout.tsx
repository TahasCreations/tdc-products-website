import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });
const { SellerAuthProvider } = dynamic(() => import("../hooks/useSellerAuth"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TDC Market - 3D Baskı Figürler",
  description: "Anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürleri.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TDC Market",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TDC Market",
    title: "TDC Market - 3D Baskı Figürler",
    description: "Anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürleri.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TDC Market - 3D Baskı Figürler",
    description: "Anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürleri.",
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
      <body className={`${inter.className} transition-colors duration-300`}>
        <SellerAuthProvider>
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
        </SellerAuthProvider>
      </body>
    </html>
  );
}
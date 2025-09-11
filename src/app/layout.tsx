import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { OrderProvider } from "../contexts/OrderContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { WishlistProvider } from "../contexts/WishlistContext";
import WhatsAppButton from "../../components/WhatsAppButton";
import { ToastProvider } from "../components/Toast";
import GlobalErrorBoundary from "../components/GlobalErrorBoundary";
import AIChatbot from "../components/AIChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TDC Products - 3D Baskı Figürler",
  description: "Anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürleri.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TDC Products",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TDC Products",
    title: "TDC Products - 3D Baskı Figürler",
    description: "Anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürleri.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TDC Products - 3D Baskı Figürler",
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
        <meta name="apple-mobile-web-app-title" content="TDC Products" />
      </head>
      <body className={`${inter.className} transition-colors duration-300`}>
        <GlobalErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <OrderProvider>
                      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                        <Header />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                        <WhatsAppButton />
                        <AIChatbot context={{ userType: 'customer' }} />
                      </div>
                    </OrderProvider>
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
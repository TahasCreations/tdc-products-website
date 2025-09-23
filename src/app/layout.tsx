import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues
const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer"), { ssr: false });
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { OrderProvider } from "../contexts/OrderContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { WishlistProvider } from "../contexts/WishlistContext";
// Dynamic imports for client-side components
const WhatsAppButton = dynamic(() => import("../../components/WhatsAppButton"), { ssr: false });
const AIChatbot = dynamic(() => import("../components/AIChatbot"), { ssr: false });
const AccessibilityProvider = dynamic(() => import("../components/AccessibilityProvider"), { ssr: false });
const ErrorBoundary = dynamic(() => import("../components/ErrorBoundary"), { ssr: false });
const GlobalErrorBoundary = dynamic(() => import("../components/GlobalErrorBoundary"), { ssr: false });
const GoogleAnalytics = dynamic(() => import("../components/analytics/GoogleAnalytics"), { ssr: false });
const HeatmapTracker = dynamic(() => import("../components/analytics/HeatmapTracker"), { ssr: false });

import { ToastProvider } from "../components/Toast";

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
          <ErrorBoundary>
            <AccessibilityProvider>
              <ThemeProvider>
                <ToastProvider>
                  <AuthProvider>
                    <WishlistProvider>
                      <CartProvider>
                        <OrderProvider>
                          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                            <a href="#main-content" className="skip-link">
                              Ana içeriğe geç
                            </a>
                            <Header />
                            <main id="main-content" className="flex-grow">
                              <ErrorBoundary>
                                {children}
                              </ErrorBoundary>
                            </main>
                            <Footer />
                            <WhatsAppButton />
                            <AIChatbot context={{ userType: 'customer' }} />
                            
                            {/* Analytics */}
                            <GoogleAnalytics 
                              measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} 
                              enabled={process.env.NODE_ENV === 'production'} 
                            />
                            <HeatmapTracker 
                              enabled={process.env.NODE_ENV === 'production'} 
                            />
                          </div>
                        </OrderProvider>
                      </CartProvider>
                    </WishlistProvider>
                  </AuthProvider>
                </ToastProvider>
              </ThemeProvider>
            </AccessibilityProvider>
          </ErrorBoundary>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
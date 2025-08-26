import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDC Products",
  description: "TDC Products - Figür, koleksiyon ve daha fazlası",
  metadataBase: new URL("https://www.tdc-products.com"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "TDC Products",
    description: "Yüksek kaliteli 3D baskı figürler ve koleksiyon ürünleri",
    url: "https://www.tdc-products.com",
    siteName: "TDC Products",
    images: [
      {
        url: "https://images.unsplash.com/photo-1601582585289-250ed79444c4?q=80&w=1600&auto=format&fit=crop",
        width: 1600,
        height: 900,
        alt: "TDC Products Hero",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TDC Products",
    description: "Yüksek kaliteli 3D baskı figürler ve koleksiyon ürünleri",
    images: [
      "https://images.unsplash.com/photo-1601582585289-250ed79444c4?q=80&w=1600&auto=format&fit=crop",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

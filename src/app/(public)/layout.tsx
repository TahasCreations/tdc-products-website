'use client';

import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { A11yProvider } from '@/components/accessibility/A11yProvider';
import { PerformanceMonitor } from '@/lib/performance/analytics';
import { SkipLinks } from '@/components/accessibility/A11yProvider';
import Header from '@/components/layout/Header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <A11yProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <PerformanceMonitor pageName="public">
                <SkipLinks />
                <Header />
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
              </PerformanceMonitor>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </A11yProvider>
  );
}

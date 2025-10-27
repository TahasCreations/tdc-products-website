'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CompareProvider } from '@/contexts/CompareContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}


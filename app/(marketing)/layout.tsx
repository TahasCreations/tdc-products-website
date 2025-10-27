'use client';

import { Metadata } from 'next';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import TenantHeaderBar from '../../src/components/tenant/TenantHeaderBar';
import ClientThemeProvider from '../../src/components/ClientThemeProvider';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <TenantHeaderBar />
        <main className="flex-1 pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </ClientThemeProvider>
  );
}

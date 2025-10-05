'use client';

import { ThemeProvider } from 'next-themes';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {/* Admin layout - NO HEADER */}
        <main>
          {children}
        </main>
      </ThemeProvider>
    </>
  );
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TDC Products - 3D Figür Koleksiyonu',
  description: 'Yüksek kaliteli 3D baskı teknolojisi ile anime, oyun ve film karakterlerinin figürlerini üretiyoruz.',
  keywords: 'TDC Products, 3D figür, anime figürü, oyun karakterleri, film karakterleri, koleksiyonluk eşyalar',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
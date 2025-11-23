import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Turno cajitas',
  description: 'Asamblea de circuito 2025-2026',
  generator: 'v0.app',
  icons: {
    icon: '/Captura de pantalla 2025-11-23 a la(s) 3.07.48 p. m..png',
    apple: '/Captura de pantalla 2025-11-23 a la(s) 3.07.48 p. m..png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

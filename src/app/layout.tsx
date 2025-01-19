import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

import 'cal-sans'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://doxai.vercel.app/'),
  title: 'Dox AI',
  description:
    'Dox AI is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
  robots: 'noindex, nofollow',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    { rel: 'apple-touch-icon', url: '/favicon.png' },
  ],
  twitter: {
    card: 'summary',
    site: '@doxai',
    creator: '@doxai',
  },
  openGraph: {
    title: 'Dox AI',
    description:
      'Dox AI is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`h-full font-sans ${inter.variable}`} lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col h-full">
        <main className="h-full">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}

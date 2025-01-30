import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
  metadataBase: new URL('https://trylittera.vercel.app/'),
  title: 'Littera',
  description:
    'Littera is a modern, feature-rich text editor that integrates traditional tools with advanced AI to elevate your content creation.',
  robots: 'noindex, nofollow',
  twitter: {
    card: 'summary',
    site: '@littera',
    creator: '@littera',
  },
  openGraph: {
    title: 'Littera',
    description:
      'Littera is a modern, feature-rich text editor that integrates traditional tools with advanced AI to elevate your content creation.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`h-full font-sans ${inter.variable}`} lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col h-full">
        <main className="h-full">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

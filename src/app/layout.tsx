import './globals.css'
import type { Metadata } from 'next'

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

// Log font loading status
console.log('Inter font configuration:', {
  className: inter.className,
  variable: inter.variable,
  weights: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://notion-dev-tan.vercel.app'),
  title: 'Common Tongue',
  description:
    'Common Tongue is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
  robots: 'noindex, nofollow',
  icons: [{ url: '/favicon.png' }],
  twitter: {
    card: 'summary',
    site: '@commontongue',
    creator: '@commontongue',
  },
  openGraph: {
    title: 'Common Tongue',
    description:
      'Common Tongue is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('Rendering RootLayout with Inter font:', inter.variable)

  return (
    <html className={`h-full font-sans ${inter.variable}`} lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col h-full">
        <main className="h-full">{children}</main>
      </body>
    </html>
  )
}

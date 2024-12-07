import './globals.css'
import type { Metadata } from 'next'

import 'cal-sans'

import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

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
  return (
    <html className="h-full font-sans" lang="en">
      <body className="flex flex-col h-full">
        <main className="h-full">{children}</main>
      </body>
    </html>
  )
}

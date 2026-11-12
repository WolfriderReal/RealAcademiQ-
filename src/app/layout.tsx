import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = 'https://realacademiq.com'

export const metadata: Metadata = {
  title: {
    default: 'RealAcademiQ - Academic Support, Editing & Research Guidance',
    template: '%s | RealAcademiQ',
  },
  description: 'Get expert academic support, research guidance, editing, proofreading, and writing coaching with RealAcademiQ.',
  keywords: ['academic support', 'research guidance', 'editing', 'proofreading', 'writing coaching', 'thesis help'],
  authors: [{ name: 'RealAcademiQ' }],
  creator: 'RealAcademiQ',
  publisher: 'RealAcademiQ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'RealAcademiQ - Academic Support, Editing & Research Guidance',
    description: 'Get expert academic support, research guidance, editing, proofreading, and writing coaching with RealAcademiQ.',
    url: siteUrl,
    siteName: 'RealAcademiQ',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'RealAcademiQ - Academic Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealAcademiQ - Academic Support, Editing & Research Guidance',
    description: 'Get expert academic support, research guidance, editing, proofreading, and writing coaching with RealAcademiQ.',
    images: ['/og-image.svg'],
    creator: '@RealAcademiQ',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}

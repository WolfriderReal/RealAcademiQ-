import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = 'https://real-academi-q.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'RealAcademiQ - Academic Excellence Assistance',
    template: '%s | RealAcademiQ'
  },
  description: 'Professional assistance with assignments, thesis, projects, and proposals. Get expert help from qualified academics.',
  keywords: ['academic assistance', 'assignments', 'thesis', 'projects', 'proposals', 'academic writing', 'student help'],
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
    title: 'RealAcademiQ - Academic Excellence Assistance',
    description: 'Professional assistance with assignments, thesis, projects, and proposals. Get expert help from qualified academics.',
    url: siteUrl,
    siteName: 'RealAcademiQ',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'RealAcademiQ - Academic Excellence Assistance',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealAcademiQ - Academic Excellence Assistance',
    description: 'Professional assistance with assignments, thesis, projects, and proposals.',
    images: ['/og-image.jpg'],
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'SNulKA4FkVJvxVDFIWS02TT37AmAuzyW7E-CiVzcwWI',
  },
  other: {
    'google-site-verification': 'SNulKA4FkVJvxVDFIWS02TT37AmAuzyW7E-CiVzcwWI',
  },
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
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Menu, MessageCircle } from 'lucide-react'

const whatsappLink = 'https://wa.me/254101582198?text=Hello%20RealAcademiQ%2C%20I%20need%20help%20with%20my%20project.'

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/track-order', label: 'Track Order' },
]

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-emerald-800/40 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="relative flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-4 md:gap-8 lg:gap-12">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="RealAcademiQ home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_0_22px_rgba(16,185,129,0.5)]">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white sm:text-xl">RealAcademiQ</span>
            </Link>

            <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
              {navigationLinks.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-emerald-300">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200 sm:inline-flex">
              <MessageCircle className="h-4 w-4" />WhatsApp
            </a>
            <Link href="/track-order" className="hidden text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200 sm:inline">Track Order</Link>
            <Link href="/order" aria-label="Submit an order">
              <Button className="h-10 bg-emerald-600 px-3 text-sm text-white hover:bg-emerald-700 sm:px-4">
                <span className="sm:hidden">Order</span>
                <span className="hidden sm:inline">Submit Order</span>
              </Button>
            </Link>

            <details className="group relative lg:hidden">
              <summary aria-label="Open navigation menu" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-slate-700 text-white hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </summary>
              <nav aria-label="Mobile navigation" className="absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-xl">
                {navigationLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-emerald-300">
                    {link.label}
                  </Link>
                ))}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-1 flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-emerald-300 hover:bg-slate-800">
                  <MessageCircle className="h-4 w-4" />WhatsApp
                </a>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}

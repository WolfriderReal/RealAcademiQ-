'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { GraduationCap, MessageCircle, Heart } from 'lucide-react'

const whatsappLink = 'https://wa.me/254101582198?text=Hello%20RealAcademiQ%2C%20I%20need%20help%20with%20my%20project.'
const paypalDonateLink = 'https://www.paypal.com/donate/?business=kstrategic_inc@outlook.com&no_recurring=0&item_name=Support+RealAcademiQ'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">RealAcademiQ</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
                Home
              </Link>
              <Link href="/services" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
                Services
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={paypalDonateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              title="Support us with a donation"
            >
              <Heart className="w-4 h-4" />
              Donate
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link href="/track-order" className="hidden sm:inline text-sm font-medium transition-colors text-amber-600 hover:text-amber-700">
              Track Order
            </Link>
            <Link href="/order">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Submit Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
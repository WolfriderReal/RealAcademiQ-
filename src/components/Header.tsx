'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { GraduationCap, MessageCircle, Heart, X } from 'lucide-react'
import { useState } from 'react'

const whatsappLink = 'https://wa.me/254101582198?text=Hello%20RealAcademiQ%2C%20I%20need%20help%20with%20my%20project.'

export default function Header() {
  const [showDonationModal, setShowDonationModal] = useState(false)

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

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowDonationModal(!showDonationModal)}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-yellow-700 hover:text-yellow-800 transition-colors"
              title="Support us"
            >
              <Heart className="w-4 h-4" />
              Buy Me Coffee
            </button>

            {showDonationModal && (
              <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-80 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900">Support RealAcademiQ</h3>
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <a
                    href="https://www.paypal.com/donate/?business=kstrategic_inc@outlook.com&currency_code=USD"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowDonationModal(false)}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Donate with PayPal
                  </a>
                  <a
                    href="https://buymeacoffee.com/realacademiq"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowDonationModal(false)}
                    className="block w-full text-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Buy Me Coffee
                  </a>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>M-Pesa:</strong>
                    </p>
                    <p className="text-sm text-slate-900 mb-1">
                      Business Number: <span className="font-bold">714777</span>
                    </p>
                    <p className="text-sm text-slate-900">
                      Account Number: <span className="font-bold">440005939461</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
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
'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { GraduationCap, MessageCircle, Heart, X } from 'lucide-react'
import { useState } from 'react'

const whatsappLink = 'https://wa.me/254101582198?text=Hello%20RealAcademiQ%2C%20I%20need%20help%20with%20my%20project.'

export default function Header() {
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1600)
    } catch {
      setCopiedField(null)
    }
  }

  return (
    <header className="fixed top-0 w-full bg-slate-950/95 backdrop-blur-md border-b border-emerald-800/40 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-[0_0_22px_rgba(16,185,129,0.5)]">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RealAcademiQ</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium transition-colors text-slate-300 hover:text-emerald-300">
                Home
              </Link>
              <Link href="/services" className="text-sm font-medium transition-colors text-slate-300 hover:text-emerald-300">
                Services
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors text-slate-300 hover:text-emerald-300">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium transition-colors text-slate-300 hover:text-emerald-300">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-end gap-1">
            <p className="hidden lg:block text-xs font-bold leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-lime-300 to-emerald-200 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)] animate-[blink_1s_steps(2,start)_infinite]">
              Your generosity inspires us every day.
            </p>
            <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowDonationModal(!showDonationModal)}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
              title="Support us"
            >
              <Heart className="w-4 h-4" />
              Buy Me Coffee
            </button>

            {showDonationModal && (
              <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-2xl p-4 min-w-80 z-50">
                <p className="text-sm text-slate-600 mb-3">Your generosity inspires us every day.</p>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900">Support RealAcademiQ</h3>
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="text-slate-400 hover:text-slate-700"
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
                    <div className="mb-2">
                      <p className="text-sm text-slate-900">
                        Paybill Business Number: <span className="font-bold">714777</span>
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-1 h-8 text-xs border-green-300 text-green-700"
                        onClick={() => copyToClipboard('714777', 'paybill')}
                      >
                        {copiedField === 'paybill' ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-slate-900">
                        Account Number: <span className="font-bold">440005939461</span>
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-1 h-8 text-xs border-green-300 text-green-700"
                        onClick={() => copyToClipboard('440005939461', 'account')}
                      >
                        {copiedField === 'account' ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link href="/track-order" className="hidden sm:inline text-sm font-medium transition-colors text-emerald-300 hover:text-emerald-200">
              Track Order
            </Link>
            <Link href="/order">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Submit Order
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
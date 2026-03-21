'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare, CheckCircle, Clock, CreditCard, FileCheck2, Download } from 'lucide-react'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('-')
  const [token, setToken] = useState('-')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId')?.trim() || '-')
    setToken(params.get('token')?.trim() || '-')
  }, [])

  const whatsappTrackLink = `https://wa.me/254101582198?text=${encodeURIComponent(
    `Hello RealAcademiQ, I want to track my order.\n\nOrder ID: ${orderId}\nTracking Token: ${token}\n\nPlease share my latest status and next step.`
  )}`

  const phases = [
    {
      icon: Clock,
      title: 'Order Initiation',
      description: 'Order details are received and logged by the support team.',
    },
    {
      icon: FileCheck2,
      title: 'Review & Confirmation',
      description: 'You share supporting files and reconfirm assignment details via WhatsApp.',
    },
    {
      icon: CreditCard,
      title: 'Payment Confirmation',
      description: 'You complete payment and send payment confirmation on WhatsApp.',
    },
    {
      icon: FileCheck2,
      title: 'Work in Progress',
      description: 'Your assigned expert starts and updates your work progress.',
    },
    {
      icon: Download,
      title: 'Delivery',
      description: 'Completed work is delivered and final support is provided if needed.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
      <div className="bg-gradient-to-r from-black to-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Track Your Order via WhatsApp</h1>
          <p className="text-slate-300 mt-2">Fast support updates from our team with no manual Order ID entry.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl shadow-black/30">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Track Your Order via WhatsApp</h2>
          <p className="text-slate-600 mb-6">
            Click the button below and share your name, assignment topic, payment screenshot, or any order details.
            Our team will verify and send your current order status.
          </p>

          <a href={whatsappTrackLink} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              <MessageSquare className="w-4 h-4 mr-2" />
              Track Your Order via WhatsApp
            </Button>
          </a>

          <p className="text-xs text-white/60 mt-4">
            Support is available 24/7. You can also share files and payment confirmation in the same chat.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl shadow-black/30">
          <h3 className="text-xl font-bold text-slate-900 mb-6">How Your Order Progresses</h3>
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.title} className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-400/30 flex items-center justify-center shrink-0">
                  <phase.icon className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{phase.title}</h4>
                  <p className="text-sm text-slate-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-black to-neutral-900 text-white rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Need Quick Help?</h3>
              <p className="text-slate-300 mb-4">
                Use WhatsApp for order updates, payment confirmation, and file sharing in one place.
              </p>
              <a href={whatsappTrackLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Open WhatsApp Support
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

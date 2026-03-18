'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare, CheckCircle, Clock, CreditCard, FileCheck2, Download } from 'lucide-react'

export default function TrackOrder() {
  const whatsappTrackLink =
    'https://wa.me/254101582198?text=Hello%20RealAcademiQ%2C%20I%20want%20to%20track%20my%20order.%20I%20am%20sharing%20my%20order%20details%20here.'

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
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
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
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

          <p className="text-xs text-slate-500 mt-4">
            Support is available 24/7. You can also share files and payment confirmation in the same chat.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">How Your Order Progresses</h3>
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.title} className="flex items-start gap-4 rounded-lg border border-slate-100 p-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <phase.icon className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{phase.title}</h4>
                  <p className="text-sm text-slate-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Need Quick Help?</h3>
              <p className="text-slate-300 mb-4">
                Use WhatsApp for order updates, payment confirmation, and file sharing in one place.
              </p>
              <a href={whatsappTrackLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
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

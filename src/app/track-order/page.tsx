'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare, CheckCircle, Clock, CreditCard, FileCheck2, Download } from 'lucide-react'

type PublicAdminReply = {
  id: string
  adminName: string
  message: string
  createdAt: string
}

type PublicTrackedOrder = {
  id: string
  serviceType: string
  deadline: string
  status: string
  paymentStatus: string
  currentPhase: number
  phases: Array<{
    phase: number
    name: string
    completed: boolean
    completedAt?: string
    description: string
  }>
  adminReplies?: PublicAdminReply[]
  createdAt: string
  updatedAt: string
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('-')
  const [token, setToken] = useState('-')
  const [trackedOrder, setTrackedOrder] = useState<PublicTrackedOrder | null>(null)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [trackError, setTrackError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId')?.trim() || '-')
    setToken(params.get('token')?.trim() || '-')
  }, [])

  useEffect(() => {
    if (!orderId || orderId === '-' || !token || token === '-') return

    let active = true
    setLoadingOrder(true)
    setTrackError('')

    fetch(`/api/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Unable to load order status')
        }
        return response.json()
      })
      .then((data) => {
        if (active) {
          setTrackedOrder(data.order || null)
        }
      })
      .catch((error: Error) => {
        if (active) {
          setTrackError(error.message)
          setTrackedOrder(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoadingOrder(false)
        }
      })

    return () => {
      active = false
    }
  }, [orderId, token])

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/70 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-emerald-100 mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Track Your Order via WhatsApp</h1>
          <p className="text-slate-200 mt-2">Fast support updates from our team with no manual Order ID entry.</p>
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

          <p className="text-xs text-slate-500 mt-4">
            Support is available 24/7. You can also share files and payment confirmation in the same chat.
          </p>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Live Order Status</h4>
            {loadingOrder && <p className="text-sm text-slate-600">Loading order status...</p>}
            {!loadingOrder && trackError && <p className="text-sm text-red-600">{trackError}</p>}
            {!loadingOrder && !trackError && trackedOrder && (
              <div className="space-y-1 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Order:</span> {trackedOrder.id}</p>
                <p><span className="font-semibold text-slate-900">Service:</span> {trackedOrder.serviceType}</p>
                <p><span className="font-semibold text-slate-900">Status:</span> {trackedOrder.status.replace(/_/g, ' ')}</p>
                <p><span className="font-semibold text-slate-900">Payment:</span> {trackedOrder.paymentStatus}</p>
                <p><span className="font-semibold text-slate-900">Updated:</span> {new Date(trackedOrder.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl shadow-black/30">
          <h3 className="text-xl font-bold text-slate-900 mb-6">How Your Order Progresses</h3>
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.title} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                  <phase.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{phase.title}</h4>
                  <p className="text-sm text-slate-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {trackedOrder && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl shadow-black/30">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Replies From Admin</h3>
            {(trackedOrder.adminReplies || []).length === 0 ? (
              <p className="text-slate-600">No admin replies yet. We will update you shortly.</p>
            ) : (
              <div className="space-y-3">
                {trackedOrder.adminReplies?.map((reply) => (
                  <div key={reply.id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-900">{reply.adminName}</p>
                    <p className="text-sm text-emerald-800 mt-1">{reply.message}</p>
                    <p className="text-xs text-emerald-700 mt-2">{new Date(reply.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-r from-white to-slate-100 text-slate-900 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Need Quick Help?</h3>
              <p className="text-slate-600 mb-4">
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

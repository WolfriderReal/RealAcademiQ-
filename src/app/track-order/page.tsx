'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  FileUp,
  Download,
  AlertCircle,
  Loader,
  Eye,
  MessageSquare,
} from 'lucide-react'

interface OrderProgress {
  id: string
  customerName: string
  topic: string
  serviceType: string
  status: string
  createdAt: string
  deadline: string
  totalPrice: number
  totalPaid: number
  paymentStatus: string
  currentPhase: number
  phases: Array<{
    phase: number
    name: string
    completed: boolean
    completedAt?: string
    description: string
  }>
  notes?: string
  downloadLink?: string
  previewLink?: string
}

export default function TrackOrder() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const [inputOrderId, setInputOrderId] = useState(orderId)
  const [order, setOrder] = useState<OrderProgress | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const statusColors: Record<string, string> = {
    pending_review: 'bg-yellow-50 border-yellow-200',
    reviewed_awaiting_payment: 'bg-orange-50 border-orange-200',
    payment_confirmation: 'bg-blue-50 border-blue-200',
    work_in_progress: 'bg-purple-50 border-purple-200',
    completed_ready_to_download: 'bg-green-50 border-green-200',
  }

  const statusIcons: Record<string, any> = {
    pending_review: <Clock className="w-5 h-5" />,
    reviewed_awaiting_payment: <CreditCard className="w-5 h-5" />,
    payment_confirmation: <CheckCircle className="w-5 h-5" />,
    work_in_progress: <Loader className="w-5 h-5 animate-spin" />,
    completed_ready_to_download: <Download className="w-5 h-5" />,
  }

  const searchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputOrderId.trim()) {
      setError('Please enter an Order ID')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(inputOrderId)}`)
      if (!response.ok) {
        throw new Error('Order not found. Please check your Order ID.')
      }
      const data = await response.json()
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Track Your Order</h1>
          <p className="text-slate-300 mt-2">Monitor your academic project progress in real-time</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Enter Your Order ID</h2>

          <form onSubmit={searchOrder} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="e.g., ORD-20250317-ABC123"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  Search Order
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-slate-500 mt-4">
            💡 You received your Order ID in the confirmation email and order success page
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
              <p className="text-sm text-red-800 mt-1">Please check your Order ID and try again.</p>
            </div>
          </div>
        )}

        {/* Order Details - When Found */}
        {order && (
          <div className="space-y-8">
            {/* Order Header Card */}
            <div className={`rounded-2xl border-2 p-8 ${statusColors[order.status]}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Order ID</p>
                  <p className="text-2xl font-bold text-slate-900 font-mono">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Current Status</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{statusIcons[order.status]}</span>
                    <p className="text-lg font-semibold text-slate-900 capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Topic</p>
                  <p className="text-slate-900 font-semibold">{order.topic}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Deadline</p>
                  <p className="text-slate-900 font-semibold">{new Date(order.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Order Progress Timeline</h3>

              <div className="space-y-6">
                {order.phases.map((phase, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline Line */}
                    {idx < order.phases.length - 1 && (
                      <div
                        className={`absolute left-6 top-16 w-1 h-12 ${
                          phase.completed ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                      />
                    )}

                    {/* Phase Card */}
                    <div className="flex gap-4">
                      {/* Circle Icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white ${
                          phase.completed
                            ? 'bg-green-600'
                            : order.currentPhase === phase.phase
                            ? 'bg-amber-600 animate-pulse'
                            : 'bg-slate-300'
                        }`}
                      >
                        {phase.completed ? <CheckCircle className="w-6 h-6" /> : phase.phase}
                      </div>

                      {/* Phase Details */}
                      <div className="flex-1 pt-1">
                        <h4 className="text-lg font-semibold text-slate-900 mb-1">{phase.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{phase.description}</p>
                        {phase.completed && phase.completedAt && (
                          <p className="text-xs text-green-700 font-medium">
                            ✓ Completed on {new Date(phase.completedAt).toLocaleDateString()}
                          </p>
                        )}
                        {order.currentPhase === phase.phase && !phase.completed && (
                          <p className="text-xs text-amber-700 font-medium">⏱️ Currently in progress</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Payment Status</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">${order.totalPaid.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2">Remaining Balance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${(order.totalPrice - order.totalPaid).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Payment Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Payment Progress</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {Math.round((order.totalPaid / order.totalPrice) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-green-500 h-full transition-all duration-300"
                    style={{ width: `${(order.totalPaid / order.totalPrice) * 100}%` }}
                  />
                </div>
              </div>

              {/* Payment Status Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'partial'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  Payment {order.paymentStatus}
                </div>
              </div>

              {order.totalPaid < order.totalPrice && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-900 mb-3">
                    💡 You still have a balance due. Complete payment to unlock your final deliverable.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Complete Payment
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Deliverables Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Your Deliverables</h3>

              {order.status === 'completed_ready_to_download' ? (
                <div className="space-y-4">
                  {order.downloadLink && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Download className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1">Final Document Ready</h4>
                          <p className="text-sm text-green-700 mb-4">
                            Your completed work is ready for download.
                          </p>
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            Download Document
                            <Download className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.previewLink && (
                    <Button variant="outline" className="w-full border-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Document
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">Your deliverables will appear here once work is complete</p>
                  <p className="text-sm text-slate-500">Current phase: {order.currentPhase}/5</p>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {order.notes && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Writer's Notes</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-slate-700">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Support Contact */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Need Assistance?</h3>
                  <p className="text-slate-300 mb-4">
                    Have questions about your order? Our support team is available 24/7.
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    Contact Support
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - When No Search Performed */}
        {!searched && !order && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Track Your Order?</h3>
            <p className="text-slate-600">Enter your Order ID above to see real-time progress updates</p>
          </div>
        )}
      </div>
    </div>
  )
}

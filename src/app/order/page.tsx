'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, AlertCircle, Loader, CreditCard, Smartphone } from 'lucide-react'

const OrderForm = () => {
  const [usdToKes, setUsdToKes] = useState(130)

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
      .then(res => res.json())
      .then(data => {
        if (data?.usd?.kes) setUsdToKes(Math.round(data.usd.kes))
      })
      .catch(() => {/* use fallback rate */})
  }, [])

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: 'small_assignment',
    topic: '',
    description: '',
    pageCount: 5,
    deadline: '',
    formatStyle: 'APA',
    estimatedPrice: 0,
  })

  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [trackingToken, setTrackingToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Payment state
  const [selectedPayment, setSelectedPayment] = useState<'paypal' | 'mpesa' | 'manual' | null>(null)
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [stkSent, setStkSent] = useState(false)
  const [paypalAmount, setPaypalAmount] = useState('')
  const [mpesaAmount, setMpesaAmount] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const serviceLabels: Record<string, string> = {
    small_assignment: 'Small Assignments',
    diploma_project: 'Diploma Projects',
    undergraduate_project: 'Undergraduate Projects',
    masters_thesis: "Master's Thesis",
    phd_dissertation: 'PhD Dissertation',
    proposal_concept_note: 'Proposal / Concept Note',
    data_analysis: 'Data Analysis (SPSS, Stata, etc.)',
    editing_proofreading: 'Editing & Proofreading',
  }

  const toKes = (usd: number) => Math.round(usd * usdToKes)
  const formatDualAmount = (usd: number) => `$${usd.toFixed(2)} / KES ${toKes(usd).toLocaleString()}`

  const customerName = formData.customerName?.trim() || '-'
  const customerEmail = formData.customerEmail?.trim() || '-'
  const whatsappLink = `https://wa.me/254101582198?text=${encodeURIComponent(
    `Hello RealAcademiQ, I need help with my order.\nName: ${customerName}\nEmail: ${customerEmail}`
  )}`
  const whatsappFilesLink = `https://wa.me/254101582198?text=${encodeURIComponent(
    `Hello RealAcademiQ, I am sharing my order details:\n\nName: ${customerName}\nEmail: ${customerEmail}\nOrder ID: ${orderId || '-'}\nTracking Token: ${trackingToken || '-'}\nTopic: ${formData.topic || '-'}\nDeadline: ${formData.deadline || '-'}\nPages/Length: ${formData.pageCount || '-'}\nFormat Style: ${formData.formatStyle || '-'}\nDetailed Description: ${formData.description || '-'}\n\nI am also ready to share supporting files via WhatsApp.`
  )}`

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'pageCount' || name === 'estimatedPrice') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order. Please verify your details and try again.')
      }

      setOrderId(data.orderId)
      setTrackingToken(data.trackingToken ?? null)
      setMpesaPhone(formData.customerPhone)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePaypalPay = () => {
    if (!orderId) return
    const normalizedAmount = Number(paypalAmount || formData.estimatedPrice)

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setPaymentError('Please enter a valid PayPal amount confirmed on WhatsApp.')
      return
    }

    // Direct PayPal hosted checkout – no API credentials needed
    const params = new URLSearchParams({
      cmd: '_xclick',
      business: 'kstrategic_inc@outlook.com',
      item_name: `RealAcademiQ Order ${orderId}`,
      item_number: orderId,
      amount: normalizedAmount.toFixed(2),
      currency_code: 'USD',
      return: `${window.location.origin}/track-order?orderId=${orderId}&token=${encodeURIComponent(trackingToken || '')}`,
      cancel_return: `${window.location.origin}/order`,
      no_shipping: '1',
    })
    window.location.href = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`
  }

  const handleMpesaSTK = async () => {
    if (!orderId) return
    if (!mpesaPhone.trim()) {
      setPaymentError('Please enter your M-Pesa phone number.')
      return
    }

    const normalizedAmount = Number(mpesaAmount || toKes(formData.estimatedPrice))
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setPaymentError('Please enter a valid M-Pesa amount confirmed on WhatsApp.')
      return
    }

    setPaymentLoading(true)
    setPaymentError(null)
    try {
      const response = await fetch('/api/payments/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: orderId,
          amount: normalizedAmount,
          phoneNumber: mpesaPhone.trim(),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'STK push failed')
      setStkSent(true)
    } catch (err: any) {
      setPaymentError(err.message)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleManualConfirm = () => {
    setSubmitted(true)
  }

  const handleManualConfirmWithWhatsapp = () => {
    const normalizedAmount = Number(mpesaAmount || toKes(formData.estimatedPrice))
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setPaymentError('Please enter a valid M-Pesa amount confirmed on WhatsApp.')
      return
    }

    const approxUsd = normalizedAmount / usdToKes

    const whatsappPaymentNotifyLink = `https://wa.me/254101582198?text=${encodeURIComponent(
      `Hello RealAcademiQ, I have sent payment and need confirmation.\n\nName: ${customerName}\nEmail: ${customerEmail}\nOrder ID: ${orderId || '-'}\nTracking Token: ${trackingToken || '-'}\nAmount: KES ${Math.round(normalizedAmount).toLocaleString()} (Approx USD ${approxUsd.toFixed(2)})\nMethod: M-Pesa Paybill\n\nPlease confirm so I can continue tracking my order.`
    )}`

    window.open(whatsappPaymentNotifyLink, '_blank', 'noopener,noreferrer')
    handleManualConfirm()
  }

  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1600)
    } catch {
      setPaymentError('Unable to copy value. Please copy manually.')
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
          <h1 className="text-4xl md:text-5xl font-bold">Submit Your Order</h1>
          <p className="text-slate-300 mt-2">Fast-track your academic success with our professional assistance</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`h-1 flex-1 mx-2 transition-all ${step > s ? 'bg-amber-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Order Details</span>
            <span>Review & Confirm</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Step 1: Order Details */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tell us about your order</h2>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Service</h3>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
              >
                <option value="small_assignment">Small Assignments</option>
                <option value="diploma_project">Diploma Projects</option>
                <option value="undergraduate_project">Undergraduate Projects</option>
                <option value="masters_thesis">Master&apos;s Thesis</option>
                <option value="phd_dissertation">PhD Dissertation</option>
                <option value="proposal_concept_note">Proposal / Concept Note</option>
                <option value="data_analysis">Data Analysis (SPSS, Stata, etc.)</option>
                <option value="editing_proofreading">Editing &amp; Proofreading</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Pricing is confirmed on WhatsApp after requirement review.
              </p>
            </div>

            {/* Order Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Topic *</label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                    placeholder="Enter your topic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pages/Length</label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Format Style</label>
                  <select
                    name="formatStyle"
                    value={formData.formatStyle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                  >
                    <option>APA</option>
                    <option>MLA</option>
                    <option>Chicago</option>
                    <option>Harvard</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Proposed Price (USD - International) *</label>
                  <input
                    type="number"
                    name="estimatedPrice"
                    value={formData.estimatedPrice}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                    placeholder="Enter your proposed budget"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    You can enter your preferred international amount now. Final price will be confirmed by our team after review.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Local payments (M-Pesa) use KES equivalent: KES {toKes(formData.estimatedPrice).toLocaleString()} (Approx).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Detailed Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition resize-none"
                  placeholder="Provide detailed instructions about your order..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold"
              >
                Continue to Review <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Review & Pricing */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Your Order</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-700">Service Type:</span>
                  <span className="font-semibold text-slate-900">{serviceLabels[formData.serviceType] ?? formData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Topic:</span>
                  <span className="font-semibold text-slate-900">{formData.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Pages/Length:</span>
                  <span className="font-semibold text-slate-900">{formData.pageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Deadline:</span>
                  <span className="font-semibold text-slate-900">{new Date(formData.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Format:</span>
                  <span className="font-semibold text-slate-900">{formData.formatStyle}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-slate-50 rounded-lg p-5 mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-slate-700">Your Proposed Price (to be confirmed after sharing requirements via WhatsApp):</span>
                  <span className="text-slate-900">{formatDualAmount(formData.estimatedPrice)}</span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-slate-200">
                  <span className="text-slate-700">Final Price Confirmation:</span>
                  <span className="text-slate-900">Pending Team Review (To be confirmed on WhatsApp)</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900">Amount shown for payment prompt:</span>
                  <span className="text-amber-600">{formatDualAmount(formData.estimatedPrice)}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  📝 Final pricing is confirmed after you share requirements via WhatsApp and our team reviews them.
                </p>
              </div>

              {/* Share files/instructions via WhatsApp before payment */}
              <div className="border border-slate-200 rounded-lg p-5 mb-6">
                <a href={whatsappFilesLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                    Share Supporting Files via WhatsApp
                  </Button>
                </a>
                <p className="text-xs text-slate-500 mt-2">
                  Send supporting files and reconfirm your assignment description through WhatsApp.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 py-3 border-2"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit as any}
                  disabled={loading}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  {loading ? (
                    <><Loader className="w-4 h-4 mr-2 animate-spin" />Creating Order...</>
                  ) : (
                    <>Continue to Payment <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && !submitted && orderId && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h2>

            {/* Order ID Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 mb-6 flex items-center justify-between">
              <span className="text-sm text-slate-700">Your Order ID:</span>
              <span className="font-mono font-bold text-amber-700 text-lg">{orderId}</span>
            </div>

            {/* Amount */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 mb-8 border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-700 mb-1">Amount Due</p>
                  <p className="text-3xl font-bold text-amber-600">${formData.estimatedPrice.toFixed(2)} USD</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">KES {toKes(formData.estimatedPrice).toLocaleString()} (Local equivalent)</p>
                </div>
                <p className="text-xs text-slate-500">Final price confirmed on WhatsApp after team review</p>
              </div>
            </div>

            {/* Payment Error */}
            {paymentError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-800">{paymentError}</span>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* PayPal */}
              <button
                onClick={() => { setSelectedPayment('paypal'); setPaymentError(null); setStkSent(false) }}
                className={`text-left border-2 rounded-xl p-5 transition ${
                  selectedPayment === 'paypal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900">PayPal</h3>
                <p className="text-xs text-slate-500 mt-1">Pay online, international cards</p>
              </button>

              {/* M-Pesa STK */}
              <button
                onClick={() => { setSelectedPayment('mpesa'); setPaymentError(null); setStkSent(false) }}
                className={`text-left border-2 rounded-xl p-5 transition ${
                  selectedPayment === 'mpesa'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-900">M-Pesa STK Push</h3>
                <p className="text-xs text-slate-500 mt-1">Get a prompt on your phone</p>
              </button>

              {/* Manual Paybill */}
              <button
                onClick={() => { setSelectedPayment('manual'); setPaymentError(null); setStkSent(false) }}
                className={`text-left border-2 rounded-xl p-5 transition ${
                  selectedPayment === 'manual'
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-green-300'
                }`}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-green-700 font-bold text-sm">M</span>
                </div>
                <h3 className="font-bold text-slate-900">M-Pesa Manual</h3>
                <p className="text-xs text-slate-500 mt-1">Pay via Paybill & confirm</p>
              </button>
            </div>

            {/* PayPal Panel */}
            {selectedPayment === 'paypal' && (
              <div className="border-2 border-blue-200 rounded-xl p-6 mb-6 bg-blue-50">
                <h3 className="font-bold text-blue-900 mb-2">Pay with PayPal</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Enter the final amount confirmed on WhatsApp, then continue to secure PayPal checkout.
                </p>
                <label className="block text-sm font-medium text-blue-900 mb-2">Final Amount (USD - International)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={paypalAmount}
                  onChange={(e) => setPaypalAmount(e.target.value)}
                  placeholder={formData.estimatedPrice.toFixed(2)}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4 bg-white"
                />
                <p className="text-xs text-blue-800 mb-4">
                  Equivalent local amount: KES {toKes(Number(paypalAmount || formData.estimatedPrice)).toLocaleString()} (Approx)
                </p>
                <Button
                  onClick={handlePaypalPay}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
                >
                  Continue to PayPal <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {/* M-Pesa STK Panel */}
            {selectedPayment === 'mpesa' && (
              <div className="border-2 border-orange-200 rounded-xl p-6 mb-6 bg-orange-50">
                <h3 className="font-bold text-orange-900 mb-2">M-Pesa STK Push</h3>
                {stkSent ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="font-bold text-green-800 text-lg">STK Prompt Sent!</p>
                    <p className="text-sm text-slate-700 mt-1">
                      Check your phone <strong>{mpesaPhone}</strong> for the M-Pesa payment prompt.
                      Enter your M-Pesa PIN to complete payment. (Don&apos;t close this page)
                    </p>
                    <p className="text-xs text-slate-500 mt-3">After paying, click below to track your order.</p>
                    <Button
                      onClick={() => setSubmitted(true)}
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-8"
                    >
                      I&apos;ve Completed Payment &rarr; Track Order
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-orange-800 mb-4">
                      A payment prompt will be sent to your Safaricom number. Enter your PIN when prompted.
                    </p>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Final Amount (KES - Local)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={mpesaAmount}
                      onChange={(e) => setMpesaAmount(e.target.value)}
                      placeholder={String(toKes(formData.estimatedPrice))}
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none mb-4 bg-white"
                    />
                    <p className="text-xs text-orange-800 mb-3">
                      Approx international amount: USD {(Number(mpesaAmount || toKes(formData.estimatedPrice)) / usdToKes).toFixed(2)}
                    </p>
                    <label className="block text-sm font-medium text-slate-700 mb-2">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="07XXXXXXXX or 2547XXXXXXXX"
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none mb-4 bg-white"
                    />
                    <Button
                      onClick={handleMpesaSTK}
                      disabled={paymentLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 font-semibold"
                    >
                      {paymentLoading ? (
                        <><Loader className="w-4 h-4 mr-2 animate-spin" />Sending STK Prompt...</>
                      ) : (
                        <><Smartphone className="w-4 h-4 mr-2" />Send M-Pesa Prompt to My Phone</>
                      )}
                    </Button>
                    {/* Always show manual paybill as backup */}
                    <div className="mt-5 pt-5 border-t border-orange-200">
                      <p className="text-xs font-semibold text-orange-900 mb-3">Or pay manually via Paybill:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Business No.</p>
                          <p className="font-bold text-slate-900">714777</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2 h-8 text-xs border-orange-300 text-orange-700"
                            onClick={() => copyToClipboard('714777', 'paybill')}
                          >
                            {copiedField === 'paybill' ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Account No.</p>
                          <p className="font-bold text-slate-900">440005939461</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2 h-8 text-xs border-orange-300 text-orange-700"
                            onClick={() => copyToClipboard('440005939461', 'account')}
                          >
                            {copiedField === 'account' ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={handleManualConfirm}
                        variant="outline"
                        className="w-full mt-3 border-orange-400 text-orange-700"
                      >
                        I&apos;ve Paid via Paybill &rarr; Track Order
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Manual Paybill Panel */}
            {selectedPayment === 'manual' && (
              <div className="border-2 border-green-200 rounded-xl p-6 mb-6 bg-green-50">
                <h3 className="font-bold text-green-900 mb-4">Pay via M-Pesa Paybill</h3>
                <label className="block text-sm font-medium text-slate-700 mb-2">Final Amount (KES - Local)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={mpesaAmount}
                  onChange={(e) => setMpesaAmount(e.target.value)}
                  placeholder={String(toKes(formData.estimatedPrice))}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none mb-4 bg-white"
                />
                <p className="text-xs text-green-900 mb-4">
                  Approx international amount: USD {(Number(mpesaAmount || toKes(formData.estimatedPrice)) / usdToKes).toFixed(2)}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-600 mb-1">Business Number</p>
                    <p className="text-xl font-bold text-slate-900">714777</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 h-8 text-xs border-green-300 text-green-700"
                      onClick={() => copyToClipboard('714777', 'paybill')}
                    >
                      {copiedField === 'paybill' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-600 mb-1">Account Number</p>
                    <p className="text-xl font-bold text-slate-900">440005939461</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 h-8 text-xs border-green-300 text-green-700"
                      onClick={() => copyToClipboard('440005939461', 'account')}
                    >
                      {copiedField === 'account' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-600 mb-1">Amount</p>
                    <p className="text-xl font-bold text-amber-700">
                      KES {Math.round(Number(mpesaAmount || toKes(formData.estimatedPrice))).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ~ USD {(Number(mpesaAmount || toKes(formData.estimatedPrice)) / usdToKes).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-600 mb-1">Your Order ID</p>
                    <p className="text-sm font-bold text-amber-700 font-mono">{orderId}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill &rarr; enter details above</p>
                <Button
                  onClick={handleManualConfirmWithWhatsapp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I&apos;ve Sent the Payment → Track My Order
                </Button>
              </div>
            )}

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                🔒 <strong>Safe & Secure:</strong> Your information is encrypted and secure.
              </p>
            </div>
          </div>
        )}

        {/* Order Confirmation (after manual/STK confirm) */}
        {submitted && orderId && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Submitted!</h2>
            <p className="text-slate-600 mb-6">Your order has been created successfully.</p>

            {/* Order ID */}
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-slate-700 mb-2">Your Order ID</p>
              <p className="text-2xl font-bold text-amber-600 font-mono">{orderId}</p>
              {trackingToken && (
                <>
                  <p className="text-sm text-slate-700 mt-3 mb-1">Tracking Token</p>
                  <p className="text-sm font-semibold text-slate-900 font-mono break-all">{trackingToken}</p>
                </>
              )}
              <p className="text-xs text-slate-600 mt-2">Save this ID to track your order</p>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
              <ol className="space-y-2 text-sm text-blue-900">
                <li>1️⃣ Complete your payment using your preferred method</li>
                <li>2️⃣ Our team will review your order details (24-48 hours)</li>
                <li>3️⃣ An assigned writer will begin work on your project</li>
                <li>4️⃣ Track your progress anytime using your Order ID</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/track-order?orderId=${orderId}&token=${encodeURIComponent(trackingToken || '')}`}>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                  Track Your Order
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="px-8 py-3">
                  Return Home
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-8 py-3">
                  WhatsApp Support
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderForm

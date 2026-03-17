'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileUp, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const OrderForm = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: 'assignment',
    topic: '',
    description: '',
    pageCount: 5,
    deadline: '',
    formatStyle: 'APA',
    estimatedPrice: 50,
  })
  
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const servicePricing: Record<string, number> = {
    assignment: 15,
    thesis: 50,
    project: 30,
    proposal: 100,
  }
  const suggestedPrice = formData.pageCount * (servicePricing[formData.serviceType] || 0)
  const whatsappLink = 'https://wa.me/254101582198?text=Hello%20RealAcademiQ%2C%20I%20need%20help%20with%20my%20order.'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'pageCount' || name === 'estimatedPrice') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
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

      if (!response.ok) throw new Error('Failed to create order')

      const data = await response.json()
      setOrderId(data.orderId)
      setSubmitted(true)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number (M-Pesa) *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                    placeholder="0712345678"
                  />
                  <p className="text-xs text-slate-500 mt-1">For M-Pesa payments, use format: 07XXXXXXXX</p>
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
                <option value="assignment">Assignment Help - $15/page</option>
                <option value="thesis">Thesis Writing - $50/page</option>
                <option value="project">Project Development - $30/hour (estimate)</option>
                <option value="proposal">Research Proposal - $100</option>
              </select>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Proposed Price (USD) *</label>
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
                    You can enter your preferred amount now. Final price will be confirmed by our team after review.
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Suggested from selected service and pages: ${suggestedPrice.toFixed(2)}
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

            {/* File Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Supporting Documents</h3>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-amber-600 transition">
                <FileUp className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500">PDF, DOCX, or images (max 10MB each)</p>
                </label>
                {files.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-slate-700 mb-2">Uploaded files:</p>
                    {files.map((file, idx) => (
                      <p key={idx} className="text-sm text-slate-600">✓ {file.name}</p>
                    ))}
                  </div>
                )}
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
                  <span className="font-semibold text-slate-900 capitalize">{formData.serviceType}</span>
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
                  <span className="text-slate-700">Your Proposed Price:</span>
                  <span className="text-slate-900">${formData.estimatedPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-slate-200">
                  <span className="text-slate-700">Final Price Confirmation:</span>
                  <span className="text-slate-900">Pending Team Review</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900">Amount shown for payment prompt:</span>
                  <span className="text-amber-600">${formData.estimatedPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  📝 Final pricing is confirmed after review. The amount above is your proposed price for faster order processing.
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
                  onClick={() => setStep(3)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  Continue to Payment Options <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Options */}
        {step === 3 && !submitted && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Payment Method</h2>
            <p className="text-sm text-slate-600 mb-6">
              Payment prompt uses your proposed price and will be finalized after our confirmation.
            </p>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 mb-8 border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-700 mb-1">Proposed Amount</p>
                  <p className="text-3xl font-bold text-amber-600">${formData.estimatedPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">USD</p>
                </div>
              </div>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* PayPal Option */}
              <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">P</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">PayPal</h3>
                    <p className="text-xs text-slate-600">Secure payment</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-700 mb-4">
                  <li>✓ Instant confirmation</li>
                  <li>✓ International support</li>
                  <li>✓ Buyer protection</li>
                </ul>
              </div>

              {/* M-Pesa STK Push */}
              <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-orange-400 hover:bg-orange-50 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-600">M</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">M-Pesa STK</h3>
                    <p className="text-xs text-slate-600">Quick & Simple</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-700 mb-4">
                  <li>✓ Instant phone prompt</li>
                  <li>✓ Kenya-based</li>
                  <li>✓ Fast payment</li>
                </ul>
              </div>
            </div>

            {/* M-Pesa Paybill Manual Option */}
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-slate-900 mb-4">M-Pesa Manual Paybill (Alternative)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-slate-600 mb-2">Business Number</p>
                  <p className="text-lg font-bold text-slate-900">714777</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-slate-600 mb-2">Account Number</p>
                  <p className="text-lg font-bold text-slate-900">440005939461</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-slate-600 mb-2">Amount</p>
                  <p className="text-lg font-bold text-slate-900">${formData.estimatedPrice.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-slate-600 mb-2">Reference</p>
                  <p className="text-lg font-bold text-amber-600">Your Email</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-4">Send payment, then confirm your order below</p>
            </div>

            {/* Submit Order */}
            <div className="space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    Complete Order & Get Order ID
                    <CheckCircle className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="w-full py-3"
              >
                Back
              </Button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg border border-green-300 text-green-700 text-center font-medium hover:bg-green-50 transition"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                🔒 <strong>Safe & Secure:</strong> Your information is encrypted and secure. We never share your data.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Order Confirmation */}
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
              <Link href={`/track-order?orderId=${orderId}`}>
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

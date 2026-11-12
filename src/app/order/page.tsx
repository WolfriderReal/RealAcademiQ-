'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, AlertCircle, Loader, Smartphone } from 'lucide-react'
import { trackClientEvent } from '@/lib/telemetry'

const WHATSAPP_NUMBER = '254101582198'
const PAYBILL_NUMBER = '714777'
const PAYBILL_ACCOUNT = '440005939461'

export default function OrderForm() {
  const [usdToKes, setUsdToKes] = useState(130)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: 'editing_proofreading',
    topic: '',
    description: '',
    pageCount: 5,
    deadline: '',
    formatStyle: 'APA',
    estimatedPrice: 1,
  })
  const [step, setStep] = useState(1)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [trackingToken, setTrackingToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [mpesaAmount, setMpesaAmount] = useState('')
  const [stkSent, setStkSent] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    void trackClientEvent('order_page_viewed')
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
      .then((response) => response.json())
      .then((data) => {
        if (data?.usd?.kes) setUsdToKes(Math.round(data.usd.kes))
      })
      .catch(() => undefined)
  }, [])

  const toKes = (usd: number) => Math.round(usd * usdToKes)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: name === 'pageCount' || name === 'estimatedPrice' ? Number(value) : value,
    }))
  }

  const createOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to create your order. Please try again.')
      setOrderId(data.orderId)
      setTrackingToken(data.trackingToken ?? null)
      setMpesaPhone(formData.customerPhone)
      setStep(2)
      void trackClientEvent('order_created', { orderId: data.orderId, serviceType: formData.serviceType })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'An error occurred while creating your order.')
    } finally {
      setLoading(false)
    }
  }

  const sendStkPrompt = async () => {
    if (!orderId) return
    if (!mpesaPhone.trim()) {
      setPaymentError('Enter the M-Pesa phone number to receive the payment prompt.')
      return
    }
    const amount = Number(mpesaAmount || toKes(formData.estimatedPrice))
    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError('Enter a valid KES amount confirmed with our team.')
      return
    }
    setPaymentLoading(true)
    setPaymentError(null)
    try {
      const response = await fetch('/api/payments/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: orderId, amount, phoneNumber: mpesaPhone.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send the M-Pesa prompt.')
      setStkSent(true)
      void trackClientEvent('mpesa_stk_prompt_sent', { orderId, amount })
    } catch (reason) {
      setPaymentError(reason instanceof Error ? reason.message : 'Unable to send the M-Pesa prompt.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const openPaymentWhatsApp = () => {
    const amount = Number(mpesaAmount || toKes(formData.estimatedPrice))
    const message = `Hello RealAcademiQ, I have sent payment and need confirmation.\n\nName: ${formData.customerName}\nEmail: ${formData.customerEmail}\nOrder ID: ${orderId || '-'}\nAmount (KES): ${amount}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    void trackClientEvent('manual_payment_confirmed_via_whatsapp', { orderId, amount })
  }

  const copyValue = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(field)
      window.setTimeout(() => setCopied(null), 1500)
    } catch {
      setPaymentError('Could not copy. Please copy the number manually.')
    }
  }

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello RealAcademiQ, I need help with my order.\nName: ${formData.customerName}\nEmail: ${formData.customerEmail}`)}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="bg-gradient-to-r from-slate-950 via-emerald-950/70 to-black border-b border-emerald-900/40 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-emerald-100 mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Request Academic Support</h1>
          <p className="text-slate-200 mt-2">Share what you need help with and we’ll confirm the scope, timeline, and price.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 text-sm text-slate-600">
          <span className={step === 1 ? 'font-semibold text-orange-600' : ''}>1. Your request</span>
          <span className={step === 2 ? 'font-semibold text-orange-600' : ''}>2. M-Pesa payment</span>
        </div>

        {error && <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

        {step === 1 && (
          <form onSubmit={createOrder} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg space-y-7">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Tell us what support you need</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block text-sm font-medium text-slate-700">Full name *<input name="customerName" required value={formData.customerName} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" autoComplete="name" /></label>
                <label className="block text-sm font-medium text-slate-700">Email address *<input name="customerEmail" type="email" required value={formData.customerEmail} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" autoComplete="email" /></label>
                <label className="block text-sm font-medium text-slate-700">Phone number *<input name="customerPhone" type="tel" required value={formData.customerPhone} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="07XXXXXXXX" autoComplete="tel" /></label>
                <label className="block text-sm font-medium text-slate-700">Type of support *<select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"><option value="editing_proofreading">Editing & proofreading</option><option value="small_assignment">Tutoring & coursework coaching</option><option value="proposal_concept_note">Research guidance</option><option value="masters_thesis">Thesis writing support</option><option value="data_analysis">Data analysis guidance</option><option value="undergraduate_project">Project coaching</option></select></label>
                <label className="block text-sm font-medium text-slate-700">Topic or subject *<input name="topic" required value={formData.topic} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
                <label className="block text-sm font-medium text-slate-700">Deadline *<input name="deadline" type="date" required value={formData.deadline} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
                <label className="block text-sm font-medium text-slate-700">Pages or approximate length<input name="pageCount" type="number" min="1" value={formData.pageCount} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
                <label className="block text-sm font-medium text-slate-700">Citation style<select name="formatStyle" value={formData.formatStyle} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"><option>APA</option><option>MLA</option><option>Chicago</option><option>Harvard</option></select></label>
                <label className="block text-sm font-medium text-slate-700 md:col-span-2">Proposed budget (USD) *<input name="estimatedPrice" type="number" min="1" step="0.01" required value={formData.estimatedPrice} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /><span className="block text-xs text-slate-500 mt-1">Approximate local equivalent: KES {toKes(formData.estimatedPrice).toLocaleString()}. Final pricing is confirmed with you before payment.</span></label>
                <label className="block text-sm font-medium text-slate-700 md:col-span-2">Describe what you need help with *<textarea name="description" required rows={5} value={formData.description} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Tell us about your goals, instructions, and any areas where you would like guidance." /></label>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
              {loading ? <><Loader className="w-4 h-4 mr-2 animate-spin" />Submitting request...</> : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>
        )}

        {step === 2 && orderId && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-5"><Smartphone className="w-8 h-8 text-green-600" /><h2 className="text-2xl font-bold text-slate-900">Pay with M-Pesa</h2></div>
            <p className="text-slate-600 mb-6">Your request is recorded. Confirm the final amount with our team before making a payment.</p>
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 mb-6 flex justify-between gap-4">
              <span className="text-slate-700">Order ID</span><span className="font-mono font-bold text-orange-700">{orderId}</span>
            </div>
            {paymentError && <div role="alert" className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{paymentError}</div>}

            <div className="rounded-xl border border-orange-200 p-5 mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">M-Pesa STK Push</h3>
              {stkSent ? (
                <div role="status" className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-green-800">Payment prompt sent</p>
                  <p className="text-sm text-slate-600 mt-2">Follow the prompt on your phone. Contact support if it does not arrive.</p>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount in KES<input type="number" min="1" step="1" value={mpesaAmount} onChange={(event) => setMpesaAmount(event.target.value)} placeholder={String(toKes(formData.estimatedPrice))} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
                  <label className="block text-sm font-medium text-slate-700 mb-4">M-Pesa phone number<input type="tel" value={mpesaPhone} onChange={(event) => setMpesaPhone(event.target.value)} placeholder="07XXXXXXXX or 2547XXXXXXXX" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
                  <Button onClick={sendStkPrompt} disabled={paymentLoading} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    {paymentLoading ? <><Loader className="w-4 h-4 mr-2 animate-spin" />Sending prompt...</> : 'Send STK prompt'}
                  </Button>
                </>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Or pay manually via Paybill</h3>
              <p className="text-sm text-slate-600 mb-4">Use your order ID as the account reference and send payment confirmation to support.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ label: 'Business number', value: PAYBILL_NUMBER, key: 'business' }, { label: 'Account number', value: PAYBILL_ACCOUNT, key: 'account' }].map((item) => (
                  <div key={item.key} className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">{item.label}</p><p className="font-bold text-slate-900">{item.value}</p>
                    <Button type="button" variant="outline" className="mt-2 h-8 text-xs" onClick={() => void copyValue(item.value, item.key)}>{copied === item.key ? 'Copied' : 'Copy'}</Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" className="w-full mt-4" onClick={openPaymentWhatsApp}>Send payment confirmation on WhatsApp</Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1"><Button variant="outline" className="w-full">Contact us on WhatsApp</Button></a>
              <Link href={`/track-order?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(trackingToken || '')}`} className="flex-1"><Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Track request <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
            </div>
            <p className="text-xs text-slate-500 mt-5">Payments are confirmed by our team; a payment prompt or self-reported transfer is not confirmation by itself.</p>
          </div>
        )}
      </div>
    </div>
  )
}

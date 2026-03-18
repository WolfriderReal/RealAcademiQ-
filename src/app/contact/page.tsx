'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle2, Mail, Phone, Clock, MapPin } from 'lucide-react';
import { toast } from "sonner";

const contactInfo = [
  { icon: Mail, title: 'Email Us', detail: 'kstrategic_inc@outlook.com', sub: 'We respond within 2 hours' },
  { icon: Phone, title: 'Call Us', detail: '+254101582198', sub: 'Mon-Sat, 9am-9pm' },
  { icon: Clock, title: 'Working Hours', detail: '24/7 Availability', sub: 'We\'re always here for you' },
  { icon: MapPin, title: 'Location', detail: 'Available Worldwide', sub: 'Serving students globally' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error ?? 'Unable to send your message at this time.'
        throw new Error(message)
      }

      setSubmitted(true);
      toast.success('Message sent successfully!')
    } catch (error: any) {
      console.error('Contact form submission failed', error)
      toast.error(error?.message ?? 'Something went wrong, please try again.')
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div>
            <p className="text-amber-600 font-semibold text-sm tracking-wide uppercase mb-3">Contact Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you promptly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-slate-900 mb-8">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, i) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{item.title}</div>
                      <div className="text-slate-700 text-sm mt-0.5">{item.detail}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-center mb-6">We&apos;ll get back to you within 2 hours.</p>
                  <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} variant="outline" className="rounded-xl">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" required placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What&apos;s this about?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" required rows={5} placeholder="Tell us how we can help you..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="rounded-xl" />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-13 text-base font-medium">
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />Send Message</>}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
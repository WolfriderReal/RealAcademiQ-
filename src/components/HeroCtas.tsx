'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackClientEvent } from '@/lib/telemetry'

export default function HeroCtas() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/order"
        onClick={() => {
          void trackClientEvent('homepage_submit_order_clicked')
        }}
      >
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.35)]">
          Get Started <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Link>

      <Link
        href="/track-order"
        onClick={() => {
          void trackClientEvent('homepage_track_order_clicked')
        }}
      >
        <Button size="lg" variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl">
          Track Order
        </Button>
      </Link>
    </div>
  )
}

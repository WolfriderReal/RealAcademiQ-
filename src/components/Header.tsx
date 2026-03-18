'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { GraduationCap } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RealAcademiQ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
              Services
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900">
              Contact
            </Link>
          </nav>

          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => window.location.href = '/contact'}
          >
            Get Quote
          </Button>
        </div>
      </div>
    </header>
  )
}
import Link from 'next/link'
import TestimonialsAndSupport from '@/components/TestimonialsAndSupport'

export default function AdminTestimonialsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-end px-4">
        <Link
          href="/api/admin/logout"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          Logout
        </Link>
      </div>
      <TestimonialsAndSupport mode="admin" />
    </main>
  )
}
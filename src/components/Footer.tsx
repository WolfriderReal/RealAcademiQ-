import Link from 'next/link'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/refund-policy', label: 'Refund & cancellation' },
  { href: '/terms', label: 'Terms of service' },
  { href: '/privacy', label: 'Privacy policy' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-sm">© {new Date().getFullYear()} RealAcademiQ. All rights reserved.</p>
        <nav aria-label="Customer information" className="flex flex-wrap gap-x-5 gap-y-1 text-sm sm:gap-x-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="inline-flex min-h-10 items-center underline-offset-4 hover:text-white hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

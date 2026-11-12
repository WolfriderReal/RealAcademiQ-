import Link from 'next/link'

const links = [
  { href: '/services', label: 'Pricing & services' },
  { href: '/refund-policy', label: 'Refund & cancellation' },
  { href: '/terms', label: 'Terms of service' },
  { href: '/privacy', label: 'Privacy policy' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm">© {new Date().getFullYear()} RealAcademiQ. All rights reserved.</p>
        <nav aria-label="Customer information" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="underline-offset-4 hover:text-white hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

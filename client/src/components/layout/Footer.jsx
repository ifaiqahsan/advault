import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <footer className="print:hidden bg-navy-950 text-white/70">
      <div className="hatch" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 bg-brand-500 text-white font-heading text-xl font-extrabold">A</span>
            <span className="font-heading text-2xl font-bold text-white">AdVault</span>
          </Link>
          <p className="mt-4 text-sm max-w-xs">
            A self-serve portal where creators sell ad space directly to sponsors. No middlemen.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-brand-500 transition">About</Link></li>
            <li><Link to="/creators" className="hover:text-brand-500 transition">Browse Creators</Link></li>
            <li><Link to="/process" className="hover:text-brand-500 transition">How It Works</Link></li>
            <li><Link to="/pricing" className="hover:text-brand-500 transition">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-brand-500 transition">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Lahore, Pakistan</li>
            <li>support@advault.com</li>
            <li>Phone: (042) 61683419</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-4">Newsletter</h4>
          <form onSubmit={subscribe} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-navy-900 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-brand-500 transition"
            />
            <button className="bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-5 transition">
              Sign Up
            </button>
          </form>
          <p className={`mt-3 text-xs text-brand-500 transition-opacity duration-300 ${done ? 'opacity-100' : 'opacity-0'}`}>
            Thanks, you are subscribed.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 AdVault. Web Programming CS-7A university project.
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
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
            <li><Link to="/creators" className="hover:text-brand-500 transition">Browse Creators</Link></li>
            <li><Link to="/my-bookings" className="hover:text-brand-500 transition">My Bookings</Link></li>
            <li><Link to="/register" className="hover:text-brand-500 transition">Become a Creator</Link></li>
            <li><Link to="/login" className="hover:text-brand-500 transition">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Lahore, Pakistan</li>
            <li>support@advault.com</li>
            <li>Phone: (555) 010-0123</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-4">Newsletter</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-navy-900 px-4 py-3 text-sm text-white placeholder-white/40 outline-none"
            />
            <button className="bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-5 transition">
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 AdVault. Web Programming CS-7A university project.
      </div>
    </footer>
  )
}
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Links based on the project's features
const links = [
  { to: '/', label: 'Home' },
  { to: '/creators', label: 'Browse Creators' },
  { to: '/#how-it-works', label: 'How It Works', anchor: true },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/creator/dashboard', label: 'For Creators' },
]

const desktopClass = ({ isActive }) =>
  `text-[15px] font-medium transition ${
    isActive ? 'text-brand-500' : 'text-white hover:text-brand-500'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-navy-900 sticky top-0 z-40 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 bg-brand-500 text-white font-heading text-2xl font-extrabold">
            A
          </span>
          <span className="font-heading text-3xl font-bold normal-case tracking-wide text-white">
            ADVAULT
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) =>
            l.anchor ? (
              <Link
                key={l.to}
                to={l.to}
                className="text-[15px] font-medium text-white hover:text-brand-500 transition"
              >
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={desktopClass}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-5">
          <Link to="/login" className="text-[15px] font-medium text-white hover:text-brand-500 transition">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider text-lg px-7 py-3 rounded-sm transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white"
          aria-label="Toggle menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-950 border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-white hover:text-brand-500"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="text-white hover:text-brand-500">
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="bg-brand-600 text-white text-center font-heading uppercase tracking-wider text-lg px-6 py-3"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}
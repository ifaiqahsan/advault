import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const guestLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/creators', label: 'Creators' },
  { to: '/process', label: 'Process' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

const sponsorLinks = [
  { to: '/', label: 'Home' },
  { to: '/creators', label: 'Creators' },
  { to: '/sponsor/dashboard', label: 'Dashboard' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/contact', label: 'Contact' },
]

const creatorLinks = [
  { to: '/', label: 'Home' },
  { to: '/creator/dashboard', label: 'Dashboard' },
  { to: '/creator/tiers', label: 'Tiers' },
  { to: '/creator/availability', label: 'Calendar' },
  { to: '/creator/reviews', label: 'Reviews' },
  { to: '/creator/analytics', label: 'Analytics' },
]

const linksByRole = { sponsor: sponsorLinks, creator: creatorLinks }

const solid = 'bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider text-lg px-7 py-3 rounded-sm transition'
const plain = 'text-[15px] font-medium text-white hover:text-brand-500 transition'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const links = linksByRole[role] || guestLinks
  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  const tabs = links.map((l) => (
    <NavLink
      key={l.to}
      to={l.to}
      end={l.to === '/'}
      onClick={close}
      className={({ isActive }) =>
        `relative text-[15px] font-medium transition after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:bg-brand-500 after:transition-all after:duration-300 ${
          isActive ? 'text-brand-500 after:w-full' : 'text-white hover:text-brand-500 after:w-0 hover:after:w-full'
        }`
      }
    >
      {l.label}
    </NavLink>
  ))

  const actions = user ? (
    <>
      <span className="text-sm text-white/80">
        {user.name} <span className="text-brand-500 uppercase">({user.role})</span>
      </span>
      <button onClick={handleLogout} className={solid}>Log Out</button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={close} className={plain}>Log In</Link>
      <Link to="/register" onClick={close} className={solid}>Sign Up</Link>
    </>
  )

  return (
    <header className="print:hidden bg-navy-900 sticky top-0 z-40 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid place-items-center w-9 h-9 bg-brand-500 text-white font-heading text-2xl font-extrabold">A</span>
          <span className="font-heading text-3xl font-bold tracking-wide text-white">ADVAULT</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">{tabs}</nav>
        <div className="hidden lg:flex items-center gap-5">{actions}</div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-white" aria-label="Toggle menu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="slide-down lg:hidden bg-navy-950 border-t border-white/10 px-6 py-5 flex flex-col gap-4">
          {tabs}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">{actions}</div>
        </div>
      )}
    </header>
  )
}

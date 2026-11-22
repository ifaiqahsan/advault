import { useLocation, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Footer from './Footer'
import BackToTop from './BackToTop'

const navItems = [
  { to: '/creator/dashboard', label: 'Dashboard' },
  { to: '/creator/tiers', label: 'Tiers & Pricing' },
  { to: '/creator/availability', label: 'Availability' },
  { to: '/creator/reviews', label: 'Review Queue' },
  { to: '/creator/analytics', label: 'Analytics' },
  { to: '/creator/profile', label: 'Media Profile' },
]

const navClass = ({ isActive }) =>
  `whitespace-nowrap flex items-center px-4 py-2.5 rounded-sm text-sm font-medium border-l-4 transition-all duration-200 ${
    isActive
      ? 'bg-brand-50 text-brand-600 font-semibold border-brand-500'
      : 'text-ink border-transparent hover:bg-mist hover:text-brand-500 hover:pl-5'
  }`

export default function DashboardLayout({ children, title, subtitle, action }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-mist">
      <header className="bg-navy-900 border-b border-navy-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid place-items-center w-8 h-8 bg-brand-500 text-white font-heading text-xl font-bold">A</span>
              <span className="font-heading text-2xl font-bold tracking-wide">ADVAULT</span>
            </Link>
            <span className="text-xs uppercase tracking-widest text-brand-500 font-bold bg-navy-950 px-2.5 py-1 rounded-sm border border-brand-500/30 hidden sm:inline">
              Creator Studio
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-sm font-bold">{user?.name}</div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">{user?.role}</div>
            </div>
            <Link to="/creators" className="hidden md:inline text-white/80 hover:text-brand-500 text-xs font-semibold uppercase tracking-wider transition">
              Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-5 py-2 rounded-sm transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-paper border border-line rounded-lg p-3 md:sticky md:top-24">
            <div className="hidden md:block px-3 py-2 text-xs font-heading uppercase text-muted tracking-widest border-b border-line mb-2">
              Navigation
            </div>
            <nav className="flex md:flex-col gap-1 overflow-x-auto">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main key={pathname} className="flex-1 min-w-0 page-fade">
          {(title || subtitle || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                {title && <h1 className="text-3xl text-ink">{title}</h1>}
                {subtitle && <p className="text-sm text-muted mt-1 max-w-2xl">{subtitle}</p>}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
          {children}
        </main>
      </div>

      <Footer />
      <BackToTop />
    </div>
  )
}

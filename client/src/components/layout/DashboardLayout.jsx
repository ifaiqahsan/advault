import { NavLink, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContent'
import TopBar from './TopBar'
import Footer from './Footer'

export default function DashboardLayout({ children, title, subtitle, action }) {
  const auth = useContext(AuthContext)
  const creator = auth?.user || {
    name: 'TechBytes Weekly',
    type: 'Newsletter',
  }

  const navItems = [
    { to: '/creator/dashboard', label: 'Dashboard' },
    { to: '/creator/tiers', label: 'Tiers & Pricing' },
    { to: '/creator/availability', label: 'Availability' },
    { to: '/creator/reviews', label: 'Review Queue' },
    { to: '/creator/profile', label: 'Media Profile' },
  ]

  const navClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-sm text-sm font-medium transition ${
      isActive
        ? 'bg-brand-500 text-white font-semibold shadow-xs'
        : 'text-ink hover:bg-mist hover:text-brand-500'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-mist">
      <TopBar />

      {/* Creator Portal Header Banner */}
      <div className="bg-navy-900 border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid place-items-center w-8 h-8 bg-brand-500 text-white font-heading text-xl font-bold">
                A
              </span>
              <span className="font-heading text-2xl font-bold tracking-wide">
                ADVAULT
              </span>
            </Link>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-xs uppercase tracking-widest text-brand-500 font-bold bg-navy-950 px-2.5 py-1 rounded-sm border border-brand-500/30">
              Creator Studio
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-right">
              <div className="font-bold text-white">{creator.name}</div>
              <div className="text-muted text-[11px] capitalize">{creator.type}</div>
            </div>
            <Link
              to="/creators"
              className="text-white/80 hover:text-brand-500 text-xs font-semibold uppercase tracking-wider"
            >
              ← Public Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Studio Body with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Creator Navigation Sidebar */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-paper border border-line rounded-lg p-3 shadow-xs sticky top-4">
            <div className="px-3 py-2 text-xs font-heading uppercase text-muted tracking-widest border-b border-line mb-2">
              Navigation
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0">
          {(title || subtitle || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                {title && (
                  <h1 className="text-3xl font-heading text-ink font-bold tracking-wide">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-muted mt-1">{subtitle}</p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}

          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}


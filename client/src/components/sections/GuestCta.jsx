import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function GuestCta() {
  const { user } = useAuth()
  if (user) return null

  return (
    <section className="bg-navy-800 print:hidden">
      <div className="mx-auto max-w-7xl px-6 py-14 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl text-white">Ready to book or sell?</h2>
          <p className="text-white/70 mt-1">Browsing is free. Create an account when you are ready.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="border-2 border-white/70 hover:bg-white hover:text-navy-950 text-white font-heading uppercase tracking-wider px-7 py-3 transition">
            Log In
          </Link>
          <Link to="/register" className="bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-7 py-3 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  )
}

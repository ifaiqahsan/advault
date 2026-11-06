import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-3xl text-white">
            Ad<span className="text-brand-500">Vault</span>
          </h3>
          <p className="mt-3 max-w-xs">
            A self-serve portal where creators sell ad space directly to sponsors.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-3">Explore</h4>
          <ul className="space-y-2">
            <li><Link to="/creators" className="hover:text-brand-500">Browse Creators</Link></li>
            <li><Link to="/register" className="hover:text-brand-500">Become a Creator</Link></li>
            <li><Link to="/login" className="hover:text-brand-500">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl uppercase text-white mb-3">Contact</h4>
          <p>support@advault.com</p>
          <p>Lahore, Pakistan</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm">
        © 2026 AdVault. University project, Web Programming CS-7A.
      </div>
    </footer>
  )
}
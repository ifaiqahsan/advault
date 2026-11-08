import { Link } from 'react-router-dom'

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-navy-950 p-12 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=70"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900/80 to-navy-800/60" />

        <Link to="/" className="relative flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 bg-brand-500 text-white font-heading text-2xl font-extrabold">A</span>
          <span className="font-heading text-3xl font-bold tracking-wide text-white">ADVAULT</span>
        </Link>

        <div className="relative">
          <h2 className="text-6xl text-brand-500 leading-none">Sell Ads.</h2>
          <h2 className="text-6xl outline-fill leading-none">Directly.</h2>
          <p className="mt-6 max-w-sm text-white/70">
            One account for booking or selling sponsorships. No middlemen, no commission.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-heading text-3xl font-bold text-navy-950">
            AD<span className="text-brand-500">VAULT</span>
          </Link>
          <h1 className="text-5xl text-navy-950 mt-4">{title}</h1>
          <p className="text-muted mt-2 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
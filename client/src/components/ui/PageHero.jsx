import { Link } from 'react-router-dom'

export default function PageHero({ eyebrow, title, text, crumb }) {
  return (
    <section className="print:hidden relative bg-navy-950 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=60"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-800/60" />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        {eyebrow && <p className="text-brand-500 font-heading uppercase tracking-widest text-sm mb-3">{eyebrow}</p>}
        <h1 className="text-5xl md:text-7xl text-white">{title}</h1>
        <div className="mt-4 flex items-center gap-4 font-heading uppercase tracking-wider text-white">
          <span className="w-20 h-0.5 bg-brand-500" />
          <Link to="/" className="hover:text-brand-500 transition">Home</Link>
          <span className="text-brand-500">/</span>
          <span>{crumb || title}</span>
        </div>
        {text && <p className="mt-6 max-w-2xl text-white/75 text-lg">{text}</p>}
      </div>
    </section>
  )
}

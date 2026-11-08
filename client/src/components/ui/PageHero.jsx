export default function PageHero({ eyebrow, title, text }) {
  return (
    <section className="relative bg-navy-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 to-navy-800/70" />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <p className="flex items-center gap-3 text-white font-heading uppercase tracking-widest text-sm mb-3">
          <span className="w-10 h-0.5 bg-brand-500" /> {eyebrow}
        </p>
        <h1 className="text-5xl md:text-7xl text-white">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-white/75 text-lg">{text}</p>}
      </div>
    </section>
  )
}
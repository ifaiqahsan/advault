export default function SectionTitle({ ghost, title, eyebrow, light = false }) {
  return (
    <div className="relative mb-12 pt-8">
      <span
        className={`absolute top-0 left-0 font-heading font-extrabold uppercase text-6xl md:text-8xl select-none pointer-events-none ${
          light ? 'ghost-light' : 'ghost'
        }`}
      >
        {ghost}
      </span>
      {eyebrow && (
        <p className="relative flex items-center gap-3 text-brand-500 font-heading uppercase tracking-widest text-sm mb-2">
          <span className="w-8 h-0.5 bg-brand-500" /> {eyebrow}
        </p>
      )}
      <h2 className={`relative text-4xl md:text-5xl ${light ? 'text-white' : 'text-navy-950'}`}>
        {title}
      </h2>
    </div>
  )
}
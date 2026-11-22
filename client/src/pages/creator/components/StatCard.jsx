export default function StatCard({ title, value, subtitle, icon, highlight = false }) {
  return (
    <div
      className={`relative overflow-hidden bg-paper border border-line p-5 lift ${
        highlight ? 'border-l-4 border-l-brand-500' : 'border-l-4 border-l-navy-900'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-heading uppercase text-muted tracking-wider block">{title}</span>
          <div className={`text-4xl font-heading font-extrabold mt-1 ${highlight ? 'text-brand-500' : 'text-ink'}`}>{value}</div>
          {subtitle && <p className="text-xs text-muted mt-1.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-11 h-11 shrink-0 grid place-items-center font-heading text-xl font-bold ${highlight ? 'bg-brand-500 text-white' : 'bg-mist text-navy-900 border border-line'}`}>
            {icon}
          </div>
        )}
      </div>
      <span className="absolute -right-4 -bottom-6 font-heading text-8xl font-extrabold text-ink/[0.04] select-none">{icon}</span>
    </div>
  )
}

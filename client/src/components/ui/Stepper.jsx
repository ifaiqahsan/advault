export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <span
              className={`grid place-items-center w-9 h-9 shrink-0 font-heading text-lg font-bold transition-all duration-300 ${
                done ? 'bg-approved text-white' : active ? 'bg-brand-500 text-white scale-110' : 'bg-mist text-muted border border-line'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={`hidden sm:block font-heading uppercase tracking-wider text-sm ${active ? 'text-navy-950' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <span className={`h-0.5 flex-1 transition-colors duration-500 ${done ? 'bg-approved' : 'bg-line'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

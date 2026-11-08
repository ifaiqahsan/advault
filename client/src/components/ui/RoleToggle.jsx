const roles = [
  { value: 'sponsor', label: 'Sponsor', hint: 'Book ad slots' },
  { value: 'creator', label: 'Creator', hint: 'Sell ad space' },
]

export default function RoleToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`p-4 text-left border-2 transition ${
            value === r.value
              ? 'border-brand-500 bg-brand-500/5'
              : 'border-line hover:border-brand-500/50'
          }`}
        >
          <p className="font-heading text-xl uppercase text-navy-950">{r.label}</p>
          <p className="text-xs text-muted">{r.hint}</p>
        </button>
      ))}
    </div>
  )
}
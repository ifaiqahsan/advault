import Card from '../../../components/ui/Card'

const items = [
  { status: 'Open', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', text: 'Sponsors can see and book this date.' },
  { status: 'Locked', cls: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', text: 'Blackout date. Hidden from sponsor checkout.' },
  { status: 'Booked', cls: 'bg-brand-50 text-brand-600 border-brand-300', dot: 'bg-brand-500', text: 'A sponsor holds this date. It cannot be changed.' },
]

export default function AvailabilityLegend() {
  return (
    <Card title="Slot legend" subtitle="How each status affects sponsors">
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.status} className="flex items-start gap-3 p-3 bg-mist border border-line text-xs">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border shrink-0 ${i.cls}`}>
              <span className={`w-2 h-2 rounded-full ${i.dot}`} />
              {i.status}
            </span>
            <span className="text-ink/80 pt-1">{i.text}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

import Card from '../../../components/ui/Card'

/**
 * AvailabilityLegend Component
 * Displays a color-coded visual guide explaining calendar slot statuses.
 */
export default function AvailabilityLegend() {
  const legendItems = [
    {
      status: 'Open',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dotClass: 'bg-emerald-500',
      description: 'Available for sponsors to browse and purchase in the marketplace.',
      actionText: 'Click date to lock',
    },
    {
      status: 'Locked',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      dotClass: 'bg-slate-500',
      description: 'Blackout date or creator hiatus. Hidden from sponsor booking options.',
      actionText: 'Click date to open',
    },
    {
      status: 'Booked',
      badgeClass: 'bg-brand-50 text-brand-600 border-brand-300 font-bold',
      dotClass: 'bg-brand-500',
      description: 'Active sponsor reservation confirmed. Read-only and cannot be toggled.',
      actionText: 'Read-only slot',
    },
  ]

  return (
    <Card
      title="Slot Status Legend"
      subtitle="Understand how calendar statuses dictate sponsor checkout eligibility"
    >
      <div className="space-y-4">
        {legendItems.map((item) => (
          <div
            key={item.status}
            className="p-3 bg-mist rounded-sm border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${item.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                {item.status}
              </span>
              <span className="text-ink/80 text-xs">{item.description}</span>
            </div>

            <span className="text-[11px] font-mono text-muted uppercase tracking-wider shrink-0 bg-white px-2 py-0.5 rounded-xs border border-line">
              {item.actionText}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}


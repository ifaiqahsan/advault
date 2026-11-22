import StatusBadge from '../../../components/ui/StatusBadge'
import { money } from '../../../utils/format'

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'revision_requested', label: 'Revisions' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

export default function SubmissionList({ submissions = [], selectedId, onSelect, activeFilter, onFilterChange }) {
  const filtered = activeFilter === 'all' ? submissions : submissions.filter((s) => s.status === activeFilter)

  return (
    <div className="bg-paper border border-line overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-mist border-b border-line overflow-x-auto">
        {tabs.map((t) => {
          const count = t.key === 'all' ? submissions.length : submissions.filter((s) => s.status === t.key).length
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onFilterChange(t.key)}
              className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wider font-semibold transition whitespace-nowrap ${
                activeFilter === t.key ? 'bg-brand-600 text-white' : 'text-ink/70 hover:bg-white hover:text-brand-500'
              }`}
            >
              {t.label} ({count})
            </button>
          )
        })}
      </div>

      <div key={activeFilter} className="divide-y divide-line max-h-[600px] overflow-y-auto fade-in">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-muted text-xs">Nothing here yet.</p>
        ) : (
          filtered.map((item) => {
            const selected = item.id === selectedId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 flex flex-col gap-2 border-l-4 transition-all duration-150 ${
                  selected ? 'bg-brand-50 border-l-brand-500' : 'border-l-transparent hover:bg-mist hover:pl-5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-ink text-lg truncate">{item.sponsorName}</h4>
                    <span className="text-xs text-muted block truncate">{item.tierName}</span>
                  </div>
                  <StatusBadge status={item.status} className="shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-line/60">
                  <span>Slot <strong className="text-ink">{item.slotDate}</strong></span>
                  <span className="font-semibold text-ink">{money(item.amount)}</span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

import StatusBadge from '../../../components/ui/StatusBadge'

/**
 * SubmissionList Component
 * Displays submissions with filtering by status and selection highlighting.
 *
 * Props:
 * - submissions: array of submission objects
 * - selectedId: currently active submission ID
 * - onSelect: callback when user clicks a submission
 * - activeFilter: current filter tab
 * - onFilterChange: callback when user changes filter tab
 */
export default function SubmissionList({
  submissions = [],
  selectedId,
  onSelect,
  activeFilter,
  onFilterChange,
}) {
  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'revision_requested', label: 'Revisions' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ]

  const filtered = submissions.filter((item) => {
    if (activeFilter === 'all') return true
    return item.status === activeFilter
  })

  return (
    <div className="bg-paper border border-line rounded-lg overflow-hidden shadow-xs">
      {/* Filter Tabs Header */}
      <div className="flex items-center gap-1 p-2 bg-mist border-b border-line overflow-x-auto">
        {filterTabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? submissions.length
              : submissions.filter((s) => s.status === tab.key).length

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-sm text-xs font-heading uppercase tracking-wider font-semibold transition cursor-pointer whitespace-nowrap ${
                activeFilter === tab.key
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-ink/70 hover:bg-white hover:text-ink'
              }`}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Submissions List */}
      <div className="divide-y divide-line max-h-[580px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted text-xs">
            No submissions matching &quot;{activeFilter}&quot;.
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = item.id === selectedId
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={`p-4 cursor-pointer transition-colors duration-100 flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-brand-50/40 border-l-4 border-l-brand-500'
                    : 'hover:bg-mist/50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-ink text-base truncate">
                      {item.sponsorName}
                    </h4>
                    <span className="text-xs text-muted block truncate">
                      {item.tierName}
                    </span>
                  </div>
                  <StatusBadge status={item.status} className="shrink-0" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-line/50">
                  <span>Slot Date: <strong className="text-ink font-mono">{item.slotDate}</strong></span>
                  <span className="font-mono font-semibold text-ink">${item.amount}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}


import { formatStamp } from '../../utils/format'

export default function NotificationList({ items = [], empty = 'No email notifications yet.' }) {
  if (items.length === 0) return <p className="text-sm text-muted py-6 text-center">{empty}</p>

  return (
    <ul className="divide-y divide-line">
      {items.map((m) => (
        <li key={m.id} className="flex items-start gap-3 py-3 fade-in">
          <span className="mt-0.5 grid place-items-center w-8 h-8 shrink-0 bg-brand-50 text-brand-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink leading-snug">{m.subject}</p>
            <p className="text-xs text-muted mt-0.5 truncate">To {m.to} · {formatStamp(m.at)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

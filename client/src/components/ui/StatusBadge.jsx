export default function StatusBadge({ status = 'pending', label, className = '' }) {
  const normalized = String(status).toLowerCase().replace(/[\s-]/g, '_')

  const badgeStyles = {
    approved: 'bg-green-50 text-approved border-approved/30',
    booked: 'bg-green-50 text-approved border-approved/30',
    pending: 'bg-amber-50 text-amber-700 border-amber-300',
    revision: 'bg-sky-50 text-revision border-sky-300',
    revision_requested: 'bg-sky-50 text-revision border-sky-300',
    rejected: 'bg-red-50 text-rejected border-rejected/30',
    locked: 'bg-slate-100 text-slate-700 border-slate-300',
    open: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  }

  const dotStyles = {
    approved: 'bg-approved',
    booked: 'bg-approved',
    pending: 'bg-amber-500',
    revision: 'bg-revision',
    revision_requested: 'bg-revision',
    rejected: 'bg-rejected',
    locked: 'bg-slate-500',
    open: 'bg-emerald-500',
  }

  const defaultLabels = {
    approved: 'Approved',
    booked: 'Booked',
    pending: 'Pending Review',
    revision: 'Revision Requested',
    revision_requested: 'Revision Requested',
    rejected: 'Rejected',
    locked: 'Locked',
    open: 'Open',
  }

  const style = badgeStyles[normalized] || badgeStyles.pending
  const dotColor = dotStyles[normalized] || dotStyles.pending
  const text = label || defaultLabels[normalized] || status

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {text}
    </span>
  )
}
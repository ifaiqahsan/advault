const map = {
  approved: { label: 'Approved', cls: 'bg-green-50 text-approved border-approved/30', dot: 'bg-approved' },
  booked: { label: 'Booked', cls: 'bg-green-50 text-approved border-approved/30', dot: 'bg-approved' },
  captured: { label: 'Payment Captured', cls: 'bg-green-50 text-approved border-approved/30', dot: 'bg-approved' },
  pending: { label: 'Pending Review', cls: 'bg-amber-50 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  authorized: { label: 'Payment Held', cls: 'bg-amber-50 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  revision_requested: { label: 'Revision Requested', cls: 'bg-sky-50 text-revision border-sky-300', dot: 'bg-revision' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-rejected border-rejected/30', dot: 'bg-rejected' },
  released: { label: 'Payment Released', cls: 'bg-red-50 text-rejected border-rejected/30', dot: 'bg-rejected' },
  locked: { label: 'Locked', cls: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500' },
  open: { label: 'Open', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
}

export default function StatusBadge({ status = 'pending', label, className = '' }) {
  const key = String(status).toLowerCase().replace(/[\s-]/g, '_')
  const item = map[key] || map.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border whitespace-nowrap ${item.cls} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dot}`} />
      {label || item.label}
    </span>
  )
}

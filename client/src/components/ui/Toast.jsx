const tones = { success: 'bg-approved', error: 'bg-rejected', info: 'bg-navy-900' }

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  return (
    <div className="print:hidden fixed bottom-6 left-6 z-[60] toast-in">
      <div className={`${tones[toast.type] || tones.success} text-white pl-4 pr-3 py-3 shadow-2xl flex items-center gap-4 max-w-sm border-l-4 border-white/40`}>
        <p className="text-sm">{toast.message}</p>
        <button onClick={onClose} aria-label="Dismiss" className="text-white/80 hover:text-white text-xl leading-none">×</button>
      </div>
    </div>
  )
}

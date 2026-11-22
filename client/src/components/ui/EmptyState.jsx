export default function EmptyState({ title, text, action }) {
  return (
    <div className="bg-paper border border-dashed border-line rounded-lg p-12 text-center fade-in">
      <div className="w-14 h-14 mx-auto grid place-items-center bg-brand-50 text-brand-500 font-heading text-3xl font-bold mb-4">!</div>
      <h3 className="text-2xl text-ink">{title}</h3>
      {text && <p className="text-sm text-muted max-w-md mx-auto mt-2">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

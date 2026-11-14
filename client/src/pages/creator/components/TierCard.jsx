import Button from '../../../components/ui/Button'
import { money } from '../../../utils/format'

export default function TierCard({ tier, onEdit, onDelete }) {
  const { name, price, wordLimit, imageSize, description, perks = [], slotsOpen } = tier

  return (
    <article className="relative h-full flex flex-col justify-between bg-paper border border-line border-t-4 border-t-brand-500 lift">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl text-ink normal-case leading-tight">{name}</h3>
          <span className="shrink-0 bg-navy-900 text-white text-[11px] font-heading uppercase tracking-wider px-2 py-1">{slotsOpen ?? 0} open</span>
        </div>
        <p className="font-heading text-5xl font-extrabold text-brand-500 mt-2">
          {money(price)}
          <span className="text-xs font-normal text-muted font-sans ml-1">/ slot</span>
        </p>

        {description && <p className="text-sm text-ink/80 mt-3 leading-relaxed">{description}</p>}

        <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-mist border border-line text-xs">
          <div>
            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Word limit</span>
            <span className="font-semibold text-ink">{wordLimit} words</span>
          </div>
          <div>
            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Image</span>
            <span className="font-semibold text-ink block truncate" title={imageSize}>{imageSize || 'None'}</span>
          </div>
        </div>

        {perks.length > 0 && (
          <ul className="mt-4 space-y-1">
            {perks.map((p) => (
              <li key={p} className="text-xs text-ink/85 flex items-center gap-2">
                <span className="text-brand-500 font-bold">✓</span>
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2 p-4 border-t border-line bg-mist/60">
        <Button variant="outline" size="sm" onClick={() => onEdit(tier)} className="flex-1">Edit</Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(tier)} className="flex-1">Delete</Button>
      </div>
    </article>
  )
}

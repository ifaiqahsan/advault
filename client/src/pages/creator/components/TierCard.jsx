import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

/**
 * TierCard Component
 * Displays a single sponsorship tier's pricing, specifications, and action buttons.
 *
 * Props:
 * - tier: { id, name, price, wordLimit, imageSize, description, perks }
 * - onEdit: callback function invoked with tier object to open edit modal
 * - onDelete: callback function invoked with tier object to open delete modal
 */
export default function TierCard({ tier, onEdit, onDelete }) {
  const { name, price, wordLimit, imageSize, description, perks = [] } = tier

  return (
    <Card className="h-full flex flex-col justify-between hover:border-navy-800/40 transition-colors duration-150">
      <div>
        {/* Tier Header: Name and Price */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-line">
          <div>
            <h3 className="font-heading text-xl font-bold text-ink tracking-wide">
              {name}
            </h3>
            <div className="text-2xl font-extrabold font-heading text-brand-500 mt-1">
              ${Number(price).toLocaleString()}
              <span className="text-xs font-normal text-muted tracking-normal font-sans ml-1">
                / slot
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-xs bg-mist border border-line text-ink/70">
            Active
          </span>
        </div>

        {/* Tier Description */}
        {description && (
          <p className="text-sm text-ink/80 mt-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Key Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-mist rounded-sm border border-line/60 text-xs">
          <div>
            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">
              Word Limit
            </span>
            <span className="font-semibold text-ink font-mono">
              {wordLimit} words
            </span>
          </div>
          <div>
            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">
              Image Size
            </span>
            <span className="font-semibold text-ink truncate block" title={imageSize}>
              {imageSize || 'None'}
            </span>
          </div>
        </div>

        {/* Perks list */}
        {perks && perks.length > 0 && (
          <div className="mt-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-1.5">
              Included Deliverables:
            </span>
            <ul className="space-y-1">
              {perks.map((perk, idx) => (
                <li key={idx} className="text-xs text-ink/85 flex items-center gap-1.5">
                  <span className="text-brand-500 font-bold">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons: Edit and Delete */}
      <div className="flex items-center gap-2 pt-4 mt-5 border-t border-line">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(tier)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(tier)}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}


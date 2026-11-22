import Button from '../../../components/ui/Button'
import { money } from '../../../utils/format'

export default function DeleteTierConfirm({ tier, onConfirm, onCancel }) {
  if (!tier) return null

  return (
    <div className="space-y-4">
      <div className="p-4 bg-red-50 border-l-4 border-rejected text-sm text-red-900">
        <p className="font-semibold">Delete this sponsorship tier?</p>
        <p className="mt-1 text-xs">
          <strong>{tier.name}</strong> ({money(tier.price)}) will disappear from your public profile. Existing bookings keep their data.
        </p>
      </div>
      <div className="flex items-center justify-end gap-3 pt-3">
        <Button variant="outline" onClick={onCancel}>Keep tier</Button>
        <Button variant="danger" onClick={onConfirm}>Delete tier</Button>
      </div>
    </div>
  )
}

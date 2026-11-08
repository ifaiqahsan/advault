import Button from '../../../components/ui/Button'

/**
 * DeleteTierConfirm Component
 * Modal confirmation content for safely removing a tier.
 *
 * Props:
 * - tier: the tier object being considered for deletion
 * - onConfirm: function() callback to confirm removal
 * - onCancel: function() callback to cancel and dismiss
 */
export default function DeleteTierConfirm({ tier, onConfirm, onCancel }) {
  if (!tier) return null

  return (
    <div className="space-y-4">
      <div className="p-3.5 bg-red-50 border border-red-200 rounded-sm text-sm text-red-800">
        <p className="font-semibold">
          Are you sure you want to delete this sponsorship tier?
        </p>
        <p className="mt-1 text-xs text-red-700">
          Tier: <strong className="font-semibold">{tier.name}</strong> (${tier.price})
        </p>
        <p className="mt-1 text-xs text-red-600">
          This will immediately remove this package from your public media profile. Active or historical bookings referencing this tier will retain their existing data.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3">
        <Button variant="outline" size="md" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="md" type="button" onClick={onConfirm}>
          Yes, Delete Tier
        </Button>
      </div>
    </div>
  )
}


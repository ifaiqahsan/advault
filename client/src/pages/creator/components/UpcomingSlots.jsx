import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import StatusBadge from '../../../components/ui/StatusBadge'
import Button from '../../../components/ui/Button'

/**
 * UpcomingSlots Component
 * Displays a chronological schedule of upcoming booked and pending sponsorship slots.
 *
 * Props:
 * - slots: array of booking objects for the current creator
 */
export default function UpcomingSlots({ slots = [] }) {
  // Format date helper: "2026-11-15" -> "Nov 15, 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const [year, month, day] = dateStr.split('-')
      const date = new Date(Number(year), Number(month) - 1, Number(day))
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <Card
      title="Upcoming Sponsorship Slots"
      subtitle="Scheduled placements and sponsor deliverables ordered by publication date."
      action={
        <Link to="/creator/reviews">
          <Button variant="outline" size="sm">
            View All in Review Queue →
          </Button>
        </Link>
      }
    >
      {slots.length === 0 ? (
        <div className="py-12 text-center text-muted">
          <p className="text-sm">No booked slots on your schedule yet.</p>
          <p className="text-xs mt-1">
            New sponsor bookings will automatically appear here once scheduled.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-mist/50 text-[11px] font-heading uppercase text-muted tracking-wider">
                <th className="py-3 px-6 font-semibold">Slot Date</th>
                <th className="py-3 px-6 font-semibold">Sponsor</th>
                <th className="py-3 px-6 font-semibold">Tier Package</th>
                <th className="py-3 px-6 font-semibold">Amount</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {slots.map((slot) => (
                <tr
                  key={slot.id}
                  className="hover:bg-mist/40 transition-colors duration-100"
                >
                  {/* Slot Date */}
                  <td className="py-3.5 px-6 whitespace-nowrap font-medium text-ink">
                    <span className="font-mono text-xs">
                      {formatDate(slot.slotDate)}
                    </span>
                  </td>

                  {/* Sponsor Name & Email */}
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-ink">{slot.sponsorName}</div>
                    {slot.sponsorEmail && (
                      <div className="text-xs text-muted truncate max-w-[160px]">
                        {slot.sponsorEmail}
                      </div>
                    )}
                  </td>

                  {/* Tier */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-xs text-ink/90">
                    {slot.tierName || slot.tierId}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-6 whitespace-nowrap font-mono font-semibold text-ink">
                    ${Number(slot.amount || 0).toLocaleString()}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <StatusBadge status={slot.status} />
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <Link
                      to="/creator/reviews"
                      className="text-xs font-semibold uppercase tracking-wider text-brand-500 hover:text-brand-600 transition"
                    >
                      Review Creative →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}


import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import StatusBadge from '../../../components/ui/StatusBadge'
import Button from '../../../components/ui/Button'
import { formatDate, money } from '../../../utils/format'

export default function UpcomingSlots({ slots = [] }) {
  return (
    <Card
      title="Upcoming sponsorship slots"
      subtitle="Scheduled placements ordered by publication date"
      action={<Button to="/creator/reviews" variant="outline" size="sm">Open review queue</Button>}
    >
      {slots.length === 0 ? (
        <div className="py-12 text-center text-muted">
          <p className="text-sm">No sponsor bookings yet.</p>
          <p className="text-xs mt-1">New bookings appear here as soon as a sponsor checks out.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-mist/60 text-[11px] font-heading uppercase text-muted tracking-wider">
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Sponsor</th>
                <th className="py-3 px-6">Tier</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {slots.map((s) => (
                <tr key={s.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="py-3.5 px-6 whitespace-nowrap font-medium text-ink">{formatDate(s.slotDate)}</td>
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-ink">{s.sponsorName}</div>
                    {s.sponsorEmail && <div className="text-xs text-muted truncate max-w-[160px]">{s.sponsorEmail}</div>}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-xs">{s.tierName}</td>
                  <td className="py-3.5 px-6 whitespace-nowrap font-semibold">{money(s.amount)}</td>
                  <td className="py-3.5 px-6 whitespace-nowrap"><StatusBadge status={s.status} /></td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <Link to="/creator/reviews" className="text-xs font-semibold uppercase tracking-wider text-brand-500 hover:text-brand-600 transition">
                      Review
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

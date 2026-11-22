import { useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import NotificationList from '../../components/ui/NotificationList'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { money } from '../../utils/format'
import StatCard from './components/StatCard'
import UpcomingSlots from './components/UpcomingSlots'

const tips = [
  ['Review promptly', 'Respond within 48 hours so sponsors have time to fix their assets.'],
  ['Keep the calendar accurate', 'Lock dates when you are on a break so nobody books them.'],
  ['Update your profile', 'Fresh audience numbers build trust with sponsors.'],
]

export default function Dashboard() {
  const { user } = useAuth()
  const { creators, bookings, tiers, notifications } = useData()
  const cid = user.creatorId
  const creator = creators.find((c) => c.id === cid)

  const mine = useMemo(() => bookings.filter((b) => b.creatorId === cid), [bookings, cid])
  const myTiers = tiers.filter((t) => t.creatorId === cid)
  const mails = notifications.filter((n) => n.creatorId === cid).slice(0, 5)

  const metrics = useMemo(() => ({
    earned: mine.filter((b) => b.status === 'approved').reduce((s, b) => s + Number(b.amount), 0),
    held: mine.filter((b) => b.paymentStatus === 'authorized').reduce((s, b) => s + Number(b.amount), 0),
    pending: mine.filter((b) => b.status === 'pending').length,
    approved: mine.filter((b) => b.status === 'approved').length,
  }), [mine])

  const upcoming = useMemo(
    () => mine.filter((b) => b.status !== 'rejected').sort((a, b) => (a.slotDate > b.slotDate ? 1 : -1)),
    [mine]
  )

  return (
    <DashboardLayout
      title={`Welcome back, ${creator?.name || user.name}`}
      subtitle="Your sponsorship revenue, ad submissions and scheduled slots."
      action={
        <div className="flex flex-wrap gap-3">
          <Button to="/creator/reviews">Review submissions ({metrics.pending})</Button>
          <Button to="/creator/tiers" variant="outline">Manage tiers</Button>
        </div>
      }
    >
      {!creator && (
        <div className="pop-in mb-8 p-5 bg-brand-50 border-l-4 border-brand-500 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-ink">Finish your media profile</p>
            <p className="text-sm text-muted">Sponsors can find you in the marketplace once your profile is saved.</p>
          </div>
          <Button to="/creator/profile">Set up profile</Button>
        </div>
      )}

      {metrics.pending > 0 && (
        <div className="pop-in mb-8 p-4 bg-amber-50 border-l-4 border-pending flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-pending text-white grid place-items-center font-heading text-xl shrink-0">{metrics.pending}</span>
            <div>
              <p className="font-semibold text-amber-900 text-sm">Creatives waiting for your review</p>
              <p className="text-xs text-amber-800">Approve, reject or request a revision.</p>
            </div>
          </div>
          <Button to="/creator/reviews" variant="secondary" size="sm">Open review queue</Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total earnings" value={money(metrics.earned)} subtitle="Captured from approved slots" icon="$" highlight />
        <StatCard title="Held in escrow" value={money(metrics.held)} subtitle="Released after you approve" icon="H" />
        <StatCard title="Confirmed bookings" value={String(metrics.approved)} subtitle="Approved and scheduled" icon="✓" />
        <StatCard title="Active tiers" value={String(myTiers.length)} subtitle="Packages sponsors can buy" icon="T" />
      </div>

      <div className="space-y-8">
        <UpcomingSlots slots={upcoming} />

        <div className="grid gap-8 lg:grid-cols-2">
          <Card title="Email notifications" subtitle="Alerts sent for your bookings">
            <NotificationList items={mails} />
          </Card>
          <Card title="Studio workflow" subtitle="Habits that keep sponsors coming back">
            <ol className="space-y-4">
              {tips.map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 grid place-items-center bg-navy-900 text-white font-heading">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-ink text-sm">{title}</p>
                    <p className="text-xs text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

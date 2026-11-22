import { Navigate, useParams } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'
import StatusBadge from '../../components/ui/StatusBadge'
import NotificationList from '../../components/ui/NotificationList'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, money } from '../../utils/format'

export default function Receipt() {
  const { bookingId } = useParams()
  const { user } = useAuth()
  const { bookings, creators, notifications } = useData()

  const booking = bookings.find((b) => b.id === bookingId && b.sponsorId === user.sponsorId)
  if (!booking) return <Navigate to="/my-bookings" replace />

  const creator = creators.find((c) => c.id === booking.creatorId)
  const mails = notifications.filter((n) => n.bookingId === booking.id && n.sponsorId === user.sponsorId)
  const decided = booking.status === 'approved' || booking.status === 'rejected'

  const stages = [
    { label: 'Ad submitted and payment authorized', note: formatDate(booking.submittedAt), tone: 'done' },
    { label: 'Creator review', note: decided ? 'Reviewed' : booking.status === 'revision_requested' ? 'Waiting for your revision' : 'In the review queue', tone: decided ? 'done' : 'active' },
    booking.status === 'rejected'
      ? { label: 'Rejected and payment released', note: 'No charge was made', tone: 'fail' }
      : { label: 'Approved, slot locked and payment captured', note: booking.status === 'approved' ? 'Your ad is scheduled' : 'Pending approval', tone: booking.status === 'approved' ? 'done' : 'idle' },
  ]

  const dot = { done: 'bg-approved text-white', active: 'bg-brand-500 text-white animate-pulse', fail: 'bg-rejected text-white', idle: 'bg-mist text-muted border border-line' }

  return (
    <>
      <PageHero eyebrow="Booking confirmed" title="Receipt" text="Keep this page for your records. A copy was emailed to you." />

      <section className="mx-auto max-w-4xl px-6 py-14 space-y-8">
        <div className="bg-paper border border-line border-t-4 border-t-brand-500 shadow-lg pop-in">
          <div className="p-8 flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-line">
            <div>
              <p className="font-heading text-3xl text-navy-950">ADVAULT</p>
              <p className="text-xs text-muted mt-1">Receipt no. {booking.id.toUpperCase()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={booking.status} />
              <StatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          <div className="p-8 grid sm:grid-cols-2 gap-8">
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs uppercase tracking-wider text-muted">Creator</dt><dd className="font-semibold">{creator?.name || 'Creator'}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted">Tier</dt><dd className="font-semibold">{booking.tierName}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted">Publication date</dt><dd className="font-semibold">{formatDate(booking.slotDate)}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted">Billed to</dt><dd className="font-semibold">{booking.sponsorName} ({booking.sponsorEmail})</dd></div>
            </dl>
            <div className="bg-mist p-6 flex flex-col justify-center text-center">
              <p className="text-xs uppercase tracking-wider text-muted">Amount</p>
              <p className="font-heading text-6xl text-brand-500">{money(booking.amount)}</p>
              <p className="text-xs text-muted">Platform fee $0</p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <p className="text-xs uppercase tracking-wider text-muted mb-2">Your ad</p>
            <div className="flex gap-4 border border-line p-4">
              {booking.adImageUrl && <img src={booking.adImageUrl} alt="" className="w-28 h-20 object-cover shrink-0" />}
              <div className="min-w-0">
                <p className="font-heading text-xl text-navy-950">{booking.headline}</p>
                <p className="text-sm text-muted line-clamp-2">{booking.adCopy}</p>
                <p className="text-xs text-brand-500 truncate mt-1">{booking.targetUrl}</p>
              </div>
            </div>
          </div>
        </div>

        <Card title="Order progress">
          <ol className="space-y-5">
            {stages.map((s, i) => (
              <li key={s.label} className="flex items-start gap-4">
                <span className={`w-8 h-8 shrink-0 grid place-items-center font-heading text-lg ${dot[s.tone]}`}>{s.tone === 'done' ? '✓' : s.tone === 'fail' ? '×' : i + 1}</span>
                <div>
                  <p className="font-semibold text-navy-950">{s.label}</p>
                  <p className="text-xs text-muted">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Email notifications" subtitle="Sent automatically for this booking">
          <NotificationList items={mails} empty="No emails recorded for this booking." />
        </Card>

        <div className="print:hidden flex flex-wrap gap-3">
          <Button onClick={() => window.print()}>Print receipt</Button>
          <Button to="/my-bookings" variant="outline">My bookings</Button>
          {booking.status === 'revision_requested' && <Button to={`/submit/${booking.id}`} variant="secondary">Edit and resubmit</Button>}
        </div>
      </section>
    </>
  )
}

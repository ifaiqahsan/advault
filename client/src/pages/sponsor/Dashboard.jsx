import PageHero from '../../components/ui/PageHero'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import NotificationList from '../../components/ui/NotificationList'
import EmptyState from '../../components/ui/EmptyState'
import Reveal from '../../components/ui/Reveal'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, money, todayKey } from '../../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const { bookings, creators, notifications } = useData()

  const mine = bookings.filter((b) => b.sponsorId === user.sponsorId)
  const upcoming = mine
    .filter((b) => b.status !== 'rejected' && b.slotDate >= todayKey())
    .sort((a, b) => (a.slotDate > b.slotDate ? 1 : -1))
    .slice(0, 4)
  const needsAction = mine.filter((b) => b.status === 'revision_requested')
  const spent = mine.filter((b) => b.paymentStatus === 'captured').reduce((s, b) => s + b.amount, 0)
  const held = mine.filter((b) => b.paymentStatus === 'authorized').reduce((s, b) => s + b.amount, 0)
  const clicks = mine.reduce((s, b) => s + (b.clicks || 0), 0)
  const mails = notifications.filter((n) => n.sponsorId === user.sponsorId).slice(0, 5)

  const stats = [['Bookings', mine.length], ['Spent', money(spent)], ['Held in escrow', money(held)], ['Clicks', clicks]]

  return (
    <>
      <PageHero eyebrow="Sponsor portal" title={`Hello, ${user.name.split(' ')[0]}`} crumb="Dashboard" text="Your campaigns, payments and notifications in one place." />

      <section className="mx-auto max-w-7xl px-6 py-14 space-y-10">
        {needsAction.length > 0 && (
          <div className="pop-in bg-sky-50 border-l-4 border-revision p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sky-900">{needsAction.length} ad{needsAction.length > 1 ? 's need' : ' needs'} your changes</p>
              <p className="text-sm text-sky-800">Creators asked for revisions. Update the creative so it can be approved.</p>
            </div>
            <Button to={`/submit/${needsAction[0].id}`} variant="secondary">Edit now</Button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(([label, value], i) => (
            <Reveal key={label} delay={i * 80}>
              <div className="bg-navy-900 text-white p-6 border-b-4 border-brand-500 lift">
                <p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
                <p className="font-heading text-5xl mt-1">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card title="Upcoming placements" subtitle="Your next scheduled ads" action={<Button to="/my-bookings" variant="outline" size="sm">All bookings</Button>}>
              {upcoming.length === 0 ? (
                <EmptyState title="Nothing scheduled" text="Book a slot with a creator to see it here." action={<Button to="/creators">Browse creators</Button>} />
              ) : (
                <ul className="divide-y divide-line">
                  {upcoming.map((b) => (
                    <li key={b.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="shrink-0 w-14 text-center bg-brand-50 border border-brand-300 py-1">
                          <p className="font-heading text-2xl text-brand-600 leading-none">{b.slotDate.slice(8)}</p>
                          <p className="text-[10px] uppercase text-brand-600">{formatDate(b.slotDate).slice(0, 3)}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-950 truncate">{b.headline}</p>
                          <p className="text-xs text-muted">{creators.find((c) => c.id === b.creatorId)?.name} · {b.tierName}</p>
                        </div>
                      </div>
                      <StatusBadge status={b.status} className="shrink-0" />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card title="Email notifications" subtitle="Latest alerts sent to you">
              <NotificationList items={mails} />
            </Card>
            <div className="bg-navy-800 p-6 text-white border-t-4 border-brand-500">
              <h3 className="text-2xl">Plan your next campaign</h3>
              <p className="text-sm text-white/70 mt-2 mb-5">Compare audiences and open dates across every creator.</p>
              <Button to="/creators" variant="light">Browse creators</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { mockBookings } from '../../data/mockBookings'
import { mockCreators } from '../../data/mockCreators'

const shortcuts = [
  { to: '/creator/tiers', label: 'Tiers', text: 'Edit prices and limits' },
  { to: '/creator/availability', label: 'Calendar', text: 'Open or lock dates' },
  { to: '/creator/reviews', label: 'Reviews', text: 'Approve submissions' },
  { to: '/creator/profile', label: 'Profile', text: 'Update your media page' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const first = user.name.split(' ')[0]
  const media = mockCreators.find((c) => c.id === user.creatorId)
  const mine = mockBookings.filter((b) => b.creatorId === user.creatorId)

  const earnings = mine.filter((b) => b.status === 'approved').reduce((sum, b) => sum + b.amount, 0)
  const pending = mine.filter((b) => b.status === 'pending')
  const upcoming = mine.filter((b) => b.status === 'approved')

  const stats = [
    ['Earnings', `$${earnings}`],
    ['Pending Reviews', pending.length],
    ['Upcoming Slots', upcoming.length],
  ]

  return (
    <>
      <PageHero
        eyebrow="Creator Dashboard"
        title={`Welcome, ${first}`}
        text={media ? `Managing ${media.name}` : 'Your media profile is not set up yet.'}
      />

      <section className="mx-auto max-w-7xl px-6 py-14">
        {!media && (
          <div className="mb-10 border-l-4 border-brand-500 bg-mist p-6">
            <p className="font-semibold text-navy-950">Finish your profile to start selling ad space.</p>
            <Link to="/creator/profile" className="text-brand-500 font-semibold hover:underline">
              Go to Profile →
            </Link>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="bg-mist border-b-4 border-brand-500 p-6">
              <p className="text-sm text-muted uppercase tracking-widest">{label}</p>
              <p className="font-heading text-5xl font-bold text-navy-950 mt-2">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-3 mt-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl text-navy-950 mb-5">Recent Submissions</h2>
            {mine.length === 0 ? (
              <p className="text-muted">No submissions yet. Sponsors will appear here once they book.</p>
            ) : (
              <div className="divide-y divide-line border border-line">
                {mine.map((b) => (
                  <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold text-navy-950">{b.title}</p>
                      <p className="text-sm text-muted">{b.sponsor} · {b.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-2xl text-brand-500">${b.amount}</span>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-3xl text-navy-950 mb-5">Shortcuts</h2>
            <div className="space-y-3">
              {shortcuts.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="block bg-mist border-b-4 border-brand-500/30 hover:border-brand-500 transition p-4"
                >
                  <p className="font-heading text-xl uppercase text-navy-950">{s.label}</p>
                  <p className="text-sm text-muted">{s.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
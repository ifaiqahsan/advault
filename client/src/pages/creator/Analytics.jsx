import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Toast from '../../components/ui/Toast'
import useToast from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, money } from '../../utils/format'
import StatCard from './components/StatCard'

export default function Analytics() {
  const { user } = useAuth()
  const { bookings, trackClick } = useData()
  const { toast, show, clear } = useToast()
  const cid = user.creatorId

  const live = bookings.filter((b) => b.creatorId === cid && b.status === 'approved')
  const total = live.reduce((s, b) => s + (b.clicks || 0), 0)
  const top = Math.max(1, ...live.map((b) => b.clicks || 0))
  const revenue = live.reduce((s, b) => s + b.amount, 0)
  const average = live.length ? Math.round(total / live.length) : 0
  const best = [...live].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]

  const click = (b) => {
    trackClick(b.id)
    show(`Logged a test click for ${b.sponsorName}.`, 'info')
  }

  return (
    <DashboardLayout title="Click analytics" subtitle="See how each approved sponsor placement performs.">
      <Toast toast={toast} onClose={clear} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total clicks" value={String(total)} subtitle="Across approved ads" icon="C" highlight />
        <StatCard title="Live placements" value={String(live.length)} subtitle="Approved and scheduled" icon="✓" />
        <StatCard title="Avg. clicks" value={String(average)} subtitle="Per placement" icon="A" />
        <StatCard title="Revenue" value={money(revenue)} subtitle="From live placements" icon="$" />
      </div>

      {live.length === 0 ? (
        <EmptyState title="No live placements" text="Approve a sponsor creative in the review queue to start tracking clicks." action={<Button to="/creator/reviews">Open review queue</Button>} />
      ) : (
        <div className="space-y-8">
          <Card title="Clicks per placement" subtitle={best ? `Best performer: ${best.sponsorName}` : undefined}>
            <ul className="space-y-5">
              {live.map((b) => (
                <li key={b.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-ink">{b.sponsorName} <span className="text-muted font-normal">· {formatDate(b.slotDate)}</span></span>
                    <span className="font-heading text-xl text-brand-500">{b.clicks || 0}</span>
                  </div>
                  <div className="h-3 bg-mist overflow-hidden">
                    <div key={b.clicks} className="h-full bg-brand-500 bar-grow" style={{ width: `${((b.clicks || 0) / top) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Placement details" subtitle="Use the test button to simulate a visitor clicking the sponsor link">
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-mist/60 text-[11px] font-heading uppercase text-muted tracking-wider">
                    <th className="py-3 px-6">Sponsor</th>
                    <th className="py-3 px-6">Tier</th>
                    <th className="py-3 px-6">Link</th>
                    <th className="py-3 px-6">Clicks</th>
                    <th className="py-3 px-6 text-right">Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {live.map((b) => (
                    <tr key={b.id} className="hover:bg-brand-50/40 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-ink">{b.sponsorName}</td>
                      <td className="py-3.5 px-6 text-xs">{b.tierName}</td>
                      <td className="py-3.5 px-6 text-xs text-brand-500 truncate max-w-[200px]">{b.targetUrl}</td>
                      <td className="py-3.5 px-6 font-heading text-xl">{b.clicks || 0}</td>
                      <td className="py-3.5 px-6 text-right"><Button size="sm" variant="outline" onClick={() => click(b)}>Log click</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, money } from '../../utils/format'

const tabs = [['all', 'All'], ['pending', 'Pending'], ['revision_requested', 'Revisions'], ['approved', 'Approved'], ['rejected', 'Rejected']]

const stripe = {
  approved: 'border-l-approved',
  pending: 'border-l-pending',
  revision_requested: 'border-l-revision',
  rejected: 'border-l-rejected',
}

export default function Bookings() {
  const { user } = useAuth()
  const { bookings, creators } = useData()
  const [tab, setTab] = useState('all')

  const mine = bookings.filter((b) => b.sponsorId === user.sponsorId)
  const shown = tab === 'all' ? mine : mine.filter((b) => b.status === tab)

  const spent = mine.filter((b) => b.paymentStatus === 'captured').reduce((s, b) => s + b.amount, 0)
  const held = mine.filter((b) => b.paymentStatus === 'authorized').reduce((s, b) => s + b.amount, 0)
  const clicks = mine.reduce((s, b) => s + (b.clicks || 0), 0)
  const stats = [['Total bookings', mine.length], ['Spent', money(spent)], ['Held in escrow', money(held)], ['Total clicks', clicks]]

  return (
    <>
      <PageHero eyebrow="Your campaigns" title="My Bookings" text="Track every ad from submission to publication." />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(([label, value], i) => (
            <Reveal key={label} delay={i * 80}>
              <div className="bg-navy-900 text-white p-5 border-b-4 border-brand-500">
                <p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
                <p className="font-heading text-4xl mt-1">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(([value, label]) => {
            const count = value === 'all' ? mine.length : mine.filter((b) => b.status === value).length
            return (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`px-4 py-2 font-heading uppercase tracking-wider text-sm transition-all ${
                  tab === value ? 'bg-brand-600 text-white' : 'bg-mist text-navy-950 hover:text-brand-500'
                }`}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>

        {shown.length === 0 ? (
          <EmptyState
            title={mine.length === 0 ? 'No bookings yet' : 'Nothing in this tab'}
            text={mine.length === 0 ? 'Pick a creator and book your first ad slot.' : 'Switch tabs to see your other bookings.'}
            action={mine.length === 0 && <Button to="/creators">Browse creators</Button>}
          />
        ) : (
          <div key={tab} className="space-y-4 fade-in">
            {shown.map((b) => {
              const creator = creators.find((c) => c.id === b.creatorId)
              return (
                <article key={b.id} className={`bg-paper border border-line border-l-4 ${stripe[b.status] || ''} p-5 flex flex-col md:flex-row gap-5 lift`}>
                  <div className="w-full md:w-32 h-24 shrink-0 bg-mist overflow-hidden">
                    {b.adImageUrl ? <img src={b.adImageUrl} alt="" className="w-full h-full object-cover" /> : <div className="h-full grid place-items-center text-xs text-muted">Text only</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl text-navy-950 normal-case">{b.headline}</h3>
                      <StatusBadge status={b.status} />
                      <StatusBadge status={b.paymentStatus} />
                    </div>
                    <p className="text-sm text-muted mt-1">
                      <Link to={`/creators/${b.creatorId}`} className="text-navy-950 font-semibold hover:text-brand-500">{creator?.name || 'Creator'}</Link> · {b.tierName} · {formatDate(b.slotDate)}
                    </p>
                    {b.feedbackNote && (
                      <p className={`mt-3 text-xs p-3 border ${b.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-sky-50 border-sky-200 text-sky-900'}`}>
                        <strong>Creator feedback:</strong> {b.feedbackNote}
                      </p>
                    )}
                    {b.status === 'approved' && <p className="text-xs text-muted mt-2">{b.clicks || 0} clicks so far</p>}
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                    <p className="font-heading text-3xl text-brand-500">{money(b.amount)}</p>
                    <div className="flex gap-2">
                      {b.status === 'revision_requested' && <Button to={`/submit/${b.id}`} size="sm">Edit and resubmit</Button>}
                      <Button to={`/receipt/${b.id}`} variant="outline" size="sm">Receipt</Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

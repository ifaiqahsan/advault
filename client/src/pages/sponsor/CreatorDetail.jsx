import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Calendar from '../../components/ui/Calendar'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { compact, formatDate, money, todayKey, typeLabel } from '../../utils/format'

const socials = [['twitter', 'X'], ['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['youtube', 'YouTube']]

export default function CreatorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { creators, tiers, slotMap } = useData()

  const creator = creators.find((c) => c.id === id)
  const list = tiers.filter((t) => t.creatorId === id)

  const [tierId, setTierId] = useState('')
  const [date, setDate] = useState('')

  if (!creator) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <EmptyState title="Creator not found" text="This profile does not exist or was removed." action={<Button to="/creators">Browse creators</Button>} />
      </section>
    )
  }

  const tier = list.find((t) => t.id === tierId) || list[0]
  const map = slotMap(id)
  const isCreator = user?.role === 'creator'

  const pick = (key, status) => {
    if (status === 'open') setDate(key)
  }

  return (
    <>
      <section className="relative bg-navy-950 overflow-hidden">
        {creator.img && <img src={creator.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-800/60" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 flex flex-col md:flex-row gap-8 md:items-center">
          <div className="w-40 h-40 shrink-0 bg-navy-900 border-4 border-brand-500 overflow-hidden">
            {creator.img ? (
              <img src={creator.img} alt={creator.name} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full grid place-items-center font-heading text-7xl text-white/30">{creator.name.charAt(0)}</div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 font-heading uppercase tracking-wider text-sm text-white">
              <Link to="/creators" className="hover:text-brand-500 transition">Creators</Link>
              <span className="text-brand-500">/</span>
              <span>{typeLabel[creator.type] || creator.type}</span>
              {creator.verified && <span className="bg-white text-approved text-xs font-bold px-2 py-0.5">Verified</span>}
            </div>
            <h1 className="text-5xl md:text-6xl text-white mt-2">{creator.name}</h1>
            <p className="text-white/75 mt-3 max-w-2xl">{creator.bio}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-5 text-white">
              <span className="font-heading text-2xl">{compact(creator.audienceSize)} <span className="text-sm text-white/60 uppercase tracking-wider">audience</span></span>
              {creator.website && (
                <a href={creator.website} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline self-center text-sm">{creator.website.replace(/^https?:\/\//, '')}</a>
              )}
              {socials.filter(([k]) => creator.social?.[k]).map(([k, label]) => (
                <a key={k} href={creator.social[k]} target="_blank" rel="noreferrer" className="text-white/70 hover:text-brand-500 self-center text-sm transition">{label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="hatch" />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-4xl text-navy-950 mb-2">Ad Tiers</h2>
          <p className="text-muted mb-6">Choose the placement that fits your campaign, then pick an open date.</p>

          {list.length === 0 ? (
            <EmptyState title="No tiers yet" text="This creator has not published any ad slots. Check back soon." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {list.map((t) => {
                const active = tier?.id === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTierId(t.id)}
                    className={`text-left p-6 border-2 border-t-4 bg-paper transition-all duration-200 lift ${
                      active ? 'border-brand-500 bg-brand-50' : 'border-line border-t-navy-900 hover:border-brand-500/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-2xl text-navy-950 normal-case">{t.name}</h3>
                      <span className={`shrink-0 w-6 h-6 grid place-items-center border-2 text-xs transition ${active ? 'bg-brand-500 border-brand-500 text-white' : 'border-line text-transparent'}`}>✓</span>
                    </div>
                    <p className="font-heading text-5xl font-bold text-brand-500 my-2">{money(t.price)}</p>
                    <p className="text-sm text-muted mb-4">{t.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-mist p-3 border border-line mb-4">
                      <div><span className="block text-muted uppercase font-bold tracking-wider text-[10px]">Word limit</span>{t.wordLimit} words</div>
                      <div><span className="block text-muted uppercase font-bold tracking-wider text-[10px]">Image</span>{t.imageSize}</div>
                    </div>
                    <ul className="space-y-1">
                      {t.perks.map((p) => (
                        <li key={p} className="text-xs text-ink/85 flex gap-2"><span className="text-brand-500 font-bold">✓</span>{p}</li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 self-start space-y-4">
          <Calendar selectedDate={date} onSelectDate={pick} statusMap={map} minDate={todayKey()} />

          <div className="bg-navy-900 text-white p-6 border-t-4 border-brand-500">
            <h3 className="text-xl mb-4">Your Booking</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-white/60">Tier</dt><dd className="text-right">{tier?.name || '-'}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/60">Date</dt><dd>{date ? formatDate(date) : 'Select an open date'}</dd></div>
              <div className="flex justify-between gap-4 pt-3 border-t border-white/10"><dt className="text-white/60">Total</dt><dd className="font-heading text-3xl text-brand-500">{tier ? money(tier.price) : '-'}</dd></div>
            </dl>
            {isCreator ? (
              <p className="text-xs text-white/60 mt-4">Log in with a sponsor account to book this slot.</p>
            ) : (
              <Button className="w-full mt-5" size="lg" disabled={!tier || !date} onClick={() => navigate(`/book/${tier.id}?date=${date}`)}>
                {user ? 'Continue to checkout' : 'Log in to book'}
              </Button>
            )}
          </div>
        </aside>
      </section>
    </>
  )
}

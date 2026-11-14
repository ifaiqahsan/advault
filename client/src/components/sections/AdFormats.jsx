import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import SectionTitle from '../ui/SectionTitle'
import { mockTiers } from '../../data/mockTiers'
import { money } from '../../utils/format'

const formats = mockTiers
  .filter((t) => t.creatorId === 'creator-1')
  .sort((a, b) => a.price - b.price)

export default function AdFormats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle ghost="Pricing" eyebrow="Example tiers" title="Choose an Ad Format" />
      <div className="grid gap-6 md:grid-cols-3">
        {formats.map((t, i) => {
          const hot = i === 1
          return (
            <Reveal key={t.id} delay={i * 120}>
              <div
                className={`relative p-8 h-full border-b-4 lift ${
                  hot ? 'bg-navy-900 text-white border-brand-500' : 'bg-mist text-navy-950 border-brand-500/30 hover:border-brand-500'
                }`}
              >
                {hot && <span className="absolute top-0 right-0 bg-brand-600 text-white font-heading uppercase tracking-wider text-xs px-3 py-1.5">Most booked</span>}
                <h3 className="text-2xl pr-20">{t.name}</h3>
                <p className="font-heading text-6xl font-bold text-brand-500 my-4">{money(t.price)}</p>
                <ul className="space-y-2 text-sm opacity-85 mb-6">
                  <li>{t.wordLimit} word limit</li>
                  <li>{/none/i.test(t.imageSize) ? 'Text and link only' : t.imageSize}</li>
                  {t.perks.slice(0, 2).map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link to="/creators" className="font-heading uppercase tracking-wider text-brand-500 hover:underline">
                  Find a creator
                </Link>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

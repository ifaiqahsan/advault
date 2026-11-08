import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import SectionTitle from '../ui/SectionTitle'

const adTiers = [
  { name: 'Classified', price: '$50', list: ['50 word limit', 'Text and link only', 'Great for launches'] },
  { name: 'Featured', price: '$150', list: ['120 word limit', '600x300 image', 'Top-of-issue position'], hot: true },
  { name: 'Headline', price: '$300', list: ['200 word limit', '1200x600 banner', 'Exclusive slot'] },
]

export default function AdFormats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle ghost="Pricing" eyebrow="Example tiers" title="Choose an Ad Format" />
      <div className="grid gap-6 md:grid-cols-3">
        {adTiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 120}>
            <div
              className={`p-8 h-full border-b-4 transition hover:-translate-y-1 ${
                t.hot
                  ? 'bg-navy-900 text-white border-brand-500'
                  : 'bg-mist text-navy-950 border-brand-500/30 hover:border-brand-500'
              }`}
            >
              <h3 className="text-2xl">{t.name}</h3>
              <p className="font-heading text-5xl font-bold text-brand-500 my-4">{t.price}</p>
              <ul className="space-y-2 text-sm opacity-80 mb-6">
                {t.list.map((l) => (
                  <li key={l}>— {l}</li>
                ))}
              </ul>
              <Link to="/creators" className="font-heading uppercase tracking-wider text-brand-500 hover:underline">
                Find a creator →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
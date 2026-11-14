import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import SectionTitle from '../ui/SectionTitle'
import { img } from '../../utils/format'

const steps = [
  { n: '01', title: 'Setup & Tiers', text: 'Creators build a media profile and set ad tiers with price, word limit and image size.', img: img('photo-1498050108023-c5249f4df085'), to: '/register', cta: 'Start as creator' },
  { n: '02', title: 'Book & Checkout', text: 'Sponsors pick an open date, upload their creative and pay with sandbox checkout.', img: img('photo-1522071820081-009f0129c71c'), to: '/creators', cta: 'Browse creators' },
  { n: '03', title: 'Review Queue', text: 'Creators approve, reject or request revisions on every submission.', img: img('photo-1488190211105-8b0e65b80b4e'), to: '/process', cta: 'See the process' },
  { n: '04', title: 'Fulfilment', text: 'Slots lock automatically, receipts are emailed and clicks are tracked.', img: img('photo-1551288049-bebda4e38f71'), to: '/pricing', cta: 'View pricing' },
]

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle ghost="Process" eyebrow="4 simple stages" title="How It Works" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 120}>
            <article className="group bg-mist h-full border-b-4 border-brand-500/30 hover:border-brand-500 lift">
              <div className="relative overflow-hidden">
                <img src={s.img} alt={s.title} className="h-44 w-full object-cover group-hover:scale-110 transition duration-700" />
                <span className="absolute top-0 left-0 bg-brand-600 text-white font-heading text-2xl font-bold px-3 py-1">{s.n}</span>
              </div>
              <div className="p-5">
                <h3 className="text-2xl text-navy-950">{s.title}</h3>
                <p className="text-muted text-sm mt-2 mb-4">{s.text}</p>
                <Link to={s.to} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-950 hover:text-brand-500 transition">
                  {s.cta} <span className="text-brand-500 text-lg leading-none group-hover:translate-x-1 transition">+</span>
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Reveal from '../../components/ui/Reveal'
import SectionTitle from '../../components/ui/SectionTitle'

const img = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

const steps = [
  { n: '01', title: 'Setup & Tiers', text: 'Creators build a media profile and set ad tiers with price, word limit and image size.', img: img('photo-1498050108023-c5249f4df085') },
  { n: '02', title: 'Book & Checkout', text: 'Sponsors pick an open date, upload their creative and pay with sandbox checkout.', img: img('photo-1522071820081-009f0129c71c') },
  { n: '03', title: 'Review Queue', text: 'Creators approve, reject or request revisions on every submission.', img: img('photo-1488190211105-8b0e65b80b4e') },
  { n: '04', title: 'Fulfilment', text: 'Slots lock automatically, receipts are issued and clicks are tracked.', img: img('photo-1551288049-bebda4e38f71') },
]

const creators = [
  { id: 1, name: 'The Daily Byte', type: 'Newsletter', price: 'From $120', img: img('photo-1488190211105-8b0e65b80b4e') },
  { id: 2, name: 'Code & Coffee', type: 'Podcast', price: 'From $200', img: img('photo-1478737270239-2f02b77fc618') },
  { id: 3, name: 'OpenKit', type: 'Open Source', price: 'From $80', img: img('photo-1498050108023-c5249f4df085') },
  { id: 4, name: 'Startup Weekly', type: 'Newsletter', price: 'From $150', img: img('photo-1522071820081-009f0129c71c') },
  { id: 5, name: 'Dev Talks', type: 'Podcast', price: 'From $180', img: img('photo-1590602847861-f357a9332bbc') },
  { id: 6, name: 'NodePulse', type: 'Open Source', price: 'From $60', img: img('photo-1555066931-4365d14bab8c') },
]

const adTiers = [
  { name: 'Classified', price: '$50', list: ['50 word limit', 'Text and link only', 'Great for launches'] },
  { name: 'Featured', price: '$150', list: ['120 word limit', '600x300 image', 'Top-of-issue position'], hot: true },
  { name: 'Headline', price: '$300', list: ['200 word limit', '1200x600 banner', 'Exclusive slot'] },
]

const reviews = [
  { text: 'I replaced three agency emails with one booking link. Sponsors pick a date, pay, and I just review the copy.', name: 'Megan Carter', role: 'Writer, The Daily Byte' },
  { text: 'The calendar locks dates the moment someone books. No more double-booked episodes.', name: 'Omar Siddiqui', role: 'Host, Code & Coffee' },
  { text: 'Clear pricing and a real preview of my ad before it goes live. I know exactly what I am paying for.', name: 'Lena Fischer', role: 'Marketing Lead, Stackly' },
]

const posts = [
  { date: '24', month: 'Nov', tag: 'Creators', title: 'How to price your first newsletter ad slot', img: img('photo-1499750310107-5fef28a66643') },
  { date: '18', month: 'Nov', tag: 'Sponsors', title: 'Writing ad copy that fits a 60-word limit', img: img('photo-1455390582262-044cdead277a') },
]

const stats = [['120+', 'Creators'], ['860', 'Slots Booked'], ['98%', 'On-time Delivery']]

function ReadMore({ to = '/creators' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-950 hover:text-brand-500 transition">
      Read More <span className="text-brand-500 text-lg leading-none">+</span>
    </Link>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-navy-950 overflow-hidden">
      <img
        src={img('photo-1522202176988-66273c2fd55f', 1600)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/80 to-navy-800/60" />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-24">
        <p className="flex items-center gap-3 text-white font-heading uppercase tracking-widest text-sm mb-4">
          <span className="w-10 h-0.5 bg-brand-500" /> Direct Sponsorship Portal
        </p>

        <h1 className="font-extrabold leading-[0.9] text-7xl md:text-9xl">
          <span className="block text-brand-500">Sell Ads.</span>
          <span className="block outline-fill">Directly.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg text-white/75">
          Newsletter writers, podcasters and open-source developers sell ad space straight to sponsors. No middlemen, no commission.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/creators" className="bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider text-lg px-8 py-4 transition">
            Browse Creators
          </Link>
          <Link to="/register" className="border-2 border-white/70 hover:bg-white hover:text-navy-950 text-white font-heading uppercase tracking-wider text-lg px-8 py-4 transition">
            Become a Creator
          </Link>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-24">
      <SectionTitle ghost="Process" eyebrow="4 simple stages" title="How It Works" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 120}>
            <article className="group bg-mist h-full border-b-4 border-brand-500/30 hover:border-brand-500 transition">
              <div className="overflow-hidden">
                <img src={s.img} alt={s.title} className="h-44 w-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <span className="font-heading text-brand-500 text-xl">{s.n}</span>
                <h3 className="text-2xl text-navy-950 mt-1">{s.title}</h3>
                <p className="text-muted text-sm mt-2 mb-4">{s.text}</p>
                <ReadMore to="/register" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-2 items-center">
        <Reveal>
          <SectionTitle ghost="About Us" eyebrow="Why AdVault" title="Built for Independent Creators" />
          <p className="font-semibold text-navy-950 mb-3">
            Agencies take a cut and slow everything down. AdVault lets you sell ad space on your own terms.
          </p>
          <p className="text-muted mb-4">
            Set your tiers, open the dates you want and let sponsors book themselves. Payments are held in escrow: authorised at checkout and captured only after you approve the creative.
          </p>
          <ul className="space-y-2 text-navy-950 mb-8">
            {[
              'Role-based Creator and Sponsor dashboards',
              'Calendar that locks booked dates',
              'Approve, reject or request revisions',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-500" />
                {t}
              </li>
            ))}
          </ul>
          <Link to="/register" className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-7 py-3 transition">
            Join Now
          </Link>
        </Reveal>

        <Reveal delay={150} className="relative">
          <img src={img('photo-1552664730-d307ca884978', 1000)} alt="Team planning sponsorships" className="w-full h-[460px] object-cover" />
          <div className="absolute bottom-0 left-0 bg-navy-800 text-white px-8 py-6 text-center">
            <p className="font-heading text-4xl font-bold">2026</p>
            <p className="tracking-[0.4em] text-xs">SINCE</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Creators() {
  const [filter, setFilter] = useState('All')
  const types = ['All', 'Newsletter', 'Podcast', 'Open Source']
  const shown = filter === 'All' ? creators : creators.filter((c) => c.type === filter)

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle ghost="Creators" eyebrow="Featured" title="Top Creators" />
        <div className="flex gap-5 mb-12">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-sm font-semibold transition ${
                filter === t ? 'text-brand-500' : 'text-navy-950 hover:text-brand-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <Link to={`/creators/${c.id}`} className="group block bg-mist border-b-4 border-brand-500/30 hover:border-brand-500 transition">
              <div className="overflow-hidden">
                <img src={c.img} alt={c.name} className="h-56 w-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl text-navy-950">{c.name}</h3>
                <p className="text-sm text-revision mt-1">
                  {c.type} · <span className="text-muted">{c.price}</span>
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function CtaStats() {
  return (
    <section className="relative bg-navy-800">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32">
        <Reveal>
          <SectionTitle light ghost="Let's Chat" title="Ready to Fill Your Next Slot?" />
          <p className="max-w-xl text-white/75 mb-8">
            Create a free creator profile in minutes, or find the perfect audience for your next campaign.
          </p>
          <Link to="/register" className="inline-block bg-white text-navy-950 font-heading uppercase tracking-wider px-7 py-3 hover:bg-brand-500 hover:text-white transition">
            Get Started
          </Link>
        </Reveal>
      </div>

      <div className="mx-auto max-w-4xl px-6 -mb-12 relative">
        <div className="bg-brand-600 grid grid-cols-3 text-center text-white py-8 shadow-xl">
          {stats.map(([n, l]) => (
            <div key={l}>
              <p className="font-heading text-4xl md:text-5xl font-bold">{n}</p>
              <p className="text-xs md:text-sm uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AdTiers() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-36 pb-24">
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

function Testimonials() {
  const [i, setI] = useState(0)
  const r = reviews[i]
  const go = (d) => setI((i + d + reviews.length) % reviews.length)

  return (
    <section className="bg-navy-800">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <SectionTitle light ghost="Feedback" title="Testimonials" />
        <Reveal>
          <p className="font-heading text-7xl text-brand-500 leading-none">“</p>
          <p className="text-xl text-white/85 min-h-28">{r.text}</p>
          <div className="mt-6 border-l-2 border-brand-500 pl-4 text-white">
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm text-white/60">{r.role}</p>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            {[['‹', -1], ['›', 1]].map(([s, d]) => (
              <button
                key={s}
                onClick={() => go(d)}
                aria-label={d < 0 ? 'Previous' : 'Next'}
                className="w-9 h-9 rounded-full border border-white/40 text-white hover:bg-brand-500 hover:border-brand-500 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="hatch" />
    </section>
  )
}

function Blog() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle ghost="Our Blog" eyebrow="Tips" title="Latest News" />
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((p, i) => (
          <Reveal key={p.title} delay={i * 120}>
            <article className="group bg-navy-800">
              <div className="relative overflow-hidden">
                <img src={p.img} alt={p.title} className="h-56 w-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-0 left-0 bg-brand-600 text-white text-center px-3 py-2">
                  <p className="font-heading text-xl font-bold leading-none">{p.date}</p>
                  <p className="text-xs">{p.month}</p>
                </div>
              </div>
              <div className="p-6 text-white">
                <p className="text-xs text-white/60 border-l border-brand-500 pl-2">{p.tag}</p>
                <h3 className="text-2xl normal-case mt-2">{p.title}</h3>
                <Link to="/creators" className="text-brand-500 text-xs font-semibold mt-3 inline-block hover:underline">
                  READ MORE »
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function Landing() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <Hero />
      <HowItWorks />
      <About />
      <Creators />
      <CtaStats />
      <AdTiers />
      <Testimonials />
      <Blog />
    </>
  )
}
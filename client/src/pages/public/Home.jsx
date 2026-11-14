import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../../components/ui/Reveal'
import SectionTitle from '../../components/ui/SectionTitle'
import CreatorCard from '../../components/ui/CreatorCard'
import HowItWorks from '../../components/sections/HowItWorks'
import AdFormats from '../../components/sections/AdFormats'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { img, lowestPrice, money } from '../../utils/format'

const actionsByRole = {
  guest: [{ to: '/creators', label: 'Browse Creators' }, { to: '/register', label: 'Join as Creator' }],
  sponsor: [{ to: '/creators', label: 'Browse Creators' }, { to: '/my-bookings', label: 'View Bookings' }],
  creator: [{ to: '/creator/dashboard', label: 'Open Dashboard' }, { to: '/creator/tiers', label: 'Manage Tiers' }],
}

const ctaByRole = {
  guest: { title: 'Ready to Fill Your Next Slot?', text: 'Create a free account in minutes, or find the perfect audience for your next campaign.', to: '/register', label: 'Sign Up' },
  sponsor: { title: 'Find Your Next Audience', text: 'Pick a creator, choose an open date and submit your ad.', to: '/creators', label: 'Browse Creators' },
  creator: { title: 'Keep Your Calendar Full', text: 'Open more dates and let sponsors book them directly.', to: '/creator/availability', label: 'Open Calendar' },
}

const reviews = [
  { text: 'I replaced three agency emails with one booking link. Sponsors pick a date, pay, and I just review the copy.', name: 'Megan Carter', role: 'Writer, The Daily Byte' },
  { text: 'The calendar locks dates the moment someone books. No more double-booked episodes.', name: 'Omar Siddiqui', role: 'Host, Code & Coffee' },
  { text: 'Clear pricing and a real preview of my ad before it goes live. I know exactly what I am paying for.', name: 'Lena Fischer', role: 'Marketing Lead, Stackly' },
]

const posts = [
  { date: '24', month: 'Nov', tag: 'Creators', title: 'How to price your first newsletter ad slot', img: img('photo-1499750310107-5fef28a66643'), to: '/pricing' },
  { date: '18', month: 'Nov', tag: 'Sponsors', title: 'Writing ad copy that fits a 60-word limit', img: img('photo-1455390582262-044cdead277a'), to: '/process' },
]

const filters = [['all', 'All'], ['newsletter', 'Newsletter'], ['podcast', 'Podcast'], ['opensource', 'Open Source']]

const primary = 'bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider text-lg px-8 py-4 transition'
const outline = 'border-2 border-white/70 hover:bg-white hover:text-navy-950 text-white font-heading uppercase tracking-wider text-lg px-8 py-4 transition'

function Hero() {
  const { user, role } = useAuth()
  const [first, second] = actionsByRole[role] || actionsByRole.guest

  return (
    <section className="relative min-h-[85vh] flex items-center bg-navy-950 overflow-hidden">
      <img src={img('photo-1522202176988-66273c2fd55f', 1600)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/80 to-navy-800/60" />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-24">
        <p className="flex items-center gap-3 text-white font-heading uppercase tracking-widest text-sm mb-4">
          <span className="w-10 h-0.5 bg-brand-500" />
          {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Direct Sponsorship Portal'}
        </p>
        <h1 className="font-extrabold leading-[0.9] text-7xl md:text-9xl">
          <span className="block text-brand-500">Sell Ads.</span>
          <span className="block outline-fill">Directly.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-white/75">
          Newsletter writers, podcasters and open-source developers sell ad space straight to sponsors. No middlemen, no commission.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to={first.to} className={primary}>{first.label}</Link>
          <Link to={second.to} className={outline}>{second.label}</Link>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 hatch" />
    </section>
  )
}

function About() {
  const { user } = useAuth()

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
            {['Role-based Creator and Sponsor dashboards', 'Calendar that locks booked dates', 'Approve, reject or request revisions'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-500" />
                {t}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            {!user && (
              <Link to="/register" className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-7 py-3 transition">
                Join Now
              </Link>
            )}
            <Link to="/about" className="inline-block border-2 border-navy-950 hover:bg-navy-950 hover:text-white text-navy-950 font-heading uppercase tracking-wider px-7 py-3 transition">
              Read More
            </Link>
          </div>
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

function TopCreators() {
  const { creators, tiers } = useData()
  const [filter, setFilter] = useState('all')
  const shown = (filter === 'all' ? creators : creators.filter((c) => c.type === filter)).slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle ghost="Creators" eyebrow="Featured" title="Top Creators" />
        <div className="flex flex-wrap gap-5 mb-12">
          {filters.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`text-sm font-semibold border-b-2 pb-1 transition ${
                filter === value ? 'text-brand-500 border-brand-500' : 'text-navy-950 border-transparent hover:text-brand-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div key={filter} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-in">
        {shown.map((c) => (
          <CreatorCard key={c.id} creator={c} from={lowestPrice(tiers, c.id)} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/creators" className="font-heading uppercase tracking-wider text-brand-500 hover:underline">
          See all creators
        </Link>
      </div>
    </section>
  )
}

function CtaStats() {
  const { role } = useAuth()
  const { creators, bookings, tiers } = useData()
  const cta = ctaByRole[role] || ctaByRole.guest
  const average = tiers.length ? Math.round(tiers.reduce((s, t) => s + Number(t.price), 0) / tiers.length) : 0
  const stats = [[String(creators.length), 'Creators'], [String(bookings.length), 'Slots Booked'], [money(average), 'Avg. Slot Price']]

  return (
    <section className="relative bg-navy-800">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32">
        <Reveal>
          <SectionTitle light ghost="Let's Chat" title={cta.title} />
          <p className="max-w-xl text-white/75 mb-8">{cta.text}</p>
          <Link to={cta.to} className="inline-block bg-white text-navy-950 font-heading uppercase tracking-wider px-7 py-3 hover:bg-brand-500 hover:text-white transition">
            {cta.label}
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

function Testimonials() {
  const [i, setI] = useState(0)
  const r = reviews[i]
  const go = (d) => setI((v) => (v + d + reviews.length) % reviews.length)

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 7000)
    return () => clearInterval(t)
  }, [i])

  return (
    <section className="bg-navy-800 mt-12">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <SectionTitle light ghost="Feedback" title="Testimonials" />
        <div key={i} className="fade-in">
          <p className="font-heading text-7xl text-brand-500 leading-none">“</p>
          <p className="text-xl text-white/85 min-h-28">{r.text}</p>
          <div className="mt-6 border-l-2 border-brand-500 pl-4 text-white">
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm text-white/60">{r.role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {reviews.map((_, n) => (
              <span key={n} className={`h-1 transition-all duration-300 ${n === i ? 'w-8 bg-brand-500' : 'w-4 bg-white/30'}`} />
            ))}
          </div>
          <div className="flex gap-3">
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
        </div>
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
            <article className="group bg-navy-800 lift">
              <div className="relative overflow-hidden">
                <img src={p.img} alt={p.title} className="h-56 w-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-0 left-0 bg-brand-600 text-white text-center px-3 py-2">
                  <p className="font-heading text-xl font-bold leading-none">{p.date}</p>
                  <p className="text-xs">{p.month}</p>
                </div>
              </div>
              <div className="p-6 text-white">
                <p className="text-xs text-white/60 border-l border-brand-500 pl-2">{p.tag}</p>
                <h3 className="text-2xl normal-case mt-2">{p.title}</h3>
                <Link to={p.to} className="text-brand-500 text-xs font-semibold mt-3 inline-block hover:underline">
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

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <About />
      <TopCreators />
      <CtaStats />
      <AdFormats />
      <Testimonials />
      <Blog />
    </>
  )
}

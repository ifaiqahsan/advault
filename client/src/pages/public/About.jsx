import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'
import SectionTitle from '../../components/ui/SectionTitle'
import Reveal from '../../components/ui/Reveal'
import GuestCta from '../../components/sections/GuestCta'
import { img } from '../../utils/format'

const values = [
  { title: 'Direct Deals', text: 'Creators and sponsors deal with each other. No agency in the middle and no commission on the slot price.' },
  { title: 'Escrow Payments', text: 'The sponsor is only charged for real once the creator approves the creative. Rejected ads are released automatically.' },
  { title: 'Clear Calendars', text: 'Booked dates lock instantly, so two sponsors can never buy the same slot.' },
]

const team = [
  { name: 'Faiq Ahsan', role: 'Full-stack developer', tag: '23L-0753' },
  { name: 'Shayan Qadir', role: 'Front-end developer', tag: 'Creator studio' },
]

export default function About() {
  return (
    <>
      <PageHero eyebrow="Who we are" title="About Us" text="AdVault is a self-serve sponsorship portal built for independent digital creators." />

      <section className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-2 items-center">
        <Reveal>
          <SectionTitle ghost="About Us" title="Who We Are" />
          <p className="font-semibold text-navy-950 mb-3">
            Independent creators lose time and money to long email threads and high middleman fees.
          </p>
          <p className="text-muted mb-8">
            AdVault replaces that with a four-stage portal: setup and customisation, self-serve booking and checkout, a creator review queue, and automated fulfilment with click analytics.
          </p>
          <Link to="/process" className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider px-7 py-3 transition">
            See the process
          </Link>
        </Reveal>
        <Reveal delay={150} className="relative">
          <img src={img('photo-1552664730-d307ca884978', 1000)} alt="Team at work" className="w-full h-[420px] object-cover" />
          <div className="absolute bottom-0 left-0 bg-navy-800 text-white px-8 py-6 text-center">
            <p className="font-heading text-4xl font-bold">2026</p>
            <p className="tracking-[0.4em] text-xs">SINCE</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-navy-800">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionTitle light ghost="Values" eyebrow="What we stand for" title="Our Principles" />
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="h-full bg-navy-900 p-8 border-l-4 border-brand-500 lift">
                  <h3 className="text-2xl text-white">{v.title}</h3>
                  <p className="text-white/70 mt-3 text-sm">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="hatch" />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionTitle ghost="Experts" eyebrow="Project team" title="Our Team" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 120}>
              <div className="group bg-mist border-b-4 border-brand-500/30 hover:border-brand-500 lift">
                <div className="h-56 bg-navy-900 grid place-items-center overflow-hidden">
                  <span className="font-heading text-8xl text-white/20 group-hover:text-brand-500 group-hover:scale-110 transition duration-500">
                    {m.name.split(' ').map((p) => p[0]).join('')}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-brand-600 text-xs font-heading uppercase tracking-wider border-l-2 border-brand-500 pl-2">{m.role}</p>
                  <h3 className="text-2xl text-navy-950 mt-2">{m.name}</h3>
                  <p className="text-sm text-muted">{m.tag}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <GuestCta />
    </>
  )
}

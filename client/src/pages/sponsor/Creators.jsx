import { useMemo, useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import CreatorCard from '../../components/ui/CreatorCard'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { useData } from '../../context/DataContext'
import { lowestPrice } from '../../utils/format'

const types = [['all', 'All'], ['newsletter', 'Newsletters'], ['podcast', 'Podcasts'], ['opensource', 'Open Source']]

export default function Creators() {
  const { creators, tiers } = useData()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('popular')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = creators
      .map((c) => ({ ...c, from: lowestPrice(tiers, c.id) }))
      .filter((c) => (type === 'all' || c.type === type) && (!q || `${c.name} ${c.bio}`.toLowerCase().includes(q)))

    if (sort === 'low') rows.sort((a, b) => (a.from || 1e9) - (b.from || 1e9))
    if (sort === 'high') rows.sort((a, b) => b.from - a.from)
    if (sort === 'popular') rows.sort((a, b) => b.audienceSize - a.audienceSize)
    return rows
  }, [creators, tiers, query, type, sort])

  const reset = () => {
    setQuery('')
    setType('all')
    setSort('popular')
  }

  return (
    <>
      <PageHero eyebrow="Find your audience" title="Our Creators" crumb="Creators" text="Browse newsletters, podcasts and open-source projects that sell ad space directly." />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-mist border-l-4 border-brand-500 p-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {types.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className={`px-4 py-2 font-heading uppercase tracking-wider text-sm transition-all duration-200 ${
                  type === value ? 'bg-brand-600 text-white' : 'bg-white text-navy-950 hover:text-brand-500 border border-line'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators"
              aria-label="Search creators"
              className="px-4 py-2.5 text-sm bg-white border border-line focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort creators"
              className="px-4 py-2.5 text-sm bg-white border border-line focus:outline-none focus:border-brand-500 transition"
            >
              <option value="popular">Largest audience</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-muted mt-6 mb-6">{list.length} creator{list.length === 1 ? '' : 's'} found</p>

        {list.length === 0 ? (
          <EmptyState
            title="No creators match"
            text="Try a different search term or clear the filters."
            action={<Button onClick={reset}>Clear filters</Button>}
          />
        ) : (
          <div key={`${type}-${sort}-${query}`} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-in">
            {list.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 80}>
                <CreatorCard creator={c} from={c.from} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

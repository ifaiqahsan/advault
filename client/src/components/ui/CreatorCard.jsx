import { Link } from 'react-router-dom'
import { compact, money, typeLabel } from '../../utils/format'

export default function CreatorCard({ creator, from }) {
  return (
    <Link to={`/creators/${creator.id}`} className="group block bg-paper border border-line overflow-hidden lift h-full">
      <div className="relative h-56 overflow-hidden bg-navy-900">
        {creator.img ? (
          <img src={creator.img} alt={creator.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
        ) : (
          <div className="h-full grid place-items-center font-heading text-8xl text-white/20">{creator.name.charAt(0)}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
        <span className="absolute top-0 left-0 bg-brand-600 text-white text-xs font-heading uppercase tracking-wider px-3 py-1.5">
          {typeLabel[creator.type] || creator.type}
        </span>
        {creator.verified && (
          <span className="absolute top-3 right-3 bg-white text-approved text-[11px] font-bold uppercase tracking-wider px-2 py-0.5">Verified</span>
        )}
        <p className="absolute bottom-3 left-4 text-white font-heading text-lg tracking-wide">{compact(creator.audienceSize)} audience</p>
      </div>
      <div className="p-5 border-b-4 border-brand-500/30 group-hover:border-brand-500 transition">
        <h3 className="text-2xl text-navy-950">{creator.name}</h3>
        <p className="text-sm text-muted mt-2 line-clamp-2 min-h-10">{creator.bio}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
          <span className="text-xs uppercase tracking-wider text-muted">Slots from</span>
          <span className="font-heading text-2xl font-bold text-brand-500">{from ? money(from) : 'Soon'}</span>
        </div>
      </div>
    </Link>
  )
}

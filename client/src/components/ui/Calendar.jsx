import { useState } from 'react'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const pad = (n) => String(n).padStart(2, '0')

const styles = {
  open: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
  locked: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200',
  booked: 'bg-brand-50 text-brand-600 border-brand-300 hover:bg-brand-100',
}

export default function Calendar({ selectedDate, onSelectDate, statusMap = {}, minDate = '', className = '' }) {
  const [cursor, setCursor] = useState(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), 1)
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const total = new Date(year, month + 1, 0).getDate()
  const offset = new Date(year, month, 1).getDay()

  const move = (step) => setCursor(new Date(year, month + step, 1))

  return (
    <div className={`bg-paper border border-line rounded-lg p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading text-2xl text-ink font-bold tracking-wide">
          {months[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => move(-1)} aria-label="Previous month" className="p-1.5 rounded-sm hover:bg-brand-50 hover:text-brand-500 text-ink transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next month" className="p-1.5 rounded-sm hover:bg-brand-50 hover:text-brand-500 text-ink transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold uppercase text-muted tracking-wider">
        {days.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div key={`${year}-${month}`} className="grid grid-cols-7 gap-2 fade-in">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14 sm:h-16" />
        ))}

        {Array.from({ length: total }).map((_, i) => {
          const day = i + 1
          const key = `${year}-${pad(month + 1)}-${pad(day)}`
          const status = statusMap[key] || 'open'
          const past = Boolean(minDate) && key < minDate
          const selected = selectedDate === key

          return (
            <button
              key={key}
              type="button"
              disabled={past}
              onClick={() => onSelectDate?.(key, status)}
              className={`h-14 sm:h-16 p-1.5 border rounded-sm flex flex-col justify-between items-start text-left transition-all duration-150 ${
                past ? 'bg-mist text-muted/50 border-line cursor-not-allowed' : `${styles[status]} cursor-pointer hover:-translate-y-0.5`
              } ${selected ? 'ring-2 ring-brand-500 ring-offset-1 font-bold scale-[1.03]' : ''}`}
            >
              <span className="text-sm font-heading font-bold">{day}</span>
              {!past && <span className="text-[10px] uppercase font-heading tracking-wide leading-none">{status}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

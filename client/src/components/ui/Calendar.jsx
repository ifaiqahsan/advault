import { useState } from 'react'

export default function Calendar({
  selectedDate,
  onSelectDate,
  slotStatusMap = {},
  className = '',
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const formatDateKey = (day) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const statusColors = {
    open: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
    locked: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200',
    booked: 'bg-brand-50 text-brand-600 border-brand-300 font-bold hover:bg-brand-100',
  }

  return (
    <div className={`bg-paper border border-line rounded-lg p-5 shadow-xs ${className}`}>
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading text-xl text-ink font-bold tracking-wide">
          {monthNames[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-1.5 rounded-sm hover:bg-mist text-ink transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="p-1.5 rounded-sm hover:bg-mist text-ink transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold uppercase text-muted tracking-wider">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14 sm:h-16" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateKey = formatDateKey(day)
          const status = slotStatusMap[dateKey] || 'open'
          const isSelected = selectedDate === dateKey

          const colorClass = statusColors[status] || statusColors.open

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate?.(dateKey, status)}
              className={`h-14 sm:h-16 p-1.5 border rounded-sm flex flex-col justify-between items-start transition cursor-pointer text-left relative ${colorClass} ${
                isSelected ? 'ring-2 ring-brand-500 ring-offset-1 font-bold' : ''
              }`}
            >
              <span className="text-xs font-mono">{day}</span>
              <span className="text-[10px] uppercase font-heading tracking-wide leading-tight px-1 py-0.5 rounded-xs bg-white/70">
                {status}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


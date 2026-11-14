import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Calendar from '../../components/ui/Calendar'
import Toast from '../../components/ui/Toast'
import StatusBadge from '../../components/ui/StatusBadge'
import useToast from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { dateKey, formatDate, money, todayKey } from '../../utils/format'
import AvailabilityLegend from './components/AvailabilityLegend'

export default function Availability() {
  const { user } = useAuth()
  const { bookings, slotMap, toggleLock, openAll } = useData()
  const { toast, show, clear } = useToast()
  const cid = user.creatorId

  const map = slotMap(cid)
  const today = todayKey()
  const [selected, setSelected] = useState(today)

  const status = map[selected] || 'open'
  const booking = bookings.find((b) => b.creatorId === cid && b.slotDate === selected && b.status !== 'rejected')

  const next30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return dateKey(d)
  })
  const counts = {
    open: next30.filter((k) => !map[k]).length,
    booked: next30.filter((k) => map[k] === 'booked').length,
    locked: next30.filter((k) => map[k] === 'locked').length,
  }

  const toggle = () => {
    if (status === 'booked') return show(`${formatDate(selected)} is booked and cannot be changed.`, 'error')
    toggleLock(cid, selected)
    show(status === 'open' ? `${formatDate(selected)} is now locked.` : `${formatDate(selected)} is now open for sponsors.`)
  }

  const reopen = () => {
    openAll(cid)
    show('All non-booked dates are open again.')
  }

  const cards = [
    ['Open days', counts.open, 'bg-emerald-500'],
    ['Booked slots', counts.booked, 'bg-brand-500'],
    ['Locked days', counts.locked, 'bg-slate-500'],
  ]

  return (
    <DashboardLayout
      title="Slot availability"
      subtitle="Select a date, then lock or open it. Booked dates are read-only."
      action={<Button variant="outline" onClick={reopen}>Open all non-booked dates</Button>}
    >
      <Toast toast={toast} onClose={clear} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map(([label, value, dot]) => (
          <div key={label} className="bg-paper border border-line p-4 flex items-center justify-between lift">
            <div>
              <span className="text-xs uppercase font-heading text-muted tracking-wider block">{label}</span>
              <span className="text-3xl font-bold font-heading text-ink">{value}</span>
              <span className="text-[11px] text-muted block">next 30 days</span>
            </div>
            <span className={`w-3 h-3 rounded-full ${dot}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar selectedDate={selected} onSelectDate={(k) => setSelected(k)} statusMap={map} minDate={today} />
        </div>

        <div className="space-y-6">
          <Card title="Slot inspector" subtitle={formatDate(selected)}>
            <div key={selected} className="space-y-4 fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-heading uppercase text-muted tracking-wider">Status</span>
                <StatusBadge status={status} />
              </div>

              {status === 'booked' ? (
                <div className="p-3 bg-brand-50 border-l-4 border-brand-500 text-xs space-y-1">
                  <p className="font-semibold text-ink">Confirmed sponsor reservation</p>
                  <p><strong>Sponsor:</strong> {booking?.sponsorName}</p>
                  <p><strong>Tier:</strong> {booking?.tierName}</p>
                  <p><strong>Amount:</strong> {money(booking?.amount)}</p>
                  <p className="text-brand-600 pt-1">This date is committed and cannot be toggled.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-ink/80 leading-relaxed">
                    {status === 'open' ? 'Sponsors can pick and purchase this date.' : 'Blackout date. Sponsors cannot select it.'}
                  </p>
                  <Button className="w-full" variant={status === 'open' ? 'secondary' : 'primary'} onClick={toggle}>
                    {status === 'open' ? 'Lock this date' : 'Open this date'}
                  </Button>
                </>
              )}
            </div>
          </Card>
          <AvailabilityLegend />
        </div>
      </div>
    </DashboardLayout>
  )
}

import { useState, useContext, useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Calendar from '../../components/ui/Calendar'
import { AuthContext } from '../../context/AuthContent'
import { mockBookings } from '../../data/mockBookings'
import AvailabilityLegend from './components/AvailabilityLegend'

/**
 * Availability Page Component
 * Allows creators to manage slot inventory by toggling dates between 'open' and 'locked'.
 * Booked dates with confirmed sponsor reservations are read-only and cannot be toggled.
 */
export default function Availability() {
  // 1. Current logged-in creator from AuthContext
  const auth = useContext(AuthContext)
  const currentCreator = auth?.user || { id: 'creator-1', name: 'TechBytes Weekly' }

  // 2. Extract confirmed bookings for this creator to lock in 'booked' slots
  const creatorBookings = useMemo(() => {
    return mockBookings.filter((b) => b.creatorId === currentCreator.id)
  }, [currentCreator.id])

  // 3. Initialize slotStatusMap in local state
  // Dates with active bookings are set to 'booked'. Other dates default to open or custom locked.
  const [slotStatusMap, setSlotStatusMap] = useState(() => {
    const initialMap = {}

    // Mark booked dates from mockBookings
    creatorBookings.forEach((b) => {
      if (b.slotDate) {
        initialMap[b.slotDate] = 'booked'
      }
    })

    // Sample locked dates (e.g. holiday blackout)
    initialMap['2026-11-26'] = 'locked' // Thanksgiving blackout
    initialMap['2026-11-27'] = 'locked'

    return initialMap
  })

  // Selected date in calendar view
  const [selectedDate, setSelectedDate] = useState('2026-11-15')

  // Notification message for actions or restrictions
  const [notice, setNotice] = useState(null)

  const showNotice = (msg, type = 'info') => {
    setNotice({ msg, type })
    setTimeout(() => {
      setNotice(null)
    }, 4500)
  }

  // 4. Click date handler to toggle open/locked
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr)
    const currentStatus = slotStatusMap[dateStr] || 'open'

    // RULE: Booked slots cannot be toggled (read-only)
    if (currentStatus === 'booked') {
      const booking = creatorBookings.find((b) => b.slotDate === dateStr)
      showNotice(
        `Date ${dateStr} is BOOKED by "${booking?.sponsorName || 'a sponsor'}". Booked slots cannot be locked or modified.`,
        'warning'
      )
      return
    }

    // Toggle between 'open' and 'locked'
    const newStatus = currentStatus === 'open' ? 'locked' : 'open'
    setSlotStatusMap((prev) => ({
      ...prev,
      [dateStr]: newStatus,
    }))

    showNotice(
      `Date ${dateStr} is now set to ${newStatus.toUpperCase()}. ${
        newStatus === 'open'
          ? 'Sponsors can now book this slot.'
          : 'This slot is now blacked out.'
      }`,
      'success'
    )
  }

  // Quick batch actions
  const handleUnlockMonth = () => {
    setSlotStatusMap((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (next[key] !== 'booked') {
          next[key] = 'open'
        }
      })
      return next
    })
    showNotice('All non-booked dates have been set to OPEN.', 'success')
  }

  // Selected date details
  const selectedStatus = slotStatusMap[selectedDate] || 'open'
  const linkedBooking = creatorBookings.find((b) => b.slotDate === selectedDate)

  // Status counters
  const counts = useMemo(() => {
    let openCount = 0
    let lockedCount = 0
    let bookedCount = 0

    // Count in current map
    Object.values(slotStatusMap).forEach((val) => {
      if (val === 'locked') lockedCount++
      if (val === 'booked') bookedCount++
    })

    // Approximate remaining days in month as open
    openCount = Math.max(0, 30 - lockedCount - bookedCount)

    return { openCount, lockedCount, bookedCount }
  }, [slotStatusMap])

  return (
    <DashboardLayout
      title="Slot Availability"
      subtitle="Click any date on your publication calendar to toggle between Open and Locked. Booked slots are read-only."
      action={
        <Button variant="outline" size="md" onClick={handleUnlockMonth}>
          Open All Non-Booked Dates
        </Button>
      }
    >
      {/* Notice Banner */}
      {notice && (
        <div
          className={`mb-6 p-4 rounded-sm border text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-150 ${
            notice.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {notice.type === 'warning' ? '⚠' : '✓'}
            </span>
            <span>{notice.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs uppercase font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-paper border border-line p-4 rounded-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-heading text-emerald-700 tracking-wider block font-semibold">
              Available Slots
            </span>
            <span className="text-2xl font-bold font-heading text-emerald-600">
              {counts.openCount} Days
            </span>
          </div>
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>

        <div className="bg-paper border border-line p-4 rounded-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-heading text-brand-600 tracking-wider block font-semibold">
              Confirmed Booked
            </span>
            <span className="text-2xl font-bold font-heading text-brand-500">
              {counts.bookedCount} Slots
            </span>
          </div>
          <span className="w-3 h-3 rounded-full bg-brand-500" />
        </div>

        <div className="bg-paper border border-line p-4 rounded-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-heading text-slate-600 tracking-wider block font-semibold">
              Locked / Blackout
            </span>
            <span className="text-2xl font-bold font-heading text-slate-700">
              {counts.lockedCount} Days
            </span>
          </div>
          <span className="w-3 h-3 rounded-full bg-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar View */}
        <div className="lg:col-span-2">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleDateClick}
            slotStatusMap={slotStatusMap}
          />
        </div>

        {/* Selected Date Inspector & Legend */}
        <div className="space-y-6">
          <Card
            title="Slot Inspector"
            subtitle={`Selected date: ${selectedDate}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-heading uppercase text-muted tracking-wider">
                  Current Status
                </span>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    selectedStatus === 'booked'
                      ? 'bg-brand-50 text-brand-600 border-brand-300'
                      : selectedStatus === 'locked'
                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  ● {selectedStatus}
                </span>
              </div>

              {/* Slot Details */}
              {selectedStatus === 'booked' ? (
                <div className="p-3 bg-brand-50/50 rounded-sm border border-brand-200 text-xs space-y-1.5">
                  <div className="font-semibold text-brand-900">
                    Confirmed Sponsor Reservation
                  </div>
                  <div className="text-ink/80">
                    <strong>Sponsor:</strong> {linkedBooking?.sponsorName || 'Verified Sponsor'}
                  </div>
                  <div className="text-ink/80">
                    <strong>Tier:</strong> {linkedBooking?.tierName || 'Standard Tier'}
                  </div>
                  <div className="text-ink/80">
                    <strong>Amount:</strong> ${linkedBooking?.amount || 0}
                  </div>
                  <p className="text-[11px] text-brand-700 pt-1 border-t border-brand-200/60">
                    🔒 This date is committed to an active booking and cannot be toggled.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-ink/80 leading-relaxed">
                    {selectedStatus === 'open'
                      ? 'This date is currently OPEN. Marketplace sponsors can select and purchase this slot.'
                      : 'This date is LOCKED (Blackout). Sponsors cannot select this date during checkout.'}
                  </p>

                  <Button
                    variant={selectedStatus === 'open' ? 'secondary' : 'primary'}
                    size="md"
                    className="w-full"
                    onClick={() => handleDateClick(selectedDate)}
                  >
                    {selectedStatus === 'open' ? '🔒 Lock This Date' : '🔓 Open This Date'}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Availability Legend Component */}
          <AvailabilityLegend />
        </div>
      </div>
    </DashboardLayout>
  )
}

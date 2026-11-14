import { createContext, useContext, useEffect, useState } from 'react'
import { mockCreators } from '../data/mockCreators'
import { mockTiers } from '../data/mockTiers'
import { mockBookings } from '../data/mockBookings'
import { money, formatDate, todayKey } from '../utils/format'

const DataContext = createContext(null)

const KEY = 'advault_data_v1'

const seed = {
  creators: mockCreators,
  tiers: mockTiers,
  bookings: mockBookings,
  locked: { 'creator-1': ['2026-11-26', '2026-11-27'] },
  notifications: [],
}

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return saved ? { ...seed, ...saved } : seed
  } catch {
    return seed
  }
}

const push = (list, mail) =>
  [{ id: `mail-${Date.now()}-${list.length}`, at: new Date().toISOString(), ...mail }, ...list].slice(0, 60)

const outcomes = {
  approved: { pay: 'captured', mail: 'Your ad was approved and payment was captured' },
  revision_requested: { pay: 'authorized', mail: 'Revision requested on your ad' },
  rejected: { pay: 'released', mail: 'Your ad was declined and payment was released' },
}

export function DataProvider({ children }) {
  const [db, setDb] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      return
    }
  }, [db])

  const upsertCreator = (creator) =>
    setDb((p) => ({
      ...p,
      creators: p.creators.some((c) => c.id === creator.id)
        ? p.creators.map((c) => (c.id === creator.id ? { ...c, ...creator } : c))
        : [...p.creators, creator],
    }))

  const addTier = (creatorId, data) => {
    const tier = { slotsOpen: 5, perks: [], ...data, id: `tier-${Date.now()}`, creatorId }
    setDb((p) => ({ ...p, tiers: [tier, ...p.tiers] }))
    return tier
  }

  const updateTier = (id, data) =>
    setDb((p) => ({ ...p, tiers: p.tiers.map((t) => (t.id === id ? { ...t, ...data } : t)) }))

  const removeTier = (id) => setDb((p) => ({ ...p, tiers: p.tiers.filter((t) => t.id !== id) }))

  const createBooking = (data) => {
    const booking = {
      ...data,
      id: `booking-${Date.now()}`,
      status: 'pending',
      paymentStatus: 'authorized',
      feedbackNote: null,
      clicks: 0,
      submittedAt: todayKey(),
    }
    setDb((p) => {
      const creator = p.creators.find((c) => c.id === data.creatorId)
      let mails = push(p.notifications, {
        to: data.sponsorEmail,
        sponsorId: data.sponsorId,
        bookingId: booking.id,
        subject: `Receipt: ${money(data.amount)} authorized for ${data.tierName} on ${formatDate(data.slotDate)}`,
      })
      mails = push(mails, {
        to: creator?.email || 'creator',
        creatorId: data.creatorId,
        bookingId: booking.id,
        subject: `New ad submission from ${data.sponsorName} is waiting for review`,
      })
      return { ...p, bookings: [booking, ...p.bookings], notifications: mails }
    })
    return booking
  }

  const reviewBooking = (id, status, note = null) =>
    setDb((p) => {
      const target = p.bookings.find((b) => b.id === id)
      if (!target) return p
      const outcome = outcomes[status]
      return {
        ...p,
        bookings: p.bookings.map((b) =>
          b.id === id ? { ...b, status, feedbackNote: note, paymentStatus: outcome.pay } : b
        ),
        notifications: push(p.notifications, {
          to: target.sponsorEmail,
          sponsorId: target.sponsorId,
          bookingId: id,
          subject: outcome.mail,
        }),
      }
    })

  const resubmit = (id, creative) =>
    setDb((p) => {
      const target = p.bookings.find((b) => b.id === id)
      if (!target) return p
      return {
        ...p,
        bookings: p.bookings.map((b) =>
          b.id === id ? { ...b, ...creative, status: 'pending', feedbackNote: null } : b
        ),
        notifications: push(p.notifications, {
          to: 'creator',
          creatorId: target.creatorId,
          bookingId: id,
          subject: `${target.sponsorName} submitted a revised creative`,
        }),
      }
    })

  const toggleLock = (creatorId, date) =>
    setDb((p) => {
      const list = p.locked[creatorId] || []
      const next = list.includes(date) ? list.filter((d) => d !== date) : [...list, date]
      return { ...p, locked: { ...p.locked, [creatorId]: next } }
    })

  const openAll = (creatorId) => setDb((p) => ({ ...p, locked: { ...p.locked, [creatorId]: [] } }))

  const trackClick = (id) =>
    setDb((p) => ({ ...p, bookings: p.bookings.map((b) => (b.id === id ? { ...b, clicks: (b.clicks || 0) + 1 } : b)) }))

  const slotMap = (creatorId) => {
    const map = {}
    ;(db.locked[creatorId] || []).forEach((d) => {
      map[d] = 'locked'
    })
    db.bookings.forEach((b) => {
      if (b.creatorId === creatorId && b.status !== 'rejected') map[b.slotDate] = 'booked'
    })
    return map
  }

  const resetData = () => setDb(seed)

  return (
    <DataContext.Provider
      value={{
        ...db,
        upsertCreator,
        addTier,
        updateTier,
        removeTier,
        createBooking,
        reviewBooking,
        resubmit,
        toggleLock,
        openAll,
        trackClick,
        slotMap,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
export default DataContext

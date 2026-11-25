import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { api, API_URL } from '../utils/api'

const DataContext = createContext(null)

// Public data for everyone, plus my bookings and emails when logged in
async function fetchAll(userId) {
  const mine = userId ? Promise.all([api('/bookings/mine'), api('/bookings/notifications')]) : [[], []]
  const [c, t, s, [b, n]] = await Promise.all([api('/creators'), api('/tiers'), api('/availability'), mine])
  return { c, t, s, b, n }
}

// Shows the server's error message, then re-throws so the page can stop too
const fail = (err) => {
  alert(err.message)
  throw err
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const [loadedFor, setLoadedFor] = useState(undefined) // which user's data is loaded (null = guest)
  const [creators, setCreators] = useState([])
  const [tiers, setTiers] = useState([])
  const [slots, setSlots] = useState({}) // { creatorId: { "YYYY-MM-DD": "locked" | "booked" } }
  const [bookings, setBookings] = useState([]) // only MY bookings
  const [notifications, setNotifications] = useState([])

  const apply = ({ c, t, s, b, n }) => {
    setCreators(c)
    setTiers(t)
    setSlots(s)
    setBookings(b)
    setNotifications(n)
  }

  // Load everything on start, and again when someone logs in or out
  useEffect(() => {
    fetchAll(userId)
      .then(apply)
      .catch((err) => console.error(err.message))
      .finally(() => setLoadedFor(userId ?? null))
  }, [userId])

  const reloadAll = () => fetchAll(userId).then(apply)

  // ----- creator profile -----
  const upsertCreator = (creator) =>
    api('/creators/me', { method: 'PUT', body: creator })
      .then((saved) => setCreators((p) => p.map((c) => (c.id === saved.id ? saved : c))))
      .catch(fail)

  // ----- tiers -----
  const addTier = (creatorId, data) =>
    api('/tiers', { method: 'POST', body: data })
      .then((tier) => {
        setTiers((p) => [tier, ...p])
        return tier
      })
      .catch(fail)

  const updateTier = (id, data) =>
    api(`/tiers/${id}`, { method: 'PUT', body: data })
      .then((tier) => setTiers((p) => p.map((t) => (t.id === id ? tier : t))))
      .catch(fail)

  const removeTier = (id) =>
    api(`/tiers/${id}`, { method: 'DELETE' })
      .then(() => setTiers((p) => p.filter((t) => t.id !== id)))
      .catch(fail)

  // ----- booking + Stripe -----
  // Step 1: server checks the order and creates a Stripe hold. Returns { clientSecret, paymentIntentId }
  const startCheckout = (order) => api('/bookings/intent', { method: 'POST', body: order })

  // Step 2: after Stripe confirmed the card, save the booking
  const createBooking = async (data) => {
    const booking = await api('/bookings/confirm', { method: 'POST', body: data })
    await reloadAll()
    return booking
  }

  const reviewBooking = (id, status, note = null) =>
    api(`/bookings/${id}/review`, { method: 'PUT', body: { status, note: note || '' } })
      .then(reloadAll)
      .catch(fail)

  const resubmit = (id, creative) =>
    api(`/bookings/${id}/resubmit`, { method: 'PUT', body: creative })
      .then(reloadAll)
      .catch(fail)

  // ----- calendar -----
  const toggleLock = (creatorId, date) =>
    api('/availability/lock', { method: 'PUT', body: { date } })
      .then((map) => setSlots((p) => ({ ...p, [creatorId]: map })))
      .catch(fail)

  const openAll = (creatorId) =>
    api('/availability/open-all', { method: 'PUT' })
      .then((map) => setSlots((p) => ({ ...p, [creatorId]: map })))
      .catch(fail)

  const slotMap = (creatorId) => slots[creatorId] || {}

  // ----- click tracking: open the real tracking link, then refresh the counts -----
  const trackClick = (id) => {
    window.open(`${API_URL}/track/${id}`, '_blank', 'noopener')
    setTimeout(() => reloadAll().catch(() => {}), 1500)
  }

  if (loadedFor !== (userId ?? null)) {
    return <div className="min-h-screen grid place-items-center text-muted font-heading uppercase tracking-wider">Loading AdVault...</div>
  }

  return (
    <DataContext.Provider
      value={{
        creators,
        tiers,
        bookings: userId ? bookings : [],
        notifications: userId ? notifications : [],
        upsertCreator,
        addTier,
        updateTier,
        removeTier,
        startCheckout,
        createBooking,
        reviewBooking,
        resubmit,
        toggleLock,
        openAll,
        trackClick,
        slotMap,
        reload: reloadAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
export default DataContext

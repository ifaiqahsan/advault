const express = require('express')
const Creator = require('../models/Creator')
const Booking = require('../models/Booking')
const { protect, allow } = require('../middleware/auth')

const router = express.Router()

// Builds { "2026-12-01": "locked", "2026-12-05": "booked" } for one creator.
// Dates missing from the map are "open".
function buildMap(creator, bookings) {
  const map = {}
  creator.lockedDates.forEach((d) => (map[d] = 'locked'))
  bookings.forEach((b) => {
    if (String(b.creatorId) === String(creator._id)) map[b.slotDate] = 'booked'
  })
  return map
}

const activeBookings = (filter = {}) =>
  Booking.find({ ...filter, status: { $ne: 'rejected' } }).select('creatorId slotDate')

// GET /api/availability  (public: { creatorId: map } for every creator)
router.get('/', async (req, res) => {
  const [creators, bookings] = await Promise.all([Creator.find(), activeBookings()])
  const all = {}
  creators.forEach((c) => (all[c.id] = buildMap(c, bookings)))
  res.json(all)
})

// GET /api/availability/:creatorId  (public: one creator's map)
router.get('/:creatorId', async (req, res) => {
  const creator = await Creator.findById(req.params.creatorId)
  if (!creator) return res.status(404).json({ message: 'Creator not found.' })
  res.json(buildMap(creator, await activeBookings({ creatorId: creator._id })))
})

// PUT /api/availability/lock  { date }  (creator locks or unlocks one date)
router.put('/lock', protect, allow('creator'), async (req, res) => {
  const { date } = req.body
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ message: 'Date must look like YYYY-MM-DD.' })

  const creator = await Creator.findById(req.user.creatorId)
  if (await Booking.isTaken(creator._id, date)) {
    return res.status(400).json({ message: 'This date is booked and cannot be changed.' })
  }
  creator.lockedDates = creator.lockedDates.includes(date)
    ? creator.lockedDates.filter((d) => d !== date)
    : [...creator.lockedDates, date]
  await creator.save()
  res.json(buildMap(creator, await activeBookings({ creatorId: creator._id })))
})

// PUT /api/availability/open-all  (creator unlocks every date)
router.put('/open-all', protect, allow('creator'), async (req, res) => {
  const creator = await Creator.findById(req.user.creatorId)
  creator.lockedDates = []
  await creator.save()
  res.json(buildMap(creator, await activeBookings({ creatorId: creator._id })))
})

module.exports = router

const express = require('express')
const Booking = require('../models/Booking')

const router = express.Router()

// GET /api/track/:bookingId  (public tracking link: count the click, then send the visitor on)
router.get('/:bookingId', async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.bookingId, { $inc: { clicks: 1 } }, { new: true })
  if (!booking) return res.status(404).json({ message: 'Tracking link not found.' })
  res.redirect(302, booking.targetUrl)
})

module.exports = router

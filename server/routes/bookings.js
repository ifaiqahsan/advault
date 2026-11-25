const express = require('express')
const Booking = require('../models/Booking')
const User = require('../models/User')
const Tier = require('../models/Tier')
const Creator = require('../models/Creator')
const Notification = require('../models/Notification')
const upload = require('../middleware/upload')
const { protect, allow } = require('../middleware/auth')
const stripe = require('../utils/stripe')
const sendEmail = require('../utils/email')

const router = express.Router()

// ---------- small helpers ----------
const pad = (n) => String(n).padStart(2, '0')
const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const wordCount = (t) => (t && t.trim() ? t.trim().split(/\s+/).length : 0)
const isUrl = (s) => /^https?:\/\/[^\s.]+\.\S+$/i.test(String(s || '').trim())
const money = (n) => `$${Number(n).toLocaleString()}`

// Checks the ad creative against the tier rules. Returns an error message or null.
function checkCreative(body, tier) {
  const { headline = '', adCopy = '', targetUrl = '', adImageUrl = '' } = body
  const words = wordCount(adCopy)
  if (headline.trim().length < 5) return 'Headline needs at least 5 characters.'
  if (!words) return 'Write your ad copy.'
  if (words > tier.wordLimit) return `Copy is ${words} words. This tier allows ${tier.wordLimit}.`
  if (!isUrl(targetUrl)) return 'Target link must be a full URL starting with http:// or https://'
  const needsImage = !/none/i.test(tier.imageSize)
  if (needsImage && !adImageUrl) return 'This tier needs a banner image.'
  if (adImageUrl && !adImageUrl.startsWith('/uploads/') && !isUrl(adImageUrl)) return 'Invalid image link.'
  return null
}

// Checks the date: real date, not in the past, not locked, not already booked
async function checkDate(creator, slotDate, ignoreId = null) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate || '')) return 'Pick a valid date.'
  if (slotDate < todayKey()) return 'Past dates cannot be booked.'
  if (creator.lockedDates.includes(slotDate)) return 'The creator has locked this date.'
  if (await Booking.isTaken(creator._id, slotDate, ignoreId)) return 'Someone already booked this date. Choose another one.'
  return null
}

// Loads tier + creator and runs every check. Used by /intent and /confirm.
async function validateOrder(body) {
  const tier = await Tier.findById(body.tierId)
  if (!tier) return { error: 'Tier not found.' }
  const creator = await Creator.findById(tier.creatorId)
  if (!creator) return { error: 'Creator not found.' }
  if (String(body.sponsorName || '').trim().length < 2) return { error: 'Enter your company or brand name.' }
  const error = checkCreative(body, tier) || (await checkDate(creator, body.slotDate))
  return { tier, creator, error }
}

// Finds a booking that belongs to the logged-in user
async function findMine(req, res) {
  const booking = await Booking.findById(req.params.id)
  const owner = req.user.role === 'creator' ? booking?.creatorId : booking?.sponsorId
  const myId = req.user.role === 'creator' ? req.user.creatorId : req.user.id
  if (!booking || String(owner) !== String(myId)) {
    res.status(404).json({ message: 'Booking not found.' })
    return null
  }
  return booking
}

// ---------- routes ----------

// POST /api/bookings/upload  (sponsor uploads a PNG/JPG under 1 MB, field name "image")
router.post('/upload', protect, allow('sponsor'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image file.' })
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

// POST /api/bookings/intent  (step 1 of paying: validate, then hold the money on Stripe)
router.post('/intent', protect, allow('sponsor'), async (req, res) => {
  const { tier, error } = await validateOrder(req.body)
  if (error) return res.status(400).json({ message: error })

  // Price always comes from the database, never from the browser
  const intent = await stripe.createHold(tier.price, {
    tierId: tier.id,
    slotDate: req.body.slotDate,
    sponsorId: req.user.id,
  })
  res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id, amount: tier.price })
})

// POST /api/bookings/confirm  (step 2: card is confirmed in the browser, now save the booking)
router.post('/confirm', protect, allow('sponsor'), async (req, res) => {
  const { paymentIntentId } = req.body
  if (!paymentIntentId) return res.status(400).json({ message: 'paymentIntentId is required.' })

  const existing = await Booking.findOne({ paymentIntentId })
  if (existing) return res.json(existing) // clicked twice, return the same booking

  const intent = await stripe.getIntent(paymentIntentId)
  if (intent.metadata.sponsorId !== req.user.id) return res.status(403).json({ message: 'This payment is not yours.' })
  if (intent.status !== 'requires_capture') {
    return res.status(400).json({ message: `Card was not authorized (Stripe status: ${intent.status}).` })
  }

  // Booking must match what was paid for
  const body = { ...req.body, tierId: intent.metadata.tierId, slotDate: intent.metadata.slotDate }
  const { tier, creator, error } = await validateOrder(body)
  if (error) {
    await stripe.cancel(paymentIntentId) // date got taken meanwhile: release the hold
    return res.status(409).json({ message: `${error} Your card hold was released.` })
  }

  const sponsor = await User.findById(req.user.id)
  const booking = await Booking.create({
    creatorId: creator._id,
    sponsorId: req.user.id,
    tierId: tier._id,
    tierName: tier.name,
    sponsorName: body.sponsorName.trim(),
    sponsorEmail: sponsor.email,
    slotDate: body.slotDate,
    amount: tier.price,
    paymentIntentId,
    headline: body.headline.trim(),
    adCopy: body.adCopy.trim(),
    adImageUrl: body.adImageUrl || '',
    targetUrl: body.targetUrl.trim(),
    submittedAt: todayKey(),
  })

  await sendEmail({
    to: sponsor.email,
    sponsorId: sponsor._id,
    bookingId: booking._id,
    subject: `Receipt: ${money(tier.price)} authorized for ${tier.name} on ${booking.slotDate}`,
    text: `Your card was authorized for ${money(tier.price)} (not charged yet).\nCreator: ${creator.name}\nTier: ${tier.name}\nDate: ${booking.slotDate}\nYou will only be charged when the creator approves your ad.`,
  })
  await sendEmail({
    to: creator.email,
    creatorId: creator._id,
    bookingId: booking._id,
    subject: `New ad submission from ${booking.sponsorName} is waiting for review`,
    text: `${booking.sponsorName} booked "${tier.name}" for ${booking.slotDate}.\nHeadline: ${booking.headline}\nOpen your AdVault review queue to approve, reject or request a revision.`,
  })

  res.status(201).json(booking)
})

// GET /api/bookings/mine  (creator: bookings for my media, sponsor: bookings I made)
router.get('/mine', protect, async (req, res) => {
  const filter = req.user.role === 'creator' ? { creatorId: req.user.creatorId } : { sponsorId: req.user.id }
  res.json(await Booking.find(filter).sort({ createdAt: -1 }))
})

// GET /api/bookings/notifications  (emails sent to me)
router.get('/notifications', protect, async (req, res) => {
  const filter = req.user.role === 'creator' ? { creatorId: req.user.creatorId } : { sponsorId: req.user.id }
  res.json(await Notification.find(filter).sort({ at: -1 }).limit(60))
})

// PUT /api/bookings/:id/review  { status, note }  (creator: approve / reject / request revision)
router.put('/:id/review', protect, allow('creator'), async (req, res) => {
  const { status, note = '' } = req.body
  if (!['approved', 'rejected', 'revision_requested'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved, rejected or revision_requested.' })
  }
  if (status !== 'approved' && note.trim().length < 5) {
    return res.status(400).json({ message: 'Please write a short note for the sponsor.' })
  }

  const booking = await findMine(req, res)
  if (!booking) return
  if (booking.status === 'approved' || booking.status === 'rejected') {
    return res.status(400).json({ message: `This booking is already ${booking.status}.` })
  }

  let subject, text
  if (status === 'approved') {
    await stripe.capture(booking.paymentIntentId) // money is taken now
    booking.paymentStatus = 'captured'
    booking.feedbackNote = null
    subject = `Your ad was approved and ${money(booking.amount)} was captured`
    text = `Good news! Your ad "${booking.headline}" for ${booking.slotDate} is approved. The date is locked for you and your payment of ${money(booking.amount)} was captured.`
  } else if (status === 'rejected') {
    await stripe.cancel(booking.paymentIntentId) // hold released, no charge
    booking.paymentStatus = 'released'
    booking.feedbackNote = note.trim()
    subject = 'Your ad was declined and payment was released'
    text = `Your ad "${booking.headline}" was declined.\nCreator note: ${note.trim()}\nThe hold on your card was released. You were not charged.`
  } else {
    booking.feedbackNote = note.trim() // payment stays authorized
    subject = 'Revision requested on your ad'
    text = `The creator asked for changes to "${booking.headline}".\nNote: ${note.trim()}\nLog in to AdVault, open My Bookings and click "Edit and resubmit".`
  }
  booking.status = status
  await booking.save()

  await sendEmail({ to: booking.sponsorEmail, sponsorId: booking.sponsorId, bookingId: booking._id, subject, text })
  res.json(booking)
})

// PUT /api/bookings/:id/resubmit  (sponsor sends a fixed creative after a revision request)
router.put('/:id/resubmit', protect, allow('sponsor'), async (req, res) => {
  const booking = await findMine(req, res)
  if (!booking) return
  if (booking.status !== 'revision_requested') {
    return res.status(400).json({ message: 'Only bookings with a revision request can be resubmitted.' })
  }
  const tier = await Tier.findById(booking.tierId)
  const error = checkCreative(req.body, tier || { wordLimit: 200, imageSize: 'None' })
  if (error) return res.status(400).json({ message: error })

  booking.headline = req.body.headline.trim()
  booking.adCopy = req.body.adCopy.trim()
  booking.targetUrl = req.body.targetUrl.trim()
  booking.adImageUrl = req.body.adImageUrl || ''
  booking.status = 'pending'
  booking.feedbackNote = null
  await booking.save()

  const creator = await Creator.findById(booking.creatorId)
  await sendEmail({
    to: creator.email,
    creatorId: creator._id,
    bookingId: booking._id,
    subject: `${booking.sponsorName} submitted a revised creative`,
    text: `${booking.sponsorName} updated their ad for ${booking.slotDate}. It is back in your review queue.`,
  })
  res.json(booking)
})

module.exports = router

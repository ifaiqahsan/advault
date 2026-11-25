const express = require('express')
const Tier = require('../models/Tier')
const { protect, allow } = require('../middleware/auth')

const router = express.Router()

// Checks the tier form and returns clean data (or an error message)
function readTier(body) {
  const price = Number(body.price)
  const wordLimit = Number(body.wordLimit)
  const slotsOpen = body.slotsOpen === undefined ? 5 : Number(body.slotsOpen)
  if (!String(body.name || '').trim()) return { error: 'Tier name is required.' }
  if (!(price > 0)) return { error: 'Price must be above $0.' }
  if (!Number.isInteger(wordLimit) || wordLimit <= 0) return { error: 'Word limit must be a whole number above 0.' }
  if (!Number.isInteger(slotsOpen) || slotsOpen < 0) return { error: 'Open slots must be 0 or more.' }
  const perks = Array.isArray(body.perks) ? body.perks : String(body.perks || '').split(',')
  return {
    data: {
      name: body.name.trim(),
      price,
      wordLimit,
      slotsOpen,
      imageSize: String(body.imageSize || 'None (Text Only)').trim(),
      description: String(body.description || '').trim(),
      perks: perks.map((p) => String(p).trim()).filter(Boolean),
    },
  }
}

// GET /api/tiers  (public: all tiers, used by the marketplace)
router.get('/', async (req, res) => {
  res.json(await Tier.find().sort({ price: -1 }))
})

// GET /api/tiers/creator/:creatorId  (public: one creator's tiers)
router.get('/creator/:creatorId', async (req, res) => {
  res.json(await Tier.find({ creatorId: req.params.creatorId }).sort({ price: -1 }))
})

// POST /api/tiers  (creator creates a tier)
router.post('/', protect, allow('creator'), async (req, res) => {
  const { data, error } = readTier(req.body)
  if (error) return res.status(400).json({ message: error })
  const tier = await Tier.create({ ...data, creatorId: req.user.creatorId })
  res.status(201).json(tier)
})

// PUT /api/tiers/:id  (creator edits their OWN tier)
router.put('/:id', protect, allow('creator'), async (req, res) => {
  const { data, error } = readTier(req.body)
  if (error) return res.status(400).json({ message: error })
  const tier = await Tier.findOneAndUpdate({ _id: req.params.id, creatorId: req.user.creatorId }, data, { new: true })
  if (!tier) return res.status(404).json({ message: 'Tier not found (or it is not yours).' })
  res.json(tier)
})

// DELETE /api/tiers/:id  (creator deletes their OWN tier)
router.delete('/:id', protect, allow('creator'), async (req, res) => {
  const tier = await Tier.findOneAndDelete({ _id: req.params.id, creatorId: req.user.creatorId })
  if (!tier) return res.status(404).json({ message: 'Tier not found (or it is not yours).' })
  res.json({ message: 'Tier deleted.', id: tier.id })
})

module.exports = router

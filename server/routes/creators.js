const express = require('express')
const Creator = require('../models/Creator')
const { protect, allow } = require('../middleware/auth')

const router = express.Router()

const isUrl = (s) => /^https?:\/\/\S+$/i.test(String(s || '').trim())

// GET /api/creators  (public marketplace list)
router.get('/', async (req, res) => {
  const creators = await Creator.find().sort({ createdAt: 1 })
  res.json(creators)
})

// GET /api/creators/:id  (public detail)
router.get('/:id', async (req, res) => {
  const creator = await Creator.findById(req.params.id)
  if (!creator) return res.status(404).json({ message: 'Creator not found.' })
  res.json(creator)
})

// PUT /api/creators/me  (creator saves their own media profile)
router.put('/me', protect, allow('creator'), async (req, res) => {
  const { name = '', type, bio = '', audienceSize, website = '', img = '', social = {} } = req.body

  if (!name.trim()) return res.status(400).json({ message: 'Publication name is required.' })
  if (!['newsletter', 'podcast', 'opensource', 'youtube'].includes(type)) {
    return res.status(400).json({ message: 'Type must be newsletter, podcast, opensource or youtube.' })
  }
  if (!Number.isInteger(Number(audienceSize)) || Number(audienceSize) < 0) {
    return res.status(400).json({ message: 'Audience size must be a whole number.' })
  }
  if (website && !isUrl(website)) return res.status(400).json({ message: 'Website must start with http:// or https://' })
  if (img && !isUrl(img)) return res.status(400).json({ message: 'Image must be a valid link.' })

  const creator = await Creator.findByIdAndUpdate(
    req.user.creatorId,
    {
      name: name.trim(),
      type,
      bio: bio.trim(),
      audienceSize: Number(audienceSize),
      website: website.trim(),
      img: img.trim(),
      social: {
        twitter: social.twitter || '',
        linkedin: social.linkedin || '',
        github: social.github || '',
        youtube: social.youtube || '',
      },
    },
    { new: true, runValidators: true }
  )
  if (!creator) return res.status(404).json({ message: 'Creator profile not found.' })
  res.json(creator)
})

module.exports = router

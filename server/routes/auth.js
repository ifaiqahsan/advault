const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Creator = require('../models/Creator')
const { protect, makeToken } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/register  { name, email, password, role }
router.post('/register', async (req, res) => {
  const { name = '', email = '', password = '', role } = req.body
  if (name.trim().length < 2) return res.status(400).json({ message: 'Please enter your full name.' })
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  if (!['creator', 'sponsor'].includes(role)) return res.status(400).json({ message: 'Role must be creator or sponsor.' })

  if (await User.exists({ email: email.toLowerCase().trim() })) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash, role })

  // Every creator gets an (empty) media profile right away
  if (role === 'creator') {
    const handle = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'creator'
    const creator = await Creator.create({ user: user._id, name, email: user.email, handle })
    user.creatorId = creator._id
    await user.save()
  }

  res.status(201).json({ token: makeToken(user), user: user.toSession() })
})

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  const { email = '', password = '' } = req.body
  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password.' })
  }
  res.json({ token: makeToken(user), user: user.toSession() })
})

// GET /api/auth/me  (logged in)
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json({ user: user.toSession() })
})

module.exports = router

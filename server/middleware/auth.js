const jwt = require('jsonwebtoken')

// "Must be logged in": reads "Authorization: Bearer <token>" and checks the JWT
function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Please log in first.' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) // { id, role, creatorId }
    next()
  } catch {
    res.status(401).json({ message: 'Your session expired. Please log in again.' })
  }
}

// "Must be creator" / "must be sponsor": use after protect, e.g. allow('creator')
const allow = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ message: `Only ${role}s can do this.` })
  next()
}

// Creates the token we give the browser after login / register
const makeToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role, creatorId: user.creatorId ? user.creatorId.toString() : null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

module.exports = { protect, allow, makeToken }

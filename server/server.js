require('dotenv').config({ quiet: true })
const path = require('path')
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()

// Middleware runs on every request, in this order
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use((req, res, next) => {
  req.body = req.body || {} // Express 5 leaves body undefined when nothing was sent
  next()
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // ad images

// RESTful routes, one file per resource
app.use('/api/auth', require('./routes/auth'))
app.use('/api/creators', require('./routes/creators'))
app.use('/api/tiers', require('./routes/tiers'))
app.use('/api/availability', require('./routes/availability'))
app.use('/api/bookings', require('./routes/bookings'))
app.use('/api/track', require('./routes/track'))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message)
    process.exit(1)
  })

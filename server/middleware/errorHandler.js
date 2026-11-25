// Any unknown /api URL
function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

// Express sends every thrown error here (Express 5 also catches errors in async routes)
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be under 1 MB.' : 'Upload a PNG or JPG image.'
    return res.status(400).json({ message })
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id.' })
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(' ') })
  }
  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(402).json({ message: `Payment error: ${err.message}` })
  }
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' })
}

module.exports = { notFound, errorHandler }

const path = require('path')
const multer = require('multer')

// Save files into server/uploads with a unique name
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `ad-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`)
  },
})

// Only PNG or JPG, max 1 MB
const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpeg'].includes(file.mimetype)) cb(null, true)
  else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image'))
}

module.exports = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 } })

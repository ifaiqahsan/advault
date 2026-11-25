const mongoose = require('mongoose')

// Connects to MongoDB once when the server starts
async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing. Copy server/.env.example to server/.env and fill it in.')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')
}

module.exports = connectDB

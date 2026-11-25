const mongoose = require('mongoose')

// A copy of every email we send, so dashboards can list them
const notificationSchema = new mongoose.Schema({
  to: String,
  subject: String,
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }, // set when the creator is the receiver
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // set when the sponsor is the receiver
  at: { type: Date, default: Date.now },
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      return ret
    },
  },
})

module.exports = mongoose.model('Notification', notificationSchema)

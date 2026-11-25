const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tier', required: true },
    tierName: String,
    sponsorName: String,
    sponsorEmail: String,
    slotDate: { type: String, required: true }, // "YYYY-MM-DD"
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'revision_requested', 'rejected'], default: 'pending' },
    paymentStatus: { type: String, enum: ['authorized', 'captured', 'released'], default: 'authorized' },
    paymentIntentId: String, // Stripe id (seeded demo bookings have none)
    clicks: { type: Number, default: 0 },
    headline: String,
    adCopy: String,
    adImageUrl: { type: String, default: '' },
    targetUrl: String,
    feedbackNote: { type: String, default: null },
    submittedAt: String, // "YYYY-MM-DD"
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.paymentIntentId
        return ret
      },
    },
  }
)

// A date is taken if any booking on it is not rejected (blocks double-booking)
bookingSchema.statics.isTaken = async function (creatorId, slotDate, ignoreId = null) {
  const filter = { creatorId, slotDate, status: { $ne: 'rejected' } }
  if (ignoreId) filter._id = { $ne: ignoreId }
  return Boolean(await this.exists(filter))
}

module.exports = mongoose.model('Booking', bookingSchema)

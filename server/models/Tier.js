const mongoose = require('mongoose')

const tierSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    wordLimit: { type: Number, required: true, min: 1 },
    imageSize: { type: String, default: 'None (Text Only)' },
    description: { type: String, default: '' },
    perks: { type: [String], default: [] },
    slotsOpen: { type: Number, default: 5, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

module.exports = mongoose.model('Tier', tierSchema)

const mongoose = require('mongoose')

const creatorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    handle: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    img: { type: String, default: '' },
    type: { type: String, enum: ['newsletter', 'podcast', 'opensource', 'youtube'], default: 'newsletter' },
    bio: { type: String, default: '' },
    audienceSize: { type: Number, default: 0, min: 0 },
    website: { type: String, default: '' },
    social: { twitter: String, linkedin: String, github: String, youtube: String },
    verified: { type: Boolean, default: false },
    lockedDates: { type: [String], default: [] }, // "YYYY-MM-DD" dates the creator closed
  },
  {
    timestamps: true,
    // Turns _id into id when we send JSON to the frontend
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.lockedDates
        return ret
      },
    },
  }
)

module.exports = mongoose.model('Creator', creatorSchema)

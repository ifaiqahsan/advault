const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash, never the real password
    role: { type: String, enum: ['creator', 'sponsor'], required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
  },
  { timestamps: true }
)

// The "session" object the frontend stores (no password hash in it)
userSchema.methods.toSession = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    creatorId: this.creatorId ? this.creatorId.toString() : null,
    sponsorId: this.role === 'sponsor' ? this._id.toString() : null,
  }
}

module.exports = mongoose.model('User', userSchema)

const nodemailer = require('nodemailer')
const Notification = require('../models/Notification')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
})

// Saves the email in the "notifications" collection, then sends it.
// If sending fails we only log it, so the request never crashes.
async function sendEmail({ to, subject, text, bookingId, creatorId, sponsorId }) {
  await Notification.create({ to, subject, bookingId, creatorId, sponsorId })

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[email skipped, no EMAIL_USER/EMAIL_PASS] ${to}: ${subject}`)
    return
  }

  const override = process.env.EMAIL_OVERRIDE_TO
  transporter
    .sendMail({
      from: `AdVault <${process.env.EMAIL_USER}>`,
      to: override || to,
      subject: override ? `${subject} [for ${to}]` : subject,
      text: `${text}\n\n- AdVault`,
    })
    .then(() => console.log(`[email sent] ${override || to}: ${subject}`))
    .catch((err) => console.error(`[email failed] ${to}: ${err.message}`))
}

module.exports = sendEmail

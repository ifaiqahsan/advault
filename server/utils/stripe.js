const Stripe = require('stripe')

let stripe = null
const client = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is missing in server/.env')
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  return stripe
}

// 1) Hold (authorize) money on the card. Nothing is charged yet.
const createHold = (amountDollars, metadata) =>
  client().paymentIntents.create({
    amount: Math.round(amountDollars * 100), // Stripe uses cents
    currency: 'usd',
    capture_method: 'manual',
    payment_method_types: ['card'],
    metadata,
  })

const getIntent = (id) => client().paymentIntents.retrieve(id)

// 2a) Creator approved: actually take the money
const capture = (id) => (id ? client().paymentIntents.capture(id) : null)

// 2b) Creator rejected: release the hold
const cancel = (id) => (id ? client().paymentIntents.cancel(id) : null)

module.exports = { createHold, getIntent, capture, cancel }

import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import PageHero from '../../components/ui/PageHero'
import Stepper from '../../components/ui/Stepper'
import Calendar from '../../components/ui/Calendar'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, isUrl, money, todayKey, wordCount } from '../../utils/format'
import { uploadImage } from '../../utils/api'

const steps = ['Select date', 'Ad creative', 'Payment']

// Stripe.js is loaded once with the publishable (public) test key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

// Payment step: Stripe's secure card box. Card numbers go straight to Stripe, never to our server.
function PaymentForm({ amount, onPay, onBack }) {
  const stripe = useStripe()
  const elements = useElements()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const submit = async (ev) => {
    ev.preventDefault()
    if (name.trim().length < 2) return setNameError('Enter the name on the card.')
    if (!stripe || !elements) return
    setPaying(true)
    setPayError('')
    try {
      await onPay(stripe, elements.getElement(CardElement), name.trim())
    } catch (err) {
      setPayError(err.message)
      setPaying(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="bg-brand-50 border border-brand-300 p-3 text-xs text-ink">
        Stripe test mode. Use card <strong>4242 4242 4242 4242</strong>, any future date and any 3 digit code. Card <strong>4000 0000 0000 0002</strong> is always declined.
      </div>
      <Input label="Name on card" name="cardName" required autoComplete="cc-name" value={name} onChange={(e) => (setName(e.target.value), setNameError(''))} error={nameError} />
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink/80">Card details <span className="text-brand-500">*</span></label>
        <div className="mt-1.5 border border-line bg-white px-4 py-3.5">
          <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: '15px', color: '#0f172a' } } }} />
        </div>
      </div>
      {payError && <p className="text-sm text-rejected bg-red-50 border border-rejected/30 p-3 fade-in">{payError}</p>}
      <div className="flex justify-between gap-3 pt-2">
        <Button variant="outline" onClick={onBack} disabled={paying}>Back</Button>
        <Button type="submit" size="lg" loading={paying} disabled={!stripe}>Authorize {money(amount)}</Button>
      </div>
    </form>
  )
}

export default function Checkout() {
  const { tierId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tiers, creators, slotMap, startCheckout, createBooking } = useData()

  const tier = tiers.find((t) => t.id === tierId)
  const creator = creators.find((c) => c.id === tier?.creatorId)
  const map = creator ? slotMap(creator.id) : {}
  const startDate = params.get('date') || ''
  const validStart = startDate && startDate >= todayKey() && !map[startDate]

  const [step, setStep] = useState(validStart ? 1 : 0)
  const [date, setDate] = useState(validStart ? startDate : '')
  const [creative, setCreative] = useState({ company: user?.name || '', headline: '', adCopy: '', targetUrl: '', adImageUrl: '' })
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)

  if (!tier || !creator) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <EmptyState title="Tier not found" text="This ad tier does not exist anymore." action={<Button to="/creators">Browse creators</Button>} />
      </section>
    )
  }

  const textOnly = /none/i.test(tier.imageSize)
  const words = wordCount(creative.adCopy)
  const clear = (field) => setErrors((p) => ({ ...p, [field]: '' }))

  const setC = (field) => (e) => {
    setCreative({ ...creative, [field]: e.target.value })
    clear(field)
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(png|jpe?g)$/.test(file.type)) return setErrors((p) => ({ ...p, adImageUrl: 'Upload a PNG or JPG image.' }))
    if (file.size > 1024 * 1024) return setErrors((p) => ({ ...p, adImageUrl: 'Image must be under 1 MB.' }))
    setUploading(true)
    uploadImage(file) // multer saves it in server/uploads
      .then((url) => {
        setCreative((p) => ({ ...p, adImageUrl: url }))
        clear('adImageUrl')
      })
      .catch((err) => setErrors((p) => ({ ...p, adImageUrl: err.message })))
      .finally(() => setUploading(false))
  }

  const next = () => {
    const e = {}
    if (step === 0) {
      if (!date) e.date = 'Pick an open date to continue.'
    }
    if (step === 1) {
      if (creative.company.trim().length < 2) e.company = 'Enter your company or brand name.'
      if (creative.headline.trim().length < 5) e.headline = 'Headline needs at least 5 characters.'
      if (!creative.adCopy.trim()) e.adCopy = 'Write your ad copy.'
      else if (words > tier.wordLimit) e.adCopy = `Copy is ${words} words. This tier allows ${tier.wordLimit}.`
      if (!isUrl(creative.targetUrl)) e.targetUrl = 'Enter a full link starting with http:// or https://'
      if (!textOnly && !creative.adImageUrl) e.adImageUrl = 'This tier needs a banner image.'
    }
    setErrors(e)
    if (Object.keys(e).length === 0) setStep(step + 1)
  }

  // 1) server validates and holds the money  2) Stripe confirms the card  3) server saves the booking
  const pay = async (stripe, card, cardName) => {
    const order = {
      tierId: tier.id,
      slotDate: date,
      sponsorName: creative.company.trim(),
      headline: creative.headline.trim(),
      adCopy: creative.adCopy.trim(),
      targetUrl: creative.targetUrl.trim(),
      adImageUrl: creative.adImageUrl,
    }
    const { clientSecret, paymentIntentId } = await startCheckout(order)
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { name: cardName, email: user.email } },
    })
    if (result.error) throw new Error(result.error.message)
    if (result.paymentIntent.status !== 'requires_capture') throw new Error('The card could not be authorized. Try again.')
    const booking = await createBooking({ ...order, paymentIntentId })
    navigate(`/receipt/${booking.id}`, { replace: true })
  }

  return (
    <>
      <PageHero eyebrow={creator.name} title="Checkout" text={`Booking ${tier.name}. Payment is held until the creator approves your ad.`} />

      <section className="mx-auto max-w-7xl px-6 py-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Stepper steps={steps} current={step} />

          <div key={step} className="fade-in">
            {step === 0 && (
              <Card title="Choose your publication date" subtitle="Only open dates can be booked. Booked and locked dates are unavailable.">
                <Calendar selectedDate={date} onSelectDate={(k, s) => s === 'open' && (setDate(k), clear('date'))} statusMap={map} minDate={todayKey()} />
                {errors.date && <p className="text-xs text-rejected mt-3 fade-in">{errors.date}</p>}
              </Card>
            )}

            {step === 1 && (
              <Card title="Upload your ad creative" subtitle={`${tier.wordLimit} words maximum. ${textOnly ? 'Text only placement.' : `Banner: ${tier.imageSize}.`}`}>
                <div className="space-y-5">
                  <Input label="Company or brand" name="company" required value={creative.company} onChange={setC('company')} error={errors.company} />
                  <Input label="Headline" name="headline" required value={creative.headline} onChange={setC('headline')} error={errors.headline} />
                  <div>
                    <Input
                      label="Ad copy"
                      name="adCopy"
                      as="textarea"
                      rows={6}
                      required
                      value={creative.adCopy}
                      onChange={setC('adCopy')}
                      error={errors.adCopy}
                    />
                    <div className="mt-2 h-1.5 bg-line overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${words > tier.wordLimit ? 'bg-rejected' : 'bg-brand-500'}`} style={{ width: `${Math.min(100, (words / tier.wordLimit) * 100)}%` }} />
                    </div>
                    <p className={`text-xs mt-1 text-right ${words > tier.wordLimit ? 'text-rejected font-semibold' : 'text-muted'}`}>{words} / {tier.wordLimit} words</p>
                  </div>
                  <Input label="Target link" name="targetUrl" type="url" required placeholder="https://yourproduct.com" value={creative.targetUrl} onChange={setC('targetUrl')} error={errors.targetUrl} />

                  {!textOnly && (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ink/80">Banner image <span className="text-brand-500">*</span></label>
                      <label className="mt-1.5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line hover:border-brand-500 bg-mist p-6 cursor-pointer transition">
                        {uploading ? (
                          <span className="text-sm text-muted">Uploading...</span>
                        ) : creative.adImageUrl ? (
                          <img src={creative.adImageUrl} alt="Banner preview" className="max-h-40 pop-in" />
                        ) : (
                          <span className="text-sm text-muted">Click to upload a PNG or JPG (max 1 MB)</span>
                        )}
                        <input type="file" accept="image/png,image/jpeg" onChange={onFile} className="sr-only" />
                      </label>
                      {errors.adImageUrl ? <p className="text-xs text-rejected mt-1 fade-in">{errors.adImageUrl}</p> : <p className="text-xs text-muted mt-1">Recommended size: {tier.imageSize}</p>}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card title="Secure payment" subtitle="Stripe test mode. Your card is only authorized now and charged after approval.">
                {stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <PaymentForm amount={tier.price} onPay={pay} onBack={() => setStep(1)} />
                  </Elements>
                ) : (
                  <p className="text-sm text-rejected">Stripe key missing. Add VITE_STRIPE_PUBLISHABLE_KEY to client/.env and restart the client.</p>
                )}
              </Card>
            )}
          </div>

          {step < 2 && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => (step === 0 ? navigate(`/creators/${creator.id}`) : setStep(step - 1))}>Back</Button>
              <Button size="lg" onClick={next} disabled={uploading}>Continue</Button>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 self-start bg-navy-900 text-white p-6 border-t-4 border-brand-500">
          <h3 className="text-2xl mb-4">Order Summary</h3>
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            {creator.img && <img src={creator.img} alt="" className="w-14 h-14 object-cover" />}
            <div>
              <p className="font-heading text-lg leading-tight">{creator.name}</p>
              <p className="text-xs text-white/60">{tier.name}</p>
            </div>
          </div>
          <dl className="space-y-3 text-sm py-4">
            <div className="flex justify-between"><dt className="text-white/60">Date</dt><dd>{date ? formatDate(date) : 'Not selected'}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Word limit</dt><dd>{tier.wordLimit}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Platform fee</dt><dd>$0</dd></div>
          </dl>
          <div className="flex justify-between items-end pt-4 border-t border-white/10">
            <span className="text-white/60">Total</span>
            <span className="font-heading text-4xl text-brand-500">{money(tier.price)}</span>
          </div>
          <p className="text-xs text-white/60 mt-4">Escrow: your card is authorized now and charged only after the creator approves your ad.</p>
        </aside>
      </section>
    </>
  )
}

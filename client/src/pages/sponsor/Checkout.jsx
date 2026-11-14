import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
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

const steps = ['Select date', 'Ad creative', 'Payment']

export default function Checkout() {
  const { tierId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tiers, creators, slotMap, createBooking } = useData()

  const tier = tiers.find((t) => t.id === tierId)
  const creator = creators.find((c) => c.id === tier?.creatorId)
  const map = creator ? slotMap(creator.id) : {}
  const startDate = params.get('date') || ''
  const validStart = startDate && startDate >= todayKey() && !map[startDate]

  const [step, setStep] = useState(validStart ? 1 : 0)
  const [date, setDate] = useState(validStart ? startDate : '')
  const [creative, setCreative] = useState({ company: user?.name || '', headline: '', adCopy: '', targetUrl: '', adImageUrl: '' })
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

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

  const setCard$ = (field, format) => (e) => {
    setCard({ ...card, [field]: format ? format(e.target.value) : e.target.value })
    clear(field)
  }

  const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }
  const formatCvc = (v) => v.replace(/\D/g, '').slice(0, 4)

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(png|jpe?g)$/.test(file.type)) return setErrors((p) => ({ ...p, adImageUrl: 'Upload a PNG or JPG image.' }))
    if (file.size > 1024 * 1024) return setErrors((p) => ({ ...p, adImageUrl: 'Image must be under 1 MB.' }))
    const reader = new FileReader()
    reader.onload = () => {
      setCreative((p) => ({ ...p, adImageUrl: reader.result }))
      clear('adImageUrl')
    }
    reader.readAsDataURL(file)
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

  const validateCard = () => {
    const e = {}
    const digits = card.number.replace(/\s/g, '')
    const [mm, yy] = card.expiry.split('/').map(Number)
    const now = new Date()
    const curYY = now.getFullYear() % 100
    if (card.name.trim().length < 2) e.name = 'Enter the name on the card.'
    if (digits.length !== 16) e.number = 'Card number must have 16 digits.'
    if (!mm || mm < 1 || mm > 12 || !yy || yy < curYY || (yy === curYY && mm < now.getMonth() + 1)) e.expiry = 'Enter a valid future expiry (MM/YY).'
    if (card.cvc.length < 3) e.cvc = 'Enter the 3 or 4 digit code.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const pay = (ev) => {
    ev.preventDefault()
    if (!validateCard()) return
    if (slotMap(creator.id)[date]) {
      setPayError('Someone just booked this date. Go back and choose another one.')
      return
    }
    setPaying(true)
    setPayError('')
    setTimeout(() => {
      if (card.number.replace(/\s/g, '') === '4000000000000002') {
        setPaying(false)
        setPayError('The card was declined. This sandbox card always fails. Try 4242 4242 4242 4242.')
        return
      }
      const booking = createBooking({
        creatorId: creator.id,
        sponsorId: user.sponsorId,
        tierId: tier.id,
        tierName: tier.name,
        sponsorName: creative.company.trim(),
        sponsorEmail: user.email,
        slotDate: date,
        amount: tier.price,
        headline: creative.headline.trim(),
        adCopy: creative.adCopy.trim(),
        adImageUrl: creative.adImageUrl,
        targetUrl: creative.targetUrl.trim(),
      })
      navigate(`/receipt/${booking.id}`, { replace: true })
    }, 1400)
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
                        {creative.adImageUrl ? (
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
              <Card title="Sandbox payment" subtitle="Test mode. No real money moves.">
                <form onSubmit={pay} className="space-y-5" noValidate>
                  <div className="bg-brand-50 border border-brand-300 p-3 text-xs text-ink">
                    Use test card <strong>4242 4242 4242 4242</strong>, any future date and any 3 digit code. Card <strong>4000 0000 0000 0002</strong> is always declined.
                  </div>
                  <Input label="Name on card" name="cardName" required autoComplete="cc-name" value={card.name} onChange={setCard$('name')} error={errors.name} />
                  <Input label="Card number" name="cardNumber" required inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={card.number} onChange={setCard$('number', formatNumber)} error={errors.number} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" name="expiry" required placeholder="MM/YY" autoComplete="cc-exp" value={card.expiry} onChange={setCard$('expiry', formatExpiry)} error={errors.expiry} />
                    <Input label="CVC" name="cvc" required inputMode="numeric" autoComplete="cc-csc" value={card.cvc} onChange={setCard$('cvc', formatCvc)} error={errors.cvc} />
                  </div>
                  {payError && <p className="text-sm text-rejected bg-red-50 border border-rejected/30 p-3 fade-in">{payError}</p>}
                  <div className="flex justify-between gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(1)} disabled={paying}>Back</Button>
                    <Button type="submit" size="lg" loading={paying}>Authorize {money(tier.price)}</Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {step < 2 && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => (step === 0 ? navigate(`/creators/${creator.id}`) : setStep(step - 1))}>Back</Button>
              <Button size="lg" onClick={next}>Continue</Button>
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

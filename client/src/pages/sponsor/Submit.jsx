import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { isUrl, wordCount } from '../../utils/format'

export default function Submit() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { bookings, tiers, resubmit } = useData()

  const booking = bookings.find((b) => b.id === bookingId && b.sponsorId === user.sponsorId)
  const tier = tiers.find((t) => t.id === booking?.tierId)
  const limit = tier?.wordLimit || 200
  const textOnly = tier ? /none/i.test(tier.imageSize) : !booking?.adImageUrl

  const [form, setForm] = useState({
    headline: booking?.headline || '',
    adCopy: booking?.adCopy || '',
    targetUrl: booking?.targetUrl || '',
    adImageUrl: booking?.adImageUrl || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  if (!booking || booking.status !== 'revision_requested') return <Navigate to="/my-bookings" replace />

  const words = wordCount(form.adCopy)
  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setErrors({ ...errors, [field]: '' })
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(png|jpe?g)$/.test(file.type)) return setErrors({ ...errors, adImageUrl: 'Upload a PNG or JPG image.' })
    if (file.size > 1024 * 1024) return setErrors({ ...errors, adImageUrl: 'Image must be under 1 MB.' })
    const reader = new FileReader()
    reader.onload = () => {
      setForm((p) => ({ ...p, adImageUrl: reader.result }))
      setErrors((p) => ({ ...p, adImageUrl: '' }))
    }
    reader.readAsDataURL(file)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.headline.trim().length < 5) next.headline = 'Headline needs at least 5 characters.'
    if (!form.adCopy.trim()) next.adCopy = 'Write your ad copy.'
    else if (words > limit) next.adCopy = `Copy is ${words} words. This tier allows ${limit}.`
    if (!isUrl(form.targetUrl)) next.targetUrl = 'Enter a full link starting with http:// or https://'
    if (!textOnly && !form.adImageUrl) next.adImageUrl = 'This tier needs a banner image.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSaving(true)
    setTimeout(() => {
      resubmit(booking.id, {
        headline: form.headline.trim(),
        adCopy: form.adCopy.trim(),
        targetUrl: form.targetUrl.trim(),
        adImageUrl: form.adImageUrl,
      })
      navigate('/my-bookings', { replace: true })
    }, 700)
  }

  return (
    <>
      <PageHero eyebrow={booking.tierName} title="Edit Creative" crumb="Resubmit" text="Update your ad using the creator's feedback, then send it back for review." />

      <section className="mx-auto max-w-3xl px-6 py-14 space-y-6">
        {booking.feedbackNote && (
          <div className="bg-sky-50 border-l-4 border-revision p-5 pop-in">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">Creator feedback</p>
            <p className="text-sm text-sky-900">{booking.feedbackNote}</p>
          </div>
        )}

        <Card title="Your creative" subtitle={`${limit} words maximum`}>
          <form onSubmit={submit} className="space-y-5" noValidate>
            <Input label="Headline" name="headline" required value={form.headline} onChange={set('headline')} error={errors.headline} />
            <div>
              <Input label="Ad copy" name="adCopy" as="textarea" rows={6} required value={form.adCopy} onChange={set('adCopy')} error={errors.adCopy} />
              <div className="mt-2 h-1.5 bg-line overflow-hidden">
                <div className={`h-full transition-all duration-300 ${words > limit ? 'bg-rejected' : 'bg-brand-500'}`} style={{ width: `${Math.min(100, (words / limit) * 100)}%` }} />
              </div>
              <p className={`text-xs mt-1 text-right ${words > limit ? 'text-rejected font-semibold' : 'text-muted'}`}>{words} / {limit} words</p>
            </div>
            <Input label="Target link" name="targetUrl" type="url" required value={form.targetUrl} onChange={set('targetUrl')} error={errors.targetUrl} />

            {!textOnly && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-ink/80">Banner image</label>
                <label className="mt-1.5 flex flex-col items-center gap-2 border-2 border-dashed border-line hover:border-brand-500 bg-mist p-6 cursor-pointer transition">
                  {form.adImageUrl ? <img src={form.adImageUrl} alt="Banner preview" className="max-h-40" /> : <span className="text-sm text-muted">Click to upload a PNG or JPG</span>}
                  <input type="file" accept="image/png,image/jpeg" onChange={onFile} className="sr-only" />
                </label>
                {errors.adImageUrl && <p className="text-xs text-rejected mt-1">{errors.adImageUrl}</p>}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" to="/my-bookings">Cancel</Button>
              <Button type="submit" size="lg" loading={saving}>Resubmit for review</Button>
            </div>
          </form>
        </Card>
      </section>
    </>
  )
}

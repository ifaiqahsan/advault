import { useState } from 'react'
import PageHero from '../../components/ui/PageHero'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import SectionTitle from '../../components/ui/SectionTitle'

const info = [
  { title: 'Visit Us', lines: ['245 Example Avenue, Suite 12', 'Lahore, Pakistan'] },
  { title: 'Call Us', lines: ['(042) 61683419'] },
  { title: 'Email Us', lines: ['support@advault.com'] },
  { title: 'Working Hours', lines: ['Mon - Sat 8:00 - 17:30', 'Sunday closed'] },
]

const empty = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.subject.trim().length < 3) next.subject = 'Add a short subject.'
    if (form.message.trim().length < 15) next.message = 'Write at least 15 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm(empty)
    }, 900)
  }

  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact" text="Questions about booking or selling? Send us a message." />

      <section className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2 grid gap-4 content-start">
          {info.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <div className="bg-mist p-6 border-l-4 border-brand-500 lift">
                <h3 className="text-xl text-navy-950">{c.title}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="text-sm text-muted mt-1">{l}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="lg:col-span-3">
          <SectionTitle ghost="Message" title="Send a Message" />
          {sent ? (
            <div className="pop-in bg-green-50 border border-approved/30 p-10 text-center">
              <div className="w-14 h-14 mx-auto grid place-items-center bg-approved text-white text-2xl mb-4">✓</div>
              <h3 className="text-2xl text-navy-950">Message sent</h3>
              <p className="text-sm text-muted mt-2 mb-6">Thanks for reaching out. We reply within one working day.</p>
              <Button variant="outline" onClick={() => setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Your name" name="name" required value={form.name} onChange={update('name')} error={errors.name} />
                <Input label="Email" name="email" type="email" required value={form.email} onChange={update('email')} error={errors.email} />
              </div>
              <Input label="Subject" name="subject" required value={form.subject} onChange={update('subject')} error={errors.subject} />
              <Input label="Message" name="message" as="textarea" rows={6} required value={form.message} onChange={update('message')} error={errors.message} />
              <Button type="submit" size="lg" loading={sending}>Send message</Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { isUrl } from '../../../utils/format'

export default function ProfileForm({ initialData, onSave }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'newsletter',
    bio: initialData?.bio || '',
    audienceSize: initialData?.audienceSize ? String(initialData.audienceSize) : '',
    website: initialData?.website || '',
    img: initialData?.img || '',
    twitter: initialData?.social?.twitter || '',
    linkedin: initialData?.social?.linkedin || '',
    github: initialData?.social?.github || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const change = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    const size = Number(form.audienceSize)
    if (!form.name.trim()) e.name = 'Publication name is required.'
    if (form.bio.trim().length < 15) e.bio = 'Write at least 15 characters about your audience.'
    if (!form.audienceSize.trim() || !Number.isInteger(size) || size <= 0) e.audienceSize = 'Enter a positive whole number.'
    if (!isUrl(form.website)) e.website = 'Enter a full link starting with http:// or https://'
    if (form.img && !isUrl(form.img)) e.img = 'Enter a valid image link.'
    ;['twitter', 'linkedin', 'github'].forEach((k) => {
      if (form[k] && !isUrl(form[k])) e[k] = 'Enter a valid link.'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      onSave({
        ...initialData,
        name: form.name.trim(),
        type: form.type,
        bio: form.bio.trim(),
        audienceSize: parseInt(form.audienceSize, 10),
        website: form.website.trim(),
        img: form.img.trim(),
        social: {
          twitter: form.twitter.trim() || undefined,
          linkedin: form.linkedin.trim() || undefined,
          github: form.github.trim() || undefined,
        },
      })
      setSaving(false)
    }, 350)
  }

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <div className="space-y-4">
        <h4 className="text-lg text-ink border-b border-line pb-2">General information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Publication name" name="name" required value={form.name} onChange={change} error={errors.name} />
          <Input label="Format" name="type" as="select" required value={form.type} onChange={change}>
            <option value="newsletter">Newsletter</option>
            <option value="podcast">Podcast</option>
            <option value="opensource">Open source project</option>
            <option value="youtube">YouTube channel</option>
          </Input>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Audience size" name="audienceSize" type="number" min="1" required helperText="Subscribers, listeners or monthly users." value={form.audienceSize} onChange={change} error={errors.audienceSize} />
          <Input label="Website" name="website" type="url" required placeholder="https://yoursite.com" value={form.website} onChange={change} error={errors.website} />
        </div>
        <Input label="Cover image link" name="img" type="url" placeholder="https://images.unsplash.com/..." helperText="Shown on your marketplace card." value={form.img} onChange={change} error={errors.img} />
        <Input label="Bio" name="bio" as="textarea" rows={4} required helperText="Sponsors read this before they book." value={form.bio} onChange={change} error={errors.bio} />
      </div>

      <div className="space-y-4">
        <h4 className="text-lg text-ink border-b border-line pb-2">Social profiles</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="X profile" name="twitter" type="url" placeholder="https://x.com/you" value={form.twitter} onChange={change} error={errors.twitter} />
          <Input label="LinkedIn" name="linkedin" type="url" placeholder="https://linkedin.com/in/you" value={form.linkedin} onChange={change} error={errors.linkedin} />
          <Input label="GitHub" name="github" type="url" placeholder="https://github.com/you" value={form.github} onChange={change} error={errors.github} />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-line">
        <Button type="submit" size="lg" loading={saving}>Save profile</Button>
      </div>
    </form>
  )
}

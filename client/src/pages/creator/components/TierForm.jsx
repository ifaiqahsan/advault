import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function TierForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    wordLimit: initialData?.wordLimit !== undefined ? String(initialData.wordLimit) : '',
    imageSize: initialData?.imageSize || '',
    slotsOpen: initialData?.slotsOpen !== undefined ? String(initialData.slotsOpen) : '5',
    description: initialData?.description || '',
    perks: initialData?.perks ? initialData.perks.join(', ') : '',
  })
  const [errors, setErrors] = useState({})

  const change = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    const price = parseFloat(form.price)
    const words = Number(form.wordLimit)
    const slots = Number(form.slotsOpen)
    if (!form.name.trim()) e.name = 'Tier name is required.'
    if (!form.price.trim() || isNaN(price) || price <= 0) e.price = 'Enter a price above $0.'
    if (!form.wordLimit.trim() || !Number.isInteger(words) || words <= 0) e.wordLimit = 'Enter a whole number of words.'
    if (!form.imageSize.trim()) e.imageSize = 'Enter a size like 1200x628 px, or None for text only.'
    if (!Number.isInteger(slots) || slots < 0) e.slotsOpen = 'Enter 0 or more open slots.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: form.name.trim(),
      price: parseFloat(form.price),
      wordLimit: parseInt(form.wordLimit, 10),
      imageSize: form.imageSize.trim(),
      slotsOpen: parseInt(form.slotsOpen, 10),
      description: form.description.trim(),
      perks: form.perks.split(',').map((p) => p.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Input label="Tier name" name="name" required placeholder="Primary Header Sponsor" value={form.name} onChange={change} error={errors.name} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Price (USD)" name="price" type="number" min="1" step="any" required value={form.price} onChange={change} error={errors.price} />
        <Input label="Word limit" name="wordLimit" type="number" min="1" required value={form.wordLimit} onChange={change} error={errors.wordLimit} />
        <Input label="Open slots" name="slotsOpen" type="number" min="0" required value={form.slotsOpen} onChange={change} error={errors.slotsOpen} />
      </div>
      <Input label="Image specification" name="imageSize" required placeholder="1200x628 px (PNG/JPG) or None" helperText="Enter None for text-only placements." value={form.imageSize} onChange={change} error={errors.imageSize} />
      <Input label="Placement description" name="description" as="textarea" rows={3} placeholder="Where does the ad appear?" value={form.description} onChange={change} />
      <Input label="Perks (comma separated)" name="perks" placeholder="Top banner, Social shoutout" value={form.perks} onChange={change} />
      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update tier' : 'Create tier'}</Button>
      </div>
    </form>
  )
}

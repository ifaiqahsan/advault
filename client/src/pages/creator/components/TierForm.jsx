import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

/**
 * TierForm Component
 * Used inside a Modal for both creating and editing sponsorship tiers.
 *
 * Props:
 * - initialData: existing tier object (when editing) or null (when creating)
 * - onSubmit: function(formData) invoked when validation passes
 * - onCancel: function() invoked to dismiss the form
 */
export default function TierForm({ initialData, onSubmit, onCancel }) {
  // Local form state initialized from initialData or defaults
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    wordLimit: initialData?.wordLimit !== undefined ? String(initialData.wordLimit) : '',
    imageSize: initialData?.imageSize || '',
    description: initialData?.description || '',
    perksString: initialData?.perks ? initialData.perks.join(', ') : '',
  })

  // State to hold field-level error messages
  const [errors, setErrors] = useState({})

  // Handle generic text/number input changes and clear the field's error
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for the current field as the user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Validate form fields according to business rules
  const validate = () => {
    const newErrors = {}

    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Tier name is required.'
    }

    // Price must be a positive number greater than 0
    const priceNum = parseFloat(formData.price)
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required.'
    } else if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be a valid amount greater than $0.'
    }

    // Word limit must be a positive whole integer
    const wordLimitNum = Number(formData.wordLimit)
    if (!formData.wordLimit.trim()) {
      newErrors.wordLimit = 'Word limit is required.'
    } else if (
      isNaN(wordLimitNum) ||
      wordLimitNum <= 0 ||
      !Number.isInteger(wordLimitNum)
    ) {
      newErrors.wordLimit = 'Word limit must be a positive whole number.'
    }

    // Image size specification is required
    if (!formData.imageSize.trim()) {
      newErrors.imageSize = 'Image size specification is required (e.g. 1200x628 px or None).'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Convert comma-separated perks string into clean array
    const perks = formData.perksString
      ? formData.perksString
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

    // Construct cleaned payload
    const submissionData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      wordLimit: parseInt(formData.wordLimit, 10),
      imageSize: formData.imageSize.trim(),
      description: formData.description.trim(),
      perks,
    }

    onSubmit(submissionData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tier Name */}
      <Input
        label="Tier Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Primary Header Sponsor"
        error={errors.name}
        required
      />

      {/* Grid: Price and Word Limit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Price ($ USD)"
          name="price"
          type="number"
          min="1"
          step="any"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. 450"
          error={errors.price}
          required
        />

        <Input
          label="Word Limit (words)"
          name="wordLimit"
          type="number"
          min="1"
          step="1"
          value={formData.wordLimit}
          onChange={handleChange}
          placeholder="e.g. 120"
          error={errors.wordLimit}
          required
        />
      </div>

      {/* Image Size Specifications */}
      <Input
        label="Image Specification"
        name="imageSize"
        value={formData.imageSize}
        onChange={handleChange}
        placeholder="e.g. 1200x628 px (PNG/JPG) or None"
        error={errors.imageSize}
        helperText="Specify dimensions or enter 'None' if text-only."
        required
      />

      {/* Tier Description */}
      <Input
        label="Placement Description"
        name="description"
        as="textarea"
        rows={3}
        value={formData.description}
        onChange={handleChange}
        placeholder="Explain where this ad appears in your media..."
        helperText="Brief summary of where sponsor copy will be featured."
      />

      {/* Perks / Deliverables */}
      <Input
        label="Perks / Deliverables (comma-separated)"
        name="perksString"
        value={formData.perksString}
        onChange={handleChange}
        placeholder="e.g. Top banner, Social shoutout, Click tracking"
        helperText="Separate multiple deliverables with a comma."
      />

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-line mt-6">
        <Button variant="outline" size="md" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="md" type="submit">
          {initialData ? 'Update Tier' : 'Create Tier'}
        </Button>
      </div>
    </form>
  )
}


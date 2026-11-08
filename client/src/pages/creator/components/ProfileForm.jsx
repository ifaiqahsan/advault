import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

/**
 * ProfileForm Component
 * Manages media publication details, category, audience numbers, and external links.
 *
 * Props:
 * - initialData: existing creator profile object
 * - onSave: function(updatedProfile) invoked when validation passes
 */
export default function ProfileForm({ initialData, onSave }) {
  // Local form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'newsletter',
    bio: initialData?.bio || '',
    audienceSize: initialData?.audienceSize !== undefined ? String(initialData.audienceSize) : '',
    website: initialData?.website || '',
    twitter: initialData?.social?.twitter || '',
    linkedin: initialData?.social?.linkedin || '',
    github: initialData?.social?.github || '',
  })

  // Inline error state
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // URL validation helper using browser URL API
  const isValidUrl = (urlString) => {
    if (!urlString || !urlString.trim()) return true
    try {
      const parsed = new URL(urlString.trim())
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  // Input change handler clearing field-level errors
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Field validation logic
  const validate = () => {
    const newErrors = {}

    // Media Name
    if (!formData.name.trim()) {
      newErrors.name = 'Media publication name is required.'
    }

    // Media Type
    if (!formData.type) {
      newErrors.type = 'Media format type is required.'
    }

    // Bio
    if (!formData.bio.trim()) {
      newErrors.bio = 'Publication bio/description is required.'
    } else if (formData.bio.trim().length < 15) {
      newErrors.bio = 'Bio should be at least 15 characters to describe your audience.'
    }

    // Audience Size: positive number
    const audienceNum = Number(formData.audienceSize)
    if (!formData.audienceSize.trim()) {
      newErrors.audienceSize = 'Audience size is required.'
    } else if (isNaN(audienceNum) || audienceNum <= 0 || !Number.isInteger(audienceNum)) {
      newErrors.audienceSize = 'Audience size must be a positive whole number (e.g. 45000).'
    }

    // Website: required and must be valid URL
    if (!formData.website.trim()) {
      newErrors.website = 'Primary website URL is required.'
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL including http:// or https://'
    }

    // Optional social links validation
    if (formData.twitter && !isValidUrl(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid URL (e.g. https://x.com/yourhandle).'
    }

    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid URL (e.g. https://linkedin.com/in/...).'
    }

    if (formData.github && !isValidUrl(formData.github)) {
      newErrors.github = 'Please enter a valid URL (e.g. https://github.com/...).'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submission handler
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    const updatedProfile = {
      ...initialData,
      name: formData.name.trim(),
      type: formData.type,
      bio: formData.bio.trim(),
      audienceSize: parseInt(formData.audienceSize, 10),
      website: formData.website.trim(),
      social: {
        twitter: formData.twitter.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined,
        github: formData.github.trim() || undefined,
      },
    }

    // Simulate save and notify parent
    setTimeout(() => {
      onSave(updatedProfile)
      setIsSubmitting(false)
    }, 200)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Media Information */}
      <div className="space-y-4">
        <h4 className="font-heading text-lg font-bold text-ink uppercase tracking-wide border-b border-line pb-2">
          1. General Media Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Media / Publication Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. TechBytes Weekly"
            error={errors.name}
            required
          />

          {/* Media Format Type Selector */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="type"
              className="text-xs font-semibold uppercase tracking-wider text-ink/80 flex items-center justify-between"
            >
              <span>
                Media Format <span className="text-brand-500">*</span>
              </span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-paper text-ink border border-line rounded-sm transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="newsletter">Newsletter (Email / Substack)</option>
              <option value="podcast">Podcast (Audio / Video)</option>
              <option value="open source">Open Source Project / Developer Tool</option>
              <option value="youtube">YouTube Channel</option>
            </select>
            {errors.type && (
              <p className="text-xs text-rejected font-medium">{errors.type}</p>
            )}
          </div>
        </div>

        {/* Audience Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Audience / Subscriber Count"
            name="audienceSize"
            type="number"
            min="1"
            step="1"
            value={formData.audienceSize}
            onChange={handleChange}
            placeholder="e.g. 45000"
            error={errors.audienceSize}
            helperText="Total verified email subscribers, listeners, or monthly active users."
            required
          />

          <Input
            label="Official Website URL"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://techbytes.dev"
            error={errors.website}
            required
          />
        </div>

        {/* Bio / Description */}
        <Input
          label="Publication Bio / Audience Description"
          name="bio"
          as="textarea"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Describe your content niche, readership demographics, frequency, and topics covered..."
          error={errors.bio}
          helperText="This overview is displayed to sponsors browsing the public marketplace."
          required
        />
      </div>

      {/* Social & Channel Links */}
      <div className="space-y-4 pt-2">
        <h4 className="font-heading text-lg font-bold text-ink uppercase tracking-wide border-b border-line pb-2">
          2. Social Profiles & Channel Links
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="X (Twitter) Profile URL"
            name="twitter"
            type="url"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="https://x.com/techbytes"
            error={errors.twitter}
          />

          <Input
            label="LinkedIn Profile or Company URL"
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/company/techbytes"
            error={errors.linkedin}
          />

          <Input
            label="GitHub Repository or Org URL"
            name="github"
            type="url"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/techbytes"
            error={errors.github}
          />
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-line">
        <Button
          variant="primary"
          size="lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  )
}


const pad = (n) => String(n).padStart(2, '0')

export const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayKey = () => dateKey(new Date())
export const money = (n) => `$${Number(n || 0).toLocaleString()}`
export const compact = (n) => new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(n || 0))
export const wordCount = (t) => (t && t.trim() ? t.trim().split(/\s+/).length : 0)

export const formatDate = (s) => {
  if (!s) return '-'
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatStamp = (iso) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export const isUrl = (s) => {
  try {
    const u = new URL(String(s).trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const lowestPrice = (tiers, creatorId) => {
  const prices = tiers.filter((t) => t.creatorId === creatorId).map((t) => Number(t.price))
  return prices.length ? Math.min(...prices) : 0
}

export const typeLabel = {
  newsletter: 'Newsletter',
  podcast: 'Podcast',
  opensource: 'Open Source',
  youtube: 'YouTube',
}

export const statusLabel = {
  pending: 'Pending Review',
  approved: 'Approved',
  revision_requested: 'Revision Requested',
  rejected: 'Rejected',
}

export const img = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

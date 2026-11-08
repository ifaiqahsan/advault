export const mockTiers = [
  {
    id: 'tier-1',
    creatorId: 'creator-1',
    name: 'Primary Header Sponsor',
    price: 450,
    wordLimit: 120,
    imageSize: '1200x628 px (PNG/JPG)',
    description: 'Prominent top-of-issue placement right under the masthead with dedicated logo, call to action, and link.',
    perks: ['Top masthead placement', '120 words copy', 'Click tracking analytics', 'Social shoutout on X'],
    slotsOpen: 4,
  },
  {
    id: 'tier-2',
    creatorId: 'creator-1',
    name: 'Mid-Issue Featured Spotlight',
    price: 300,
    wordLimit: 80,
    imageSize: '600x400 px (PNG/JPG)',
    description: 'Contextual feature block positioned directly between the two most-read articles of the week.',
    perks: ['Mid-issue prominence', '80 words copy', 'Single target URL link'],
    slotsOpen: 3,
  },
  {
    id: 'tier-3',
    creatorId: 'creator-1',
    name: 'Footer Classified / Tool of Week',
    price: 150,
    wordLimit: 40,
    imageSize: 'None (Text Only)',
    description: 'A crisp 40-word highlight in our curated developer tools directory at the bottom of the email.',
    perks: ['Bottom tool directory', '40 words copy', 'Permanent archive backlink'],
    slotsOpen: 8,
  },
  {
    id: 'tier-4',
    creatorId: 'creator-2',
    name: 'Podcast Pre-Roll (30s)',
    price: 550,
    wordLimit: 75,
    imageSize: '3000x3000 px (Cover Art)',
    description: 'Host-read 30 second promotion at the very beginning of the podcast episode.',
    perks: ['Host voiceover', 'First 60 seconds of show', 'Show notes link'],
    slotsOpen: 2,
  },
  { id: 1, creatorId: 1, name: 'Classified', price: 120, wordLimit: 50, imageSize: null, slotsOpen: 8 },
  { id: 2, creatorId: 1, name: 'Featured', price: 250, wordLimit: 120, imageSize: '600x300', slotsOpen: 4 },
  { id: 3, creatorId: 2, name: 'Mid-roll Mention', price: 200, wordLimit: 80, imageSize: null, slotsOpen: 6 },
  { id: 4, creatorId: 2, name: 'Episode Sponsor', price: 450, wordLimit: 150, imageSize: '1200x600', slotsOpen: 3 },
  { id: 5, creatorId: 3, name: 'README Badge', price: 80, wordLimit: 30, imageSize: '300x100', slotsOpen: 10 },
  { id: 6, creatorId: 3, name: 'Docs Banner', price: 220, wordLimit: 60, imageSize: '1200x300', slotsOpen: 5 },
  { id: 7, creatorId: 4, name: 'Classified', price: 150, wordLimit: 60, imageSize: null, slotsOpen: 7 },
  { id: 8, creatorId: 4, name: 'Headline Sponsor', price: 350, wordLimit: 200, imageSize: '1200x600', slotsOpen: 2 },
  { id: 9, creatorId: 5, name: 'Pre-roll Mention', price: 180, wordLimit: 70, imageSize: null, slotsOpen: 6 },
  { id: 10, creatorId: 5, name: 'Show Notes Feature', price: 300, wordLimit: 120, imageSize: '800x400', slotsOpen: 4 },
  { id: 11, creatorId: 6, name: 'README Badge', price: 60, wordLimit: 30, imageSize: '300x100', slotsOpen: 9 },
  { id: 12, creatorId: 6, name: 'Docs Banner', price: 140, wordLimit: 60, imageSize: '1200x300', slotsOpen: 5 },
]

export const tiersFor = (creatorId) =>
  mockTiers.filter(
    (t) =>
      String(t.creatorId) === String(creatorId) ||
      (String(creatorId) === 'creator-1' && t.creatorId === 1) ||
      (String(creatorId) === '1' && t.creatorId === 'creator-1') ||
      (String(creatorId) === 'creator-2' && t.creatorId === 2) ||
      (String(creatorId) === '2' && t.creatorId === 'creator-2')
  )

export const fromPrice = (creatorId) => {
  const tiers = tiersFor(creatorId)
  if (!tiers || tiers.length === 0) return 120
  return Math.min(...tiers.map((t) => t.price))
}

export default mockTiers

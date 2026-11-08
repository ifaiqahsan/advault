export const mockTiers = [
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

export const tiersFor = (creatorId) => mockTiers.filter((t) => t.creatorId === creatorId)

export const fromPrice = (creatorId) =>
  Math.min(...tiersFor(creatorId).map((t) => t.price))
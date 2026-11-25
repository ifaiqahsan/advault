// Run with: npm run seed   (deletes old data and loads demo data)
require('dotenv').config({ quiet: true })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('./config/db')
const User = require('./models/User')
const Creator = require('./models/Creator')
const Tier = require('./models/Tier')
const Booking = require('./models/Booking')
const Notification = require('./models/Notification')

// Dates relative to today, so the demo always has past and future bookings
const pad = (n) => String(n).padStart(2, '0')
const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

const creators = [
  { key: 'c1', name: 'TechBytes Weekly', handle: 'techbytes', email: 'creator@advault.com', owner: 'Cara Lee', img: photo('photo-1494790108377-be9c29b29330'), type: 'newsletter', bio: 'Curated weekly breakdown of developer tooling, open source projects, and software engineering architecture.', audienceSize: 45000, website: 'https://techbytes.dev', social: { twitter: 'https://x.com/techbytes', linkedin: 'https://linkedin.com/company/techbytes', github: 'https://github.com/techbytes' }, verified: true, lockedDates: [day(2), day(3)] },
  { key: 'c2', name: 'Syntax & Chill Podcast', handle: 'syntaxchill', email: 'alex@syntaxchill.fm', owner: 'Alex Kim', img: photo('photo-1534528741775-53994a69daeb'), type: 'podcast', bio: 'Bi-weekly conversational tech podcast diving into frontend frameworks, backend scaling, and founder stories.', audienceSize: 28000, website: 'https://syntaxchill.fm', social: { twitter: 'https://x.com/syntaxchill' }, verified: true },
  { key: 'c3', name: 'OpenForge Docs', handle: 'openforge', email: 'team@openforge.dev', owner: 'Jordan Ray', img: photo('photo-1507003211169-0a1dd7228f2d'), type: 'opensource', bio: 'A popular open-source documentation toolkit used by thousands of developer teams every month.', audienceSize: 12000, website: 'https://openforge.dev', social: { github: 'https://github.com/openforge' }, verified: true },
  { key: 'c4', name: 'The Daily Byte', handle: 'dailybyte', email: 'megan@dailybyte.news', owner: 'Megan Ali', img: photo('photo-1438761681033-6461ffad8d80'), type: 'newsletter', bio: 'A short daily email with the one software story worth your morning coffee, read by engineers and founders.', audienceSize: 31000, website: 'https://dailybyte.news', social: { twitter: 'https://x.com/dailybyte', linkedin: 'https://linkedin.com/company/dailybyte' }, verified: false },
  { key: 'c5', name: 'Code & Coffee', handle: 'codecoffee', email: 'omar@codecoffee.fm', owner: 'Omar Shah', img: photo('photo-1500648767791-00dcc994a43e'), type: 'podcast', bio: 'Weekly interviews with engineers about the tools, habits and mistakes that shaped their careers.', audienceSize: 19000, website: 'https://codecoffee.fm', social: { twitter: 'https://x.com/codecoffee' }, verified: true },
  { key: 'c6', name: 'RustLane Library', handle: 'rustlane', email: 'hello@rustlane.rs', owner: 'Nina Park', img: photo('photo-1544005313-94ddf0286df2'), type: 'opensource', bio: 'A fast-growing Rust utility library with an active contributor community and a busy docs site.', audienceSize: 8500, website: 'https://rustlane.rs', social: { github: 'https://github.com/rustlane' }, verified: false },
]

const tiers = [
  { key: 't1', creator: 'c1', name: 'Primary Header Sponsor', price: 450, wordLimit: 120, imageSize: '1200x628 px (PNG/JPG)', description: 'Prominent top-of-issue placement right under the masthead with logo, call to action, and link.', perks: ['Top masthead placement', '120 words copy', 'Click tracking analytics', 'Social shoutout on X'], slotsOpen: 4 },
  { key: 't2', creator: 'c1', name: 'Mid-Issue Featured Spotlight', price: 300, wordLimit: 80, imageSize: '600x400 px (PNG/JPG)', description: 'Contextual feature block placed between the two most-read articles of the week.', perks: ['Mid-issue prominence', '80 words copy', 'Single target URL link'], slotsOpen: 3 },
  { key: 't3', creator: 'c1', name: 'Footer Classified', price: 150, wordLimit: 40, imageSize: 'None (Text Only)', description: 'A crisp 40-word highlight in the developer tools directory at the bottom of the email.', perks: ['Bottom tool directory', '40 words copy', 'Permanent archive backlink'], slotsOpen: 8 },
  { key: 't4', creator: 'c2', name: 'Podcast Pre-Roll (30s)', price: 550, wordLimit: 75, imageSize: '3000x3000 px (Cover Art)', description: 'Host-read 30 second promotion at the very beginning of the episode.', perks: ['Host voiceover', 'First 60 seconds of show', 'Show notes link'], slotsOpen: 2 },
  { key: 't5', creator: 'c2', name: 'Mid-Roll Mention', price: 200, wordLimit: 80, imageSize: 'None (Text Only)', description: 'A relaxed mid-episode mention read by the hosts.', perks: ['Host read', 'Show notes link'], slotsOpen: 6 },
  { key: 't6', creator: 'c3', name: 'README Badge', price: 80, wordLimit: 30, imageSize: '300x100 px (PNG)', description: 'A sponsor badge at the top of the project README.', perks: ['README placement', 'Link to your site'], slotsOpen: 10 },
  { key: 't7', creator: 'c3', name: 'Docs Banner', price: 220, wordLimit: 60, imageSize: '1200x300 px (PNG/JPG)', description: 'A banner shown across every documentation page for the booked week.', perks: ['Site-wide banner', '60 words copy', 'Click tracking analytics'], slotsOpen: 5 },
  { key: 't8', creator: 'c4', name: 'Classified', price: 150, wordLimit: 60, imageSize: 'None (Text Only)', description: 'A text-only classified block in the daily email.', perks: ['60 words copy', 'Single link'], slotsOpen: 7 },
  { key: 't9', creator: 'c4', name: 'Headline Sponsor', price: 350, wordLimit: 200, imageSize: '1200x600 px (PNG/JPG)', description: 'The first block of the email, with banner image and extended copy.', perks: ['Top of email', '200 words copy', 'Exclusive for the day'], slotsOpen: 2 },
  { key: 't10', creator: 'c5', name: 'Pre-roll Mention', price: 180, wordLimit: 70, imageSize: 'None (Text Only)', description: 'A short read at the start of the episode.', perks: ['Host read', 'Show notes link'], slotsOpen: 6 },
  { key: 't11', creator: 'c5', name: 'Show Notes Feature', price: 300, wordLimit: 120, imageSize: '800x400 px (PNG/JPG)', description: 'A featured block at the top of the show notes page.', perks: ['Featured block', '120 words copy', 'Click tracking analytics'], slotsOpen: 4 },
  { key: 't12', creator: 'c6', name: 'README Badge', price: 60, wordLimit: 30, imageSize: '300x100 px (PNG)', description: 'A sponsor badge on the project README.', perks: ['README placement'], slotsOpen: 9 },
  { key: 't13', creator: 'c6', name: 'Docs Banner', price: 140, wordLimit: 60, imageSize: '1200x300 px (PNG/JPG)', description: 'A banner across the docs site for one week.', perks: ['Site-wide banner', '60 words copy'], slotsOpen: 5 },
]

// Demo bookings have no Stripe payment (approving/rejecting them skips Stripe).
const bookings = [
  { tier: 't1', sponsor: 's1', sponsorName: 'Supabase DevRel', slotDate: day(-11), status: 'approved', paymentStatus: 'captured', clicks: 312, headline: 'Build in a weekend, scale to millions', adCopy: 'Supabase is an open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.', adImageUrl: photo('photo-1618005182384-a83a8bd57fbe'), targetUrl: 'https://supabase.com', submittedAt: day(-25) },
  { tier: 't2', sponsor: 's1', sponsorName: 'Linear App', slotDate: day(4), status: 'pending', paymentStatus: 'authorized', clicks: 0, headline: 'Issue tracking built for high-performance software teams', adCopy: 'Meet the new standard for modern software development. Streamline issues, sprints, and product roadmaps with unmatched speed and keyboard-first navigation.', adImageUrl: photo('photo-1507238691740-187a5b1d37b8'), targetUrl: 'https://linear.app', submittedAt: day(-2) },
  { tier: 't1', sponsor: 's1', sponsorName: 'PostHog Cloud', slotDate: day(7), status: 'revision_requested', paymentStatus: 'authorized', clicks: 0, headline: 'The all-in-one developer analytics platform', adCopy: 'Product analytics, session recording, feature flags, A/B testing, and surveys in one platform that you can self-host or use in the cloud.', adImageUrl: photo('photo-1551288049-bebda4e38f71'), targetUrl: 'https://posthog.com', feedbackNote: 'Please trim the secondary clause so the copy fits the header format.', submittedAt: day(-3) },
  { tier: 't3', sponsor: 's1', sponsorName: 'QuickScrape AI', slotDate: day(-8), status: 'rejected', paymentStatus: 'released', clicks: 0, headline: 'Scrape any site without getting blocked', adCopy: 'Extract web data using proxy rotators and headless puppeteer scripts at 10x cheaper prices.', adImageUrl: '', targetUrl: 'https://quickscrape.io', feedbackNote: 'Our publication policy does not accept tools that bypass anti-bot terms of service.', submittedAt: day(-20) },
  { tier: 't2', sponsor: 's2', sponsorName: 'Sentry', slotDate: day(10), status: 'approved', paymentStatus: 'captured', clicks: 148, headline: 'Stop hoping your code works. Know it does with Sentry.', adCopy: 'Code breaks. Sentry error monitoring provides real-time stack traces and performance metrics so you fix bugs before users complain.', adImageUrl: photo('photo-1526374965328-7f61d4dc18c5'), targetUrl: 'https://sentry.io', submittedAt: day(-6) },
  { tier: 't5', sponsor: 's1', sponsorName: 'Supabase DevRel', slotDate: day(-6), status: 'approved', paymentStatus: 'captured', clicks: 87, headline: 'Ship your backend before lunch', adCopy: 'Postgres, auth and storage in one dashboard. Start free and scale when you are ready.', adImageUrl: '', targetUrl: 'https://supabase.com', submittedAt: day(-24) },
]

async function seed() {
  await connectDB()
  await Promise.all([User.deleteMany(), Creator.deleteMany(), Tier.deleteMany(), Booking.deleteMany(), Notification.deleteMany()])

  // Sponsors
  const sponsors = {
    s1: await User.create({ name: 'Sam Carter', email: 'sponsor@advault.com', password: await bcrypt.hash('sponsor123', 10), role: 'sponsor' }),
    s2: await User.create({ name: 'Sentry Partnerships', email: 'sponsor2@advault.com', password: await bcrypt.hash('sponsor123', 10), role: 'sponsor' }),
  }

  // Creators (each has a login; password creator123)
  const creatorDocs = {}
  for (const c of creators) {
    const { key, owner, ...data } = c
    const user = await User.create({ name: owner, email: c.email, password: await bcrypt.hash('creator123', 10), role: 'creator' })
    const creator = await Creator.create({ ...data, user: user._id })
    user.creatorId = creator._id
    await user.save()
    creatorDocs[key] = creator
  }

  // Tiers
  const tierDocs = {}
  for (const t of tiers) {
    const { key, creator, ...data } = t
    tierDocs[key] = await Tier.create({ ...data, creatorId: creatorDocs[creator]._id })
  }

  // Bookings
  for (const b of bookings) {
    const tier = tierDocs[b.tier]
    const sponsor = sponsors[b.sponsor]
    const { tier: _t, sponsor: _s, ...data } = b
    await Booking.create({ ...data, tierId: tier._id, tierName: tier.name, creatorId: tier.creatorId, sponsorId: sponsor._id, sponsorEmail: sponsor.email, amount: tier.price })
  }

  console.log('Seed done: 2 sponsors, 6 creators, 13 tiers, 6 bookings')
  console.log('Log in with creator@advault.com / creator123 or sponsor@advault.com / sponsor123')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})

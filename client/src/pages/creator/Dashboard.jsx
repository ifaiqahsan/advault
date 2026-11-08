import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { mockBookings } from '../../data/mockBookings'
import { mockTiers } from '../../data/mockTiers'
import { mockCreators } from '../../data/mockCreators'

import StatCard from './components/StatCard'
import UpcomingSlots from './components/UpcomingSlots'

/**
 * Dashboard Page Component
 * Main overview portal for creators displaying financial metrics, pending review items,
 * and upcoming slot fulfillment schedules.
 */
export default function Dashboard() {
  // 1. Current authenticated creator from AuthContext
  const { user } = useAuth()
  const targetCreatorId = user?.creatorId || (user?.role === 'creator' ? 'creator-1' : 'creator-1')
  const currentCreator =
    mockCreators.find((c) => c.id === targetCreatorId) ||
    user || { id: 'creator-1', name: 'TechBytes Weekly' }

  // 2. Local state for bookings and tiers belonging to current creator
  const [bookings] = useState(() => {
    return mockBookings.filter(
      (b) => b.creatorId === targetCreatorId || b.creatorId === 'creator-1'
    )
  })

  const [tiers] = useState(() => {
    return mockTiers.filter(
      (t) => t.creatorId === targetCreatorId || t.creatorId === 'creator-1'
    )
  })

  // 3. Derived KPIs using useMemo
  const metrics = useMemo(() => {
    // Total earnings from approved sponsorships
    const totalEarnings = bookings
      .filter((b) => b.status === 'approved')
      .reduce((sum, b) => sum + Number(b.amount || 0), 0)

    // Pending submissions awaiting creator action
    const pendingCount = bookings.filter((b) => b.status === 'pending').length

    // Active confirmed bookings
    const approvedCount = bookings.filter((b) => b.status === 'approved').length

    // Total inventory tiers configured
    const activeTiersCount = tiers.length

    return {
      totalEarnings,
      pendingCount,
      approvedCount,
      activeTiersCount,
    }
  }, [bookings, tiers])

  // 4. Sorted upcoming slots (chronological by slotDate)
  const upcomingSlots = useMemo(() => {
    return [...bookings].sort((a, b) => (a.slotDate > b.slotDate ? 1 : -1))
  }, [bookings])

  return (
    <DashboardLayout
      title={`Welcome back, ${currentCreator.name || 'Creator'}`}
      subtitle="Here is an overview of your sponsorship revenue, ad submissions, and scheduled publication slots."
      action={
        <div className="flex items-center gap-3">
          <Link to="/creator/reviews">
            <Button variant="primary" size="md">
              Review Submissions ({metrics.pendingCount})
            </Button>
          </Link>
          <Link to="/creator/tiers">
            <Button variant="outline" size="md">
              Manage Tiers
            </Button>
          </Link>
        </div>
      }
    >
      {/* Pending Attention Notice Banner (if any submissions pending) */}
      {metrics.pendingCount > 0 && (
        <div className="mb-8 p-4 rounded-sm bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {metrics.pendingCount}
            </span>
            <div>
              <p className="font-semibold text-amber-900 text-sm">
                Sponsor Creatives Awaiting Your Review
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                You have {metrics.pendingCount} ad creative submission
                {metrics.pendingCount > 1 ? 's' : ''} awaiting approval or revision feedback.
              </p>
            </div>
          </div>
          <Link to="/creator/reviews" className="shrink-0">
            <Button variant="secondary" size="sm">
              Open Review Queue →
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Earnings"
          value={`$${metrics.totalEarnings.toLocaleString()}`}
          subtitle="Revenue from approved sponsorship slots"
          icon="$"
          highlight={true}
        />

        <StatCard
          title="Pending Submissions"
          value={String(metrics.pendingCount)}
          subtitle={
            metrics.pendingCount > 0
              ? 'Action required in review queue'
              : 'All sponsor copy up to date'
          }
          icon="⏳"
          highlight={metrics.pendingCount > 0}
        />

        <StatCard
          title="Confirmed Bookings"
          value={String(metrics.approvedCount)}
          subtitle="Approved ad slots ready for publication"
          icon="✓"
        />

        <StatCard
          title="Active Inventory Tiers"
          value={String(metrics.activeTiersCount)}
          subtitle="Packages available on your marketplace listing"
          icon="📦"
        />
      </div>

      {/* Main Content: Upcoming Slots Table */}
      <div className="space-y-8">
        <UpcomingSlots slots={upcomingSlots} />

        {/* Quick Tips / System Guidelines Card */}
        <Card
          title="Creator Studio Workflow"
          subtitle="Best practices for maintaining high sponsor retention"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-3 bg-mist rounded-sm border border-line">
              <span className="font-heading uppercase font-bold text-ink block text-xs tracking-wider mb-1">
                1. Review Promptly
              </span>
              <p className="text-xs text-muted leading-relaxed">
                Aim to approve or request revisions within 48 hours so sponsors have ample time to provide updated assets.
              </p>
            </div>
            <div className="p-3 bg-mist rounded-sm border border-line">
              <span className="font-heading uppercase font-bold text-ink block text-xs tracking-wider mb-1">
                2. Keep Calendar Accurate
              </span>
              <p className="text-xs text-muted leading-relaxed">
                Lock dates in your Availability tab whenever you are taking a hiatus or producing non-sponsored special editions.
              </p>
            </div>
            <div className="p-3 bg-mist rounded-sm border border-line">
              <span className="font-heading uppercase font-bold text-ink block text-xs tracking-wider mb-1">
                3. Update Media Profile
              </span>
              <p className="text-xs text-muted leading-relaxed">
                Regularly refresh your audience metrics and subscriber counts in your Profile so marketplace sponsors see verified numbers.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

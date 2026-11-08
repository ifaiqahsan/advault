import { useState, useContext, useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { AuthContext } from '../../context/AuthContent'
import { mockTiers } from '../../data/mockTiers'

import TierCard from './components/TierCard'
import TierForm from './components/TierForm'
import DeleteTierConfirm from './components/DeleteTierConfirm'

/**
 * Tiers Page Component
 * Allows verified creators to manage their sponsorship packages (CRUD operations).
 *
 * State:
 * - tiers: local array copied from mockTiers (filtered by logged-in creator)
 * - isCreateModalOpen: controls the "Add New Tier" modal
 * - editingTier: tier object currently being edited, or null
 * - deletingTier: tier object currently targeted for deletion, or null
 * - feedbackMessage: brief success feedback notification for user actions
 */
export default function Tiers() {
  // 1. Retrieve the currently authenticated user from AuthContext
  const auth = useContext(AuthContext)
  const currentCreator = auth?.user || { id: 'creator-1', name: 'TechBytes Weekly' }

  // 2. Initialize local state with tiers belonging to the current creator
  const [tiers, setTiers] = useState(() => {
    return mockTiers.filter((tier) => tier.creatorId === currentCreator.id)
  })

  // 3. Modal control states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTier, setEditingTier] = useState(null)
  const [deletingTier, setDeletingTier] = useState(null)

  // 4. Temporary banner message for CRUD confirmation
  const [feedbackMessage, setFeedbackMessage] = useState(null)

  // Helper to trigger a brief feedback message
  const triggerNotification = (message) => {
    setFeedbackMessage(message)
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 4000)
  }

  // -------------------------------------------------------------
  // CRUD Handlers
  // -------------------------------------------------------------

  /**
   * Handle Create Tier
   * Generates a new unique ID and prepends the new tier to state
   */
  const handleCreateTier = (tierData) => {
    const newTier = {
      ...tierData,
      id: `tier-${Date.now()}`,
      creatorId: currentCreator.id,
    }

    setTiers((prev) => [newTier, ...prev])
    setIsCreateModalOpen(false)
    triggerNotification(`Created new tier "${newTier.name}" successfully!`)
  }

  /**
   * Handle Update Tier
   * Updates the corresponding tier in the local array
   */
  const handleUpdateTier = (updatedData) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === updatedData.id ? { ...tier, ...updatedData } : tier))
    )
    setEditingTier(null)
    triggerNotification(`Updated tier "${updatedData.name}" successfully.`)
  }

  /**
   * Handle Delete Tier
   * Removes the targeted tier from local state
   */
  const handleDeleteTier = () => {
    if (!deletingTier) return

    setTiers((prev) => prev.filter((tier) => tier.id !== deletingTier.id))
    triggerNotification(`Deleted tier "${deletingTier.name}".`)
    setDeletingTier(null)
  }

  // Memoized stats calculation for header overview
  const statsSummary = useMemo(() => {
    const count = tiers.length
    const averagePrice =
      count > 0 ? Math.round(tiers.reduce((acc, t) => acc + Number(t.price), 0) / count) : 0
    return { count, averagePrice }
  }, [tiers])

  return (
    <DashboardLayout
      title="Sponsorship Tiers"
      subtitle="Define and price the ad inventory slots sponsors can book on your platform."
      action={
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Create New Tier
        </Button>
      }
    >
      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div className="mb-6 p-4 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600">✓</span>
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-xs uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-paper border border-line p-4 rounded-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-heading text-muted tracking-wider block">
              Active Tiers
            </span>
            <span className="text-2xl font-bold font-heading text-ink">
              {statsSummary.count} Available
            </span>
          </div>
          <span className="text-3xl text-navy-800/20 font-heading font-black">#</span>
        </div>

        <div className="bg-paper border border-line p-4 rounded-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-heading text-muted tracking-wider block">
              Average Slot Price
            </span>
            <span className="text-2xl font-bold font-heading text-brand-500">
              ${statsSummary.averagePrice.toLocaleString()}
            </span>
          </div>
          <span className="text-3xl text-brand-500/20 font-heading font-black">$</span>
        </div>
      </div>

      {/* Tiers Grid */}
      {tiers.length === 0 ? (
        <div className="bg-paper border border-dashed border-line rounded-lg p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-mist flex items-center justify-center text-muted mb-3 font-heading text-xl">
            !
          </div>
          <h3 className="font-heading text-xl text-ink font-bold">No Tiers Created Yet</h3>
          <p className="text-sm text-muted max-w-md mx-auto mt-1 mb-5">
            You currently have no active packages configured. Create your first tier to let sponsors purchase slots.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Your First Tier
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onEdit={(t) => setEditingTier(t)}
              onDelete={(t) => setDeletingTier(t)}
            />
          ))}
        </div>
      )}

      {/* Modal: Create New Tier */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Sponsorship Tier"
      >
        <TierForm
          initialData={null}
          onSubmit={handleCreateTier}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal: Edit Existing Tier */}
      <Modal
        isOpen={Boolean(editingTier)}
        onClose={() => setEditingTier(null)}
        title={`Edit Tier: ${editingTier?.name || ''}`}
      >
        {editingTier && (
          <TierForm
            initialData={editingTier}
            onSubmit={handleUpdateTier}
            onCancel={() => setEditingTier(null)}
          />
        )}
      </Modal>

      {/* Modal: Delete Confirmation */}
      <Modal
        isOpen={Boolean(deletingTier)}
        onClose={() => setDeletingTier(null)}
        title="Delete Sponsorship Tier"
      >
        <DeleteTierConfirm
          tier={deletingTier}
          onConfirm={handleDeleteTier}
          onCancel={() => setDeletingTier(null)}
        />
      </Modal>
    </DashboardLayout>
  )
}

import { useState, useContext, useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { AuthContext } from '../../context/AuthContent'
import { mockBookings } from '../../data/mockBookings'

import SubmissionList from './components/SubmissionList'
import SubmissionPreview from './components/SubmissionPreview'
import ReviewActions from './components/ReviewActions'

/**
 * ReviewQueue Page Component
 * Allows creators to inspect sponsor ad submissions, review live publication mockups,
 * and approve, reject, or request revisions with required notes.
 */
export default function ReviewQueue() {
  // 1. Current authenticated creator from AuthContext
  const auth = useContext(AuthContext)
  const currentCreator = auth?.user || { id: 'creator-1', name: 'TechBytes Weekly' }

  // 2. Initialize local state from mockBookings (filtered to current creator)
  const [submissions, setSubmissions] = useState(() => {
    return mockBookings.filter((b) => b.creatorId === currentCreator.id)
  })

  // 3. Selection & filter state
  const [selectedId, setSelectedId] = useState(() => {
    const firstPending = mockBookings.find(
      (b) => b.creatorId === currentCreator.id && b.status === 'pending'
    )
    return firstPending ? firstPending.id : mockBookings[0]?.id
  })

  const [activeFilter, setActiveFilter] = useState('all')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Active selected submission object
  const activeSubmission = useMemo(() => {
    return submissions.find((s) => s.id === selectedId) || null
  }, [submissions, selectedId])

  // -------------------------------------------------------------
  // Review Action Handlers
  // -------------------------------------------------------------

  /**
   * Handle Approval
   * Moves status to 'approved' and clears any revision flags
   */
  const handleApprove = (submissionId) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, status: 'approved', feedbackNote: null }
          : item
      )
    )
    showToast('Creative has been APPROVED and confirmed for scheduled publication!')
  }

  /**
   * Handle Request Revision
   * Moves status to 'revision_requested' and saves the creator's note
   */
  const handleRequestRevision = (submissionId, note) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, status: 'revision_requested', feedbackNote: note }
          : item
      )
    )
    showToast('Revision request sent to sponsor with your feedback note.')
  }

  /**
   * Handle Reject
   * Moves status to 'rejected' and stores the rejection rationale
   */
  const handleReject = (submissionId, note) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, status: 'rejected', feedbackNote: note }
          : item
      )
    )
    showToast('Submission has been REJECTED. Sponsor notified.')
  }

  return (
    <DashboardLayout
      title="Ad Creative Review Queue"
      subtitle="Inspect sponsor copy, banners, and destination links before they appear in your publication."
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-sm bg-navy-900 border border-brand-500/40 text-white text-sm flex items-center justify-between shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <span className="text-brand-500 font-bold">ℹ</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs uppercase font-bold text-white/70 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Review Grid: List (Left) and Live Preview + Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Submissions Inbox (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <SubmissionList
            submissions={submissions}
            selectedId={selectedId}
            onSelect={(item) => setSelectedId(item.id)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Right Column: Live Mockup Preview & Decision Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <SubmissionPreview submission={activeSubmission} />

          {activeSubmission && (
            <ReviewActions
              submission={activeSubmission}
              onApprove={handleApprove}
              onRequestRevision={handleRequestRevision}
              onReject={handleReject}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

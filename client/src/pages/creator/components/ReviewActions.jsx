import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'

/**
 * ReviewActions Component
 * Provides action buttons for reviewing a sponsor submission (Approve, Request Revision, Reject)
 * and controls feedback modals for revisions or rejections.
 *
 * Props:
 * - submission: current submission object
 * - onApprove: function(submissionId)
 * - onRequestRevision: function(submissionId, note)
 * - onReject: function(submissionId, note)
 */
export default function ReviewActions({
  submission,
  onApprove,
  onRequestRevision,
  onReject,
}) {
  // Modal state
  const [modalType, setModalType] = useState(null) // 'revision' | 'reject' | null
  const [feedbackNote, setFeedbackNote] = useState('')
  const [noteError, setNoteError] = useState('')

  if (!submission) return null

  const isPending = submission.status === 'pending'
  const isRevision = submission.status === 'revision_requested'

  const openModal = (type) => {
    setModalType(type)
    setFeedbackNote(submission.feedbackNote || '')
    setNoteError('')
  }

  const closeModal = () => {
    setModalType(null)
    setFeedbackNote('')
    setNoteError('')
  }

  const handleSubmitModal = (e) => {
    e.preventDefault()

    if (!feedbackNote.trim()) {
      setNoteError('A detailed explanation note is required for the sponsor.')
      return
    }

    if (modalType === 'revision') {
      onRequestRevision(submission.id, feedbackNote.trim())
    } else if (modalType === 'reject') {
      onReject(submission.id, feedbackNote.trim())
    }

    closeModal()
  }

  return (
    <>
      <div className="bg-paper border border-line rounded-lg p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-heading uppercase text-xs text-muted tracking-wider block">
            Review Decision Workflow
          </span>
          <span className="text-sm font-semibold text-ink">
            Current Status: <strong className="uppercase">{submission.status.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Request Revision Button */}
          <Button
            variant="outline"
            size="md"
            onClick={() => openModal('revision')}
            className="flex-1 sm:flex-initial"
          >
            ✏️ Request Revision
          </Button>

          {/* Reject Button */}
          <Button
            variant="danger"
            size="md"
            onClick={() => openModal('reject')}
            className="flex-1 sm:flex-initial"
          >
            ✕ Reject
          </Button>

          {/* Approve Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => onApprove(submission.id)}
            disabled={submission.status === 'approved'}
            className="flex-1 sm:flex-initial"
          >
            {submission.status === 'approved' ? '✓ Approved' : '✓ Approve Creative'}
          </Button>
        </div>
      </div>

      {/* Modal for Feedback Note (Revision or Rejection) */}
      <Modal
        isOpen={Boolean(modalType)}
        onClose={closeModal}
        title={
          modalType === 'revision'
            ? 'Request Creative Revision'
            : 'Reject Sponsor Submission'
        }
      >
        <form onSubmit={handleSubmitModal} className="space-y-4">
          <p className="text-xs text-ink/80 leading-relaxed">
            {modalType === 'revision'
              ? 'Please describe what edits or asset changes the sponsor needs to make before this ad can be approved (e.g. trim word count, higher-resolution logo).'
              : 'Please provide a clear reason for declining this sponsorship request. The sponsor will be notified and funds released according to cancellation terms.'}
          </p>

          <Input
            label={modalType === 'revision' ? 'Revision Instructions' : 'Rejection Reason'}
            name="feedbackNote"
            as="textarea"
            rows={4}
            value={feedbackNote}
            onChange={(e) => {
              setFeedbackNote(e.target.value)
              if (noteError) setNoteError('')
            }}
            placeholder={
              modalType === 'revision'
                ? 'e.g. Please shorten body copy by 15 words and provide an HTTPS link.'
                : 'e.g. The requested product niche conflicts with our editorial guidelines.'
            }
            error={noteError}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <Button variant="outline" size="md" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant={modalType === 'revision' ? 'secondary' : 'danger'}
              size="md"
              type="submit"
            >
              {modalType === 'revision'
                ? 'Send Revision Request'
                : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}


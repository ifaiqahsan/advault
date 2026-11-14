import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import { statusLabel } from '../../../utils/format'

export default function ReviewActions({ submission, onApprove, onRequestRevision, onReject }) {
  const [modal, setModal] = useState(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  if (!submission) return null

  const open = (type) => {
    setModal(type)
    setNote('')
    setError('')
  }

  const close = () => {
    setModal(null)
    setNote('')
    setError('')
  }

  const submit = (e) => {
    e.preventDefault()
    if (!note.trim()) return setError('Add a short note so the sponsor knows what to do.')
    if (modal === 'revision') onRequestRevision(submission.id, note.trim())
    else onReject(submission.id, note.trim())
    close()
  }

  const revision = modal === 'revision'
  const approved = submission.status === 'approved'

  return (
    <>
      <div className="bg-paper border border-line p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading uppercase text-xs text-muted tracking-wider block">Decision</span>
          <span className="text-sm font-semibold text-ink">Status: {statusLabel[submission.status] || submission.status}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => open('revision')}>Request revision</Button>
          <Button variant="danger" onClick={() => open('reject')}>Reject</Button>
          <Button onClick={() => onApprove(submission.id)} disabled={approved}>{approved ? 'Approved' : 'Approve creative'}</Button>
        </div>
      </div>

      <Modal isOpen={Boolean(modal)} onClose={close} title={revision ? 'Request a revision' : 'Reject submission'}>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <p className="text-xs text-ink/80 leading-relaxed">
            {revision
              ? 'Tell the sponsor what to change. Their payment stays on hold until you approve the new version.'
              : 'Explain why you are declining. The held payment is released to the sponsor automatically.'}
          </p>
          <Input
            label={revision ? 'Revision instructions' : 'Rejection reason'}
            name="note"
            as="textarea"
            rows={4}
            required
            value={note}
            onChange={(e) => {
              setNote(e.target.value)
              setError('')
            }}
            error={error}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button type="submit" variant={revision ? 'secondary' : 'danger'}>{revision ? 'Send revision request' : 'Confirm rejection'}</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

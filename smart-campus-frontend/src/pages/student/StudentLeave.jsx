import { useEffect, useState } from 'react'
import { FileText, Send, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getLeaveRequestsForStudent, submitLeaveRequest } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'

export default function StudentLeave() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState({ fromDate: '', toDate: '', reason: '' })

  useEffect(() => {
    getLeaveRequestsForStudent(user.id).then((data) => {
      setRequests(data)
      setLoading(false)
    })
  }, [user.id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fromDate || !form.toDate || !form.reason.trim()) return
    setSubmitting(true)
    setSuccessMsg('')
    try {
      const newRequest = await submitLeaveRequest({
        studentId: user.id,
        rollNo: user.rollNo,
        studentName: user.name,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason.trim(),
      })
      setRequests((prev) => [newRequest, ...prev])
      setForm({ fromDate: '', toDate: '', reason: '' })
      setSuccessMsg('Your leave request has been submitted for approval.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">My Records</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Leave Requests</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card title="Apply for leave" eyebrow="New request">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  From
                </label>
                <input
                  type="date"
                  required
                  value={form.fromDate}
                  onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  To
                </label>
                <input
                  type="date"
                  required
                  value={form.toDate}
                  min={form.fromDate || undefined}
                  onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Reason
              </label>
              <textarea
                required
                rows={4}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Briefly explain the reason for your leave…"
                className="mt-1.5 w-full resize-none rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
            {successMsg && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {successMsg}
              </p>
            )}
          </form>
        </Card>

        <Card title="Request history" eyebrow={`${requests.length} total`}>
          {loading ? (
            <Spinner label="Loading requests" />
          ) : requests.length === 0 ? (
            <EmptyState icon={FileText} title="No leave requests yet" />
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-ink-900/8 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-ink-500">
                        {r.fromDate} → {r.toDate}
                      </p>
                      <p className="mt-1 text-sm text-ink-700">{r.reason}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-ink-400">
                    Applied on {r.appliedOn}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

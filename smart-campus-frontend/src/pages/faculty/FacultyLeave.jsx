import { useEffect, useState } from 'react'
import { FileText, Check, X } from 'lucide-react'
import { getAllLeaveRequests, updateLeaveStatus } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function FacultyLeave() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    getAllLeaveRequests().then((data) => {
      setRequests(data)
      setLoading(false)
    })
  }, [])

  async function handleDecision(id, status) {
    setUpdatingId(id)
    try {
      await updateLeaveStatus(id, status)
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = requests.filter((r) => filter === 'ALL' || r.status === filter)

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">Approvals</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Leave Requests</h1>
      </div>

      <Card
        title="Student requests"
        eyebrow={`${filtered.length} shown`}
        action={
          <div className="flex gap-1 rounded-lg bg-ink-50 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-white text-ink-800 shadow-card' : 'text-ink-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        {loading ? (
          <Spinner label="Loading requests" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileText} title="Nothing here" body="No requests match this filter." />
        ) : (
          <ul className="divide-y divide-ink-900/5">
            {filtered.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink-800">{r.studentName}</p>
                    <span className="font-mono text-[11px] text-ink-400">{r.rollNo}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-ink-400">
                    {r.fromDate} → {r.toDate} · Applied {r.appliedOn}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-600">{r.reason}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleDecision(r.id, 'APPROVED')}
                        disabled={updatingId === r.id}
                        className="flex items-center gap-1 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleDecision(r.id, 'REJECTED')}
                        disabled={updatingId === r.id}
                        className="flex items-center gap-1 rounded-md bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <StatusBadge status={r.status} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

const STYLES = {
  PRESENT: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  ABSENT: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  LATE: 'bg-amber-100 text-amber-800 ring-amber-600/30',
  PENDING: 'bg-amber-100 text-amber-800 ring-amber-600/30',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-ink-100 text-ink-700 ring-ink-600/20'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  )
}

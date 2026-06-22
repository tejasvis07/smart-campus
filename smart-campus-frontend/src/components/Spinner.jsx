export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 py-10 text-ink-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-200 border-t-amber-500" />
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </div>
  )
}

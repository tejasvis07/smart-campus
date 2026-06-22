export default function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 px-6 py-10 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-ink-300" strokeWidth={1.5} />}
      <p className="font-display text-base font-semibold text-ink-700">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-ink-400">{body}</p>}
    </div>
  )
}

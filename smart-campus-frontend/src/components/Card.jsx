export default function Card({ title, eyebrow, action, children, className = '' }) {
  return (
    <div className={`rounded-xl bg-white shadow-card ring-1 ring-ink-900/5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-ink-900/5 px-5 py-4">
          <div>
            {eyebrow && (
              <p className="font-mono text-[11px] uppercase tracking-wider text-amber-600">
                {eyebrow}
              </p>
            )}
            {title && <h3 className="font-display text-lg font-semibold text-ink-800">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const PERIODS = [1, 2, 3, 4, 5, 6]

export default function TimetableGrid({ entries, onDelete }) {
  const cellFor = (day, period) =>
    entries.find((e) => e.day === day && e.period === period)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="w-20 border-b border-ink-900/10 py-2.5 pr-3 font-mono text-[11px] uppercase tracking-wider text-ink-400">
              Period
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="border-b border-ink-900/10 py-2.5 px-3 font-mono text-[11px] uppercase tracking-wider text-ink-400"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period) => (
            <tr key={period} className="border-b border-ink-900/5">
              <td className="py-3 pr-3 align-top">
                <span className="font-display text-lg font-semibold text-ink-300">
                  {String(period).padStart(2, '0')}
                </span>
              </td>
              {DAYS.map((day) => {
                const cell = cellFor(day, period)
                return (
                  <td key={day} className="px-3 py-2 align-top">
                    {cell ? (
                      <div className="group relative rounded-lg bg-ink-50 px-3 py-2.5 ring-1 ring-ink-900/5">
                        <p className="text-sm font-semibold text-ink-800">{cell.subject}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-ink-400">{cell.time}</p>
                        <p className="text-xs text-ink-500">{cell.faculty}</p>
                        <p className="font-mono text-[11px] text-amber-600">{cell.room}</p>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(cell.id)}
                            className="absolute right-1.5 top-1.5 hidden rounded px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 group-hover:block"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[64px] rounded-lg border border-dashed border-ink-100" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

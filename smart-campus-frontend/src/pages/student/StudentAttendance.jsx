import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAttendanceForStudent } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'

export default function StudentAttendance() {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendanceForStudent(user.id).then((data) => {
      setAttendance(data)
      setLoading(false)
    })
  }, [user.id])

  const bySubject = attendance.reduce((acc, a) => {
    acc[a.subject] = acc[a.subject] || { total: 0, present: 0 }
    acc[a.subject].total += 1
    if (a.status === 'PRESENT') acc[a.subject].present += 1
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">My Records</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Attendance</h1>
      </div>

      {loading ? (
        <Spinner label="Loading attendance" />
      ) : attendance.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No attendance recorded yet"
          body="Once your faculty marks attendance, it will appear here."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(bySubject).map(([subject, stat]) => {
              const pct = Math.round((stat.present / stat.total) * 100)
              return (
                <div key={subject} className="rounded-xl bg-white p-4 shadow-card ring-1 ring-ink-900/5">
                  <p className="text-sm font-semibold text-ink-700">{subject}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="font-display text-2xl font-semibold text-ink-800">{pct}%</span>
                    <span className="font-mono text-xs text-ink-400">
                      {stat.present}/{stat.total} classes
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-ink-100">
                    <div
                      className="h-1.5 rounded-full bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <Card title="Attendance ledger" eyebrow="All entries">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-900/10 font-mono text-[11px] uppercase tracking-wider text-ink-400">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Subject</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {attendance
                    .slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((a) => (
                      <tr key={a.id}>
                        <td className="py-3 pr-4 font-mono text-xs text-ink-500">{a.date}</td>
                        <td className="py-3 pr-4 font-medium text-ink-700">{a.subject}</td>
                        <td className="py-3">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

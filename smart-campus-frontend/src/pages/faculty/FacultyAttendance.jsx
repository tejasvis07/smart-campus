import { useEffect, useState } from 'react'
import { CheckCircle2, Save } from 'lucide-react'
import { getStudentsForFaculty, markAttendance } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'

const SUBJECTS = ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks']
const STATUS_OPTIONS = ['PRESENT', 'ABSENT', 'LATE']

export default function FacultyAttendance() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [subject, setSubject] = useState(SUBJECTS[0])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [statuses, setStatuses] = useState({})

  useEffect(() => {
    getStudentsForFaculty().then((data) => {
      setStudents(data)
      const initial = {}
      data.forEach((s) => {
        initial[s.id] = 'PRESENT'
      })
      setStatuses(initial)
      setLoading(false)
    })
  }, [])

  function setStatus(studentId, status) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }))
  }

  function markAllPresent() {
    const next = {}
    students.forEach((s) => {
      next[s.id] = 'PRESENT'
    })
    setStatuses(next)
  }

  async function handleSave() {
    setSaving(true)
    setSuccessMsg('')
    const records = students.map((s) => ({
      studentId: s.id,
      rollNo: s.rollNo,
      status: statuses[s.id] || 'PRESENT',
    }))
    try {
      await markAttendance({ subject, date, records })
      setSuccessMsg(`Attendance saved for ${students.length} students — ${subject} on ${date}.`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">Daily Task</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Mark Attendance</h1>
      </div>

      <Card title="Class selection" eyebrow="Step 1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
      </Card>

      <Card
        title="Roll call"
        eyebrow="Step 2"
        action={
          <button
            onClick={markAllPresent}
            className="text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            Mark all present
          </button>
        }
      >
        {loading ? (
          <Spinner label="Loading roster" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  <th className="py-2 pr-4">Roll No.</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 pr-4 font-mono text-xs text-ink-500">{s.rollNo}</td>
                    <td className="py-3 pr-4 font-medium text-ink-700">{s.name}</td>
                    <td className="py-3">
                      <div className="inline-flex gap-1.5 rounded-lg bg-ink-50 p-1">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setStatus(s.id, opt)}
                            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                              statuses[s.id] === opt
                                ? opt === 'PRESENT'
                                  ? 'bg-emerald-500 text-white'
                                  : opt === 'ABSENT'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-500 text-white'
                                : 'text-ink-500 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="mt-6 flex items-center justify-between border-t border-ink-900/5 pt-5">
            {successMsg ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {successMsg}
              </p>
            ) : (
              <span />
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save attendance'}
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { getTimetable, createTimetableEntry, deleteTimetableEntry } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import TimetableGrid from '../../components/TimetableGrid'
import { useAuth } from '../../context/AuthContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const PERIODS = [1, 2, 3, 4, 5, 6]

export default function FacultyTimetable() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    day: 'Monday',
    period: 1,
    time: '',
    subject: '',
    room: '',
  })

  useEffect(() => {
    getTimetable().then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.time || !form.subject || !form.room) return
    setSaving(true)
    try {
      const created = await createTimetableEntry({
        day: form.day,
        period: Number(form.period),
        time: form.time,
        subject: form.subject,
        faculty: user.name,
        room: form.room,
      })
      setEntries((prev) => [...prev, created])
      setForm({ day: 'Monday', period: 1, time: '', subject: '', room: '' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await deleteTimetableEntry(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">Schedule</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Timetable</h1>
      </div>

      <Card title="Add a class slot" eyebrow="New entry">
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <select
            value={form.day}
            onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                Period {p}
              </option>
            ))}
          </select>
          <input
            placeholder="09:00 - 09:50"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <div className="flex gap-2">
            <input
              placeholder="Room"
              value={form.room}
              onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={saving}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-ink-900 px-3 text-sm font-semibold text-parchment hover:bg-ink-800 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>
      </Card>

      <Card title="Weekly schedule" eyebrow="Hover a slot to remove it">
        {loading ? (
          <Spinner label="Loading timetable" />
        ) : (
          <TimetableGrid entries={entries} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  )
}

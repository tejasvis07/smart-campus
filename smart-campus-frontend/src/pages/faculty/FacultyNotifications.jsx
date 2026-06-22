import { useEffect, useState } from 'react'
import { Bell, Send, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getNotifications, sendNotification } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'

const AUDIENCES = ['All Students', 'Semester 5', 'CS21B045 (Asha Rajan)']

export default function FacultyNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState({ title: '', body: '', audience: AUDIENCES[0] })

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifications(data)
      setLoading(false)
    })
  }, [])

  async function handleSend(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    setSending(true)
    setSuccessMsg('')
    try {
      const newNotif = await sendNotification({
        title: form.title.trim(),
        body: form.body.trim(),
        audience: form.audience,
        sentBy: user.name,
      })
      setNotifications((prev) => [newNotif, ...prev])
      setForm({ title: '', body: '', audience: AUDIENCES[0] })
      setSuccessMsg('Notification sent.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">Broadcast</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Notifications</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card title="Compose notice" eyebrow="New notification">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Audience
              </label>
              <select
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Class rescheduled"
                className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Message
              </label>
              <textarea
                rows={4}
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Write the notice…"
                className="mt-1.5 w-full resize-none rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {sending ? 'Sending…' : 'Send notification'}
            </button>
            {successMsg && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {successMsg}
              </p>
            )}
          </form>
        </Card>

        <Card title="Sent history" eyebrow={`${notifications.length} total`}>
          {loading ? (
            <Spinner label="Loading notifications" />
          ) : notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications sent yet" />
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {notifications.map((n) => (
                <li key={n.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-ink-700">{n.title}</p>
                    <span className="shrink-0 rounded-full bg-ink-50 px-2.5 py-0.5 font-mono text-[11px] text-ink-500">
                      {n.audience}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">{n.body}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-400">
                    {new Date(n.sentOn).toLocaleString()}
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

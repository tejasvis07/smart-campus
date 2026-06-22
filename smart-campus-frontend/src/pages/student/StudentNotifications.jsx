import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { getNotifications } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifications(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">Inbox</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Notifications</h1>
      </div>

      <Card title="All notifications" eyebrow={`${notifications.length} total`}>
        {loading ? (
          <Spinner label="Loading notifications" />
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications yet" />
        ) : (
          <ul className="divide-y divide-ink-900/5">
            {notifications.map((n) => (
              <li key={n.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-base font-semibold text-ink-800">{n.title}</p>
                  <span className="shrink-0 rounded-full bg-ink-50 px-2.5 py-0.5 font-mono text-[11px] text-ink-500">
                    {n.audience}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-600">{n.body}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  {n.sentBy} · {new Date(n.sentOn).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

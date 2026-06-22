import { useEffect, useState } from 'react'
import { CalendarCheck, FileText, Bell, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getAttendanceForStudent,
  getLeaveRequestsForStudent,
  getNotifications,
} from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'

export default function StudentOverview() {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const [att, leave, notifs] = await Promise.all([
        getAttendanceForStudent(user.id),
        getLeaveRequestsForStudent(user.id),
        getNotifications(),
      ])
      if (!active) return
      setAttendance(att)
      setLeaveRequests(leave)
      setNotifications(notifs)
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [user.id])

  if (loading) return <Spinner label="Loading your overview" />

  const presentCount = attendance.filter((a) => a.status === 'PRESENT').length
  const attendanceRate = attendance.length
    ? Math.round((presentCount / attendance.length) * 100)
    : 0
  const pendingLeave = leaveRequests.filter((l) => l.status === 'PENDING').length

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">
          {user.department} · Semester {user.semester}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label="Attendance rate"
          value={`${attendanceRate}%`}
          tone="amber"
        />
        <StatCard
          icon={FileText}
          label="Pending leave requests"
          value={pendingLeave}
          tone="ink"
        />
        <StatCard
          icon={Bell}
          label="Unread notices"
          value={notifications.length}
          tone="ink"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Recent attendance"
          eyebrow="Last 7 entries"
          action={
            <Link to="/student/attendance" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              View all
            </Link>
          }
        >
          {attendance.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No attendance recorded yet" />
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {attendance.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{a.subject}</p>
                    <p className="font-mono text-xs text-ink-400">{a.date}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Notifications"
          eyebrow="Latest first"
          action={
            <Link to="/student/notifications" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              View all
            </Link>
          }
        >
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" />
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {notifications.slice(0, 3).map((n) => (
                <li key={n.id} className="py-3">
                  <p className="text-sm font-semibold text-ink-700">{n.title}</p>
                  <p className="mt-0.5 text-sm text-ink-500">{n.body}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-400">
                    {n.sentBy} · {new Date(n.sentOn).toLocaleDateString()}
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

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card ring-1 ring-ink-900/5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
          tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-700'
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">{label}</p>
        <p className="font-display text-2xl font-semibold text-ink-800">{value}</p>
      </div>
    </div>
  )
}

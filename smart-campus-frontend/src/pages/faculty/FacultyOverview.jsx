import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileText, Bell, CalendarCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAllLeaveRequests, getStudentsForFaculty, getNotifications } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'

export default function FacultyOverview() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getStudentsForFaculty(), getAllLeaveRequests(), getNotifications()]).then(
      ([s, l, n]) => {
        setStudents(s)
        setLeaveRequests(l)
        setNotifications(n)
        setLoading(false)
      }
    )
  }, [])

  if (loading) return <Spinner label="Loading your overview" />

  const pending = leaveRequests.filter((l) => l.status === 'PENDING')

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">
          {user.department} · {user.facultyId}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">
          Welcome back, {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Students assigned" value={students.length} tone="ink" />
        <StatCard icon={FileText} label="Pending leave requests" value={pending.length} tone="amber" />
        <StatCard icon={Bell} label="Notices sent" value={notifications.length} tone="ink" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Pending leave requests"
          eyebrow="Needs your decision"
          action={
            <Link to="/faculty/leave" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              Review all
            </Link>
          }
        >
          {pending.length === 0 ? (
            <EmptyState icon={FileText} title="No pending requests" body="You're all caught up." />
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {pending.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{r.studentName}</p>
                    <p className="font-mono text-xs text-ink-400">
                      {r.fromDate} → {r.toDate}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Quick actions"
          eyebrow="Daily tasks"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction
              icon={CalendarCheck}
              label="Mark today's attendance"
              to="/faculty/attendance"
            />
            <QuickAction icon={FileText} label="Review leave requests" to="/faculty/leave" />
            <QuickAction icon={Bell} label="Send a notification" to="/faculty/notifications" />
            <QuickAction icon={Users} label="View timetable" to="/faculty/timetable" />
          </div>
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

function QuickAction({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-ink-900/8 px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-amber-300 hover:bg-amber-50"
    >
      <Icon className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
      {label}
    </Link>
  )
}

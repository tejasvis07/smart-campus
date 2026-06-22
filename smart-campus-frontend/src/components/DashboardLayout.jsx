import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  CalendarCheck,
  FileText,
  CalendarDays,
  Bell,
  LogOut,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STUDENT_NAV = [
  { to: '/student', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/student/leave', label: 'Leave Requests', icon: FileText },
  { to: '/student/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
]

const FACULTY_NAV = [
  { to: '/faculty', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/faculty/attendance', label: 'Mark Attendance', icon: CalendarCheck },
  { to: '/faculty/leave', label: 'Leave Requests', icon: FileText },
  { to: '/faculty/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/faculty/notifications', label: 'Notifications', icon: Bell },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'FACULTY' ? FACULTY_NAV : STUDENT_NAV

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-ink-900/8 bg-ink-900 text-parchment md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-ink-900">
            <GraduationCap className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight">Smart Campus</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300">
              {user?.role === 'FACULTY' ? 'Faculty Portal' : 'Student Portal'}
            </p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300'
                    : 'text-ink-200 hover:bg-white/5 hover:text-parchment'
                }`
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-parchment"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-ink-900/8 bg-white/70 px-6 py-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-amber-300">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-semibold text-ink-800">Smart Campus</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink-800">{user?.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
                {user?.role === 'FACULTY' ? user?.facultyId : user?.rollNo}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 font-display text-sm font-semibold text-ink-700">
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-ink-900/8 bg-white px-3 py-2 md:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-ink-900 text-amber-300' : 'text-ink-500'
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}

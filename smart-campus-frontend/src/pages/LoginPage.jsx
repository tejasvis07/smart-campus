import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Users, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    try {
      const user = await login({ email, password, role })
      navigate(user.role === 'FACULTY' ? '/faculty' : '/student')
    } catch (err) {
      setFormError(err.message || 'Could not sign in. Check your details and try again.')
    }
  }

  function fillDemo(demoRole) {
    setRole(demoRole)
    setEmail(demoRole === 'FACULTY' ? 'meera.iyer@campus.edu' : 'asha.rajan@campus.edu')
    setPassword('demo1234')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-900/5 md:grid-cols-[1.1fr_1fr]">
        {/* Left: identity panel, ledger motif */}
        <div className="relative hidden flex-col justify-between bg-ink-900 px-9 py-10 text-parchment md:flex">
          <div
            className="ledger-rule pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-ink-900">
                <GraduationCap className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="font-display text-xl font-semibold">Smart Campus</span>
            </div>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300">
              Academic Year 2026–27
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">
              Attendance, leave, and<br />timetables — in one register.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-200">
              Sign in to mark and review attendance, manage leave requests, and stay current on
              department notices.
            </p>
          </div>
          <div className="relative flex gap-6 font-mono text-[11px] uppercase tracking-wider text-ink-300">
            <span>Period&nbsp;I–VI</span>
            <span>Mon–Fri</span>
            <span>JWT Secured</span>
          </div>
        </div>

        {/* Right: form */}
        <div className="px-7 py-10 sm:px-10">
          <div className="mb-7 md:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-amber-300">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-semibold text-ink-800">Smart Campus</span>
            </div>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink-800">Sign in</h2>
          <p className="mt-1 text-sm text-ink-400">Choose your role to continue to your portal.</p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-ink-50 p-1">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-colors ${
                role === 'STUDENT' ? 'bg-white text-ink-800 shadow-card' : 'text-ink-400'
              }`}
            >
              <GraduationCap className="h-4 w-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('FACULTY')}
              className={`flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-colors ${
                role === 'FACULTY' ? 'bg-white text-ink-800 shadow-card' : 'text-ink-400'
              }`}
            >
              <Users className="h-4 w-4" /> Faculty
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Campus email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'FACULTY' ? 'meera.iyer@campus.edu' : 'asha.rajan@campus.edu'}
                className="mt-1.5 w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-ink-900 py-2.75 text-sm font-semibold text-parchment transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in…' : `Sign in as ${role === 'FACULTY' ? 'Faculty' : 'Student'}`}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-ink-200 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">Demo access</p>
            <p className="mt-1 text-xs text-ink-400">
              Seeded demo accounts use the password <code className="rounded bg-ink-50 px-1 py-0.5">demo1234</code>. Quick-fill one:
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('STUDENT')}
                className="rounded-md bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
              >
                Asha (Student)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('FACULTY')}
                className="rounded-md bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
              >
                Dr. Iyer (Faculty)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

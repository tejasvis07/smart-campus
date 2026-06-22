// ============================================================================
// API CLIENT
// ----------------------------------------------------------------------------
// Talks to the NestJS backend at BASE_URL. Set USE_MOCK = true below to fall
// back to in-memory mock data (useful for working on the UI without the
// backend running).
//
// Backend contract (see smart-campus-backend README for full details):
//   - All routes are prefixed with /api and use JSON.
//   - POST /auth/login returns { token, user } - token is a JWT, sent back
//     as `Authorization: Bearer <token>` on every subsequent request.
//   - NestJS's ValidationPipe uses forbidNonWhitelisted: true, so request
//     bodies must contain ONLY the fields each DTO declares - extra fields
//     (e.g. client-side ids) are stripped before sending.
//   - Error responses are JSON: { statusCode, message, error }. `message`
//     can be a string or an array of validation messages.
// ============================================================================

import {
  mockUsers,
  mockTimetable,
  mockStudentsForFaculty,
  mockAttendance,
  mockLeaveRequests,
  mockNotifications,
  nextId,
} from './mockData'

export const USE_MOCK = false

export const BASE_URL = 'http://localhost:8080/api'

// Simulates network latency so loading states are visible in mock mode.
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

function getToken() {
  return localStorage.getItem('campus_jwt')
}

// Turns a NestJS error response { statusCode, message, error } into a
// single readable string. `message` is a string for most errors, but
// class-validator failures come back as an array of strings.
function formatErrorMessage(body, fallback) {
  if (!body) return fallback
  if (Array.isArray(body.message)) return body.message.join(' ')
  if (typeof body.message === 'string') return body.message
  return fallback
}

// Generic authenticated fetch helper used by every real API call below.
async function apiFetch(path, options = {}) {
  const token = getToken()

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (networkErr) {
    // fetch() itself throws on network failure (server down, CORS, etc.)
    throw new Error(
      'Could not reach the server. Make sure the backend is running on ' + BASE_URL,
    )
  }

  if (!res.ok) {
    let body = null
    try {
      body = await res.json()
    } catch {
      // Response wasn't JSON (e.g. an HTML error page) - ignore and fall back.
    }
    throw new Error(formatErrorMessage(body, `Request failed: ${res.status}`))
  }

  if (res.status === 204) return null

  // Some endpoints (e.g. DELETE) may return an empty body with a 200.
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ----------------------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------------------

export async function login({ email, password, role }) {
  if (USE_MOCK) {
    await delay()
    const user = mockUsers.find((u) => u.role === role)
    if (!user || !email || !password) {
      throw new Error('Invalid email, password, or role.')
    }
    const fakeToken = `mock.jwt.${user.id}.${role}`
    return { token: fakeToken, user }
  }

  // POST /api/auth/login -> { token, user }
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  })
}

// ----------------------------------------------------------------------------
// TIMETABLE
// ----------------------------------------------------------------------------

export async function getTimetable() {
  if (USE_MOCK) {
    await delay()
    return mockTimetable
  }
  // GET /api/timetable -> Timetable[] (open to any authenticated user)
  return apiFetch('/timetable')
}

export async function createTimetableEntry(entry) {
  if (USE_MOCK) {
    await delay()
    const newEntry = { ...entry, id: nextId() }
    mockTimetable.push(newEntry)
    return newEntry
  }
  // POST /api/timetable (faculty only)
  // Backend's CreateTimetableDto whitelists exactly: day, period, time,
  // subject, room. `faculty` is derived server-side from the JWT, so we
  // must not send it (forbidNonWhitelisted would reject the request).
  const { day, period, time, subject, room } = entry
  return apiFetch('/timetable', {
    method: 'POST',
    body: JSON.stringify({ day, period: Number(period), time, subject, room }),
  })
}

export async function deleteTimetableEntry(id) {
  if (USE_MOCK) {
    await delay()
    const idx = mockTimetable.findIndex((t) => t.id === id)
    if (idx !== -1) mockTimetable.splice(idx, 1)
    return true
  }
  // DELETE /api/timetable/:id (faculty only)
  return apiFetch(`/timetable/${id}`, { method: 'DELETE' })
}

// ----------------------------------------------------------------------------
// ATTENDANCE
// ----------------------------------------------------------------------------

export async function getAttendanceForStudent(studentId) {
  if (USE_MOCK) {
    await delay()
    return mockAttendance.filter((a) => a.studentId === studentId)
  }
  // GET /api/attendance/student/:id
  // A student may only fetch their own id; faculty may fetch anyone's.
  return apiFetch(`/attendance/student/${studentId}`)
}

export async function getStudentsForFaculty() {
  if (USE_MOCK) {
    await delay()
    return mockStudentsForFaculty
  }
  // GET /api/faculty/students (faculty only) -> [{ id, rollNo, name }]
  return apiFetch('/faculty/students')
}

// records: [{ studentId, rollNo, status }]
export async function markAttendance({ subject, date, records }) {
  if (USE_MOCK) {
    await delay()
    const created = records.map((r) => ({
      id: nextId(),
      studentId: r.studentId,
      rollNo: r.rollNo,
      subject,
      date,
      status: r.status,
    }))
    mockAttendance.push(...created)
    return created
  }
  // POST /api/attendance/mark (faculty only)
  // Backend expects { subject, date, records: [{ studentId, rollNo, status }] }
  // date must be an ISO date string - `date` from <input type="date"> already is.
  return apiFetch('/attendance/mark', {
    method: 'POST',
    body: JSON.stringify({
      subject,
      date,
      records: records.map((r) => ({
        studentId: r.studentId,
        rollNo: r.rollNo,
        status: r.status,
      })),
    }),
  })
}

// ----------------------------------------------------------------------------
// LEAVE REQUESTS
// ----------------------------------------------------------------------------

export async function getLeaveRequestsForStudent(studentId) {
  if (USE_MOCK) {
    await delay()
    return mockLeaveRequests.filter((l) => l.studentId === studentId)
  }
  // GET /api/leave/student/:id
  return apiFetch(`/leave/student/${studentId}`)
}

export async function getAllLeaveRequests() {
  if (USE_MOCK) {
    await delay()
    return mockLeaveRequests
  }
  // GET /api/leave/all (faculty only)
  return apiFetch('/leave/all')
}

export async function submitLeaveRequest(payload) {
  if (USE_MOCK) {
    await delay()
    const newRequest = {
      ...payload,
      id: nextId(),
      status: 'PENDING',
      appliedOn: new Date().toISOString().slice(0, 10),
    }
    mockLeaveRequests.unshift(newRequest)
    return newRequest
  }
  // POST /api/leave/apply (student only)
  // Backend's ApplyLeaveDto whitelists exactly: fromDate, toDate, reason.
  // studentId/rollNo/studentName are derived server-side from the JWT and
  // student record, so they must NOT be sent (forbidNonWhitelisted: true).
  const { fromDate, toDate, reason } = payload
  return apiFetch('/leave/apply', {
    method: 'POST',
    body: JSON.stringify({ fromDate, toDate, reason }),
  })
}

export async function updateLeaveStatus(id, status) {
  if (USE_MOCK) {
    await delay()
    const req = mockLeaveRequests.find((l) => l.id === id)
    if (req) req.status = status
    return req
  }
  // PATCH /api/leave/:id/status (faculty only) - status: "APPROVED" | "REJECTED"
  return apiFetch(`/leave/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ----------------------------------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------------------------------

export async function getNotifications() {
  if (USE_MOCK) {
    await delay()
    return mockNotifications
  }
  // GET /api/notifications
  return apiFetch('/notifications')
}

export async function sendNotification(payload) {
  if (USE_MOCK) {
    await delay()
    const newNotif = { ...payload, id: nextId(), sentOn: new Date().toISOString() }
    mockNotifications.unshift(newNotif)
    return newNotif
  }
  // POST /api/notifications (faculty only)
  // Backend's SendNotificationDto whitelists exactly: title, body, audience.
  // sentBy is derived server-side from the JWT.
  const { title, body, audience } = payload
  return apiFetch('/notifications', {
    method: 'POST',
    body: JSON.stringify({ title, body, audience }),
  })
}

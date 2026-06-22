import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'

import LoginPage from './pages/LoginPage'

import StudentOverview from './pages/student/StudentOverview'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentLeave from './pages/student/StudentLeave'
import StudentTimetable from './pages/student/StudentTimetable'
import StudentNotifications from './pages/student/StudentNotifications'

import FacultyOverview from './pages/faculty/FacultyOverview'
import FacultyAttendance from './pages/faculty/FacultyAttendance'
import FacultyLeave from './pages/faculty/FacultyLeave'
import FacultyTimetable from './pages/faculty/FacultyTimetable'
import FacultyNotifications from './pages/faculty/FacultyNotifications'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'FACULTY' ? '/faculty' : '/student'} replace />
}

function StudentRoute({ children }) {
  return (
    <ProtectedRoute allowedRole="STUDENT">
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}

function FacultyRoute({ children }) {
  return (
    <ProtectedRoute allowedRole="FACULTY">
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/student" element={<StudentRoute><StudentOverview /></StudentRoute>} />
          <Route path="/student/attendance" element={<StudentRoute><StudentAttendance /></StudentRoute>} />
          <Route path="/student/leave" element={<StudentRoute><StudentLeave /></StudentRoute>} />
          <Route path="/student/timetable" element={<StudentRoute><StudentTimetable /></StudentRoute>} />
          <Route path="/student/notifications" element={<StudentRoute><StudentNotifications /></StudentRoute>} />

          <Route path="/faculty" element={<FacultyRoute><FacultyOverview /></FacultyRoute>} />
          <Route path="/faculty/attendance" element={<FacultyRoute><FacultyAttendance /></FacultyRoute>} />
          <Route path="/faculty/leave" element={<FacultyRoute><FacultyLeave /></FacultyRoute>} />
          <Route path="/faculty/timetable" element={<FacultyRoute><FacultyTimetable /></FacultyRoute>} />
          <Route path="/faculty/notifications" element={<FacultyRoute><FacultyNotifications /></FacultyRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

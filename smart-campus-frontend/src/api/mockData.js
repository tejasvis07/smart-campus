// Mock data store — simulates what MySQL + Spring Boot will eventually return.
// Shapes here are designed to match a plausible REST API response so swapping
// to real fetch calls later requires no changes to component code.

export const mockUsers = [
  {
    id: 1,
    role: 'STUDENT',
    name: 'Asha Rajan',
    email: 'asha.rajan@campus.edu',
    rollNo: 'CS21B045',
    department: 'Computer Science',
    semester: 5,
  },
  {
    id: 2,
    role: 'FACULTY',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@campus.edu',
    facultyId: 'FAC-118',
    department: 'Computer Science',
  },
]

export const mockTimetable = [
  { id: 1, day: 'Monday', period: 1, time: '09:00 - 09:50', subject: 'Data Structures', faculty: 'Dr. Meera Iyer', room: 'CS-201' },
  { id: 2, day: 'Monday', period: 2, time: '09:50 - 10:40', subject: 'Operating Systems', faculty: 'Dr. R. Sundar', room: 'CS-204' },
  { id: 3, day: 'Monday', period: 3, time: '11:00 - 11:50', subject: 'Database Systems', faculty: 'Dr. Priya Nair', room: 'CS-105' },
  { id: 4, day: 'Tuesday', period: 1, time: '09:00 - 09:50', subject: 'Computer Networks', faculty: 'Dr. A. Bose', room: 'CS-202' },
  { id: 5, day: 'Tuesday', period: 2, time: '09:50 - 10:40', subject: 'Data Structures', faculty: 'Dr. Meera Iyer', room: 'CS-201' },
  { id: 6, day: 'Wednesday', period: 1, time: '09:00 - 09:50', subject: 'Database Systems', faculty: 'Dr. Priya Nair', room: 'CS-105' },
  { id: 7, day: 'Wednesday', period: 2, time: '09:50 - 10:40', subject: 'Operating Systems', faculty: 'Dr. R. Sundar', room: 'CS-204' },
  { id: 8, day: 'Thursday', period: 1, time: '09:00 - 09:50', subject: 'Computer Networks', faculty: 'Dr. A. Bose', room: 'CS-202' },
  { id: 9, day: 'Thursday', period: 3, time: '11:00 - 11:50', subject: 'Data Structures', faculty: 'Dr. Meera Iyer', room: 'CS-201' },
  { id: 10, day: 'Friday', period: 2, time: '09:50 - 10:40', subject: 'Database Systems', faculty: 'Dr. Priya Nair', room: 'CS-105' },
]

export const mockStudentsForFaculty = [
  { id: 1, rollNo: 'CS21B045', name: 'Asha Rajan' },
  { id: 3, rollNo: 'CS21B046', name: 'Kabir Mehta' },
  { id: 4, rollNo: 'CS21B047', name: 'Lakshmi Pillai' },
  { id: 5, rollNo: 'CS21B048', name: 'Rohan Verma' },
  { id: 6, rollNo: 'CS21B049', name: 'Sneha Kulkarni' },
  { id: 7, rollNo: 'CS21B050', name: 'Vikram Singh' },
]

export let mockAttendance = [
  { id: 1, studentId: 1, rollNo: 'CS21B045', subject: 'Data Structures', date: '2026-06-19', status: 'PRESENT' },
  { id: 2, studentId: 1, rollNo: 'CS21B045', subject: 'Operating Systems', date: '2026-06-19', status: 'PRESENT' },
  { id: 3, studentId: 1, rollNo: 'CS21B045', subject: 'Database Systems', date: '2026-06-18', status: 'ABSENT' },
  { id: 4, studentId: 1, rollNo: 'CS21B045', subject: 'Computer Networks', date: '2026-06-18', status: 'PRESENT' },
  { id: 5, studentId: 1, rollNo: 'CS21B045', subject: 'Data Structures', date: '2026-06-17', status: 'PRESENT' },
  { id: 6, studentId: 1, rollNo: 'CS21B045', subject: 'Operating Systems', date: '2026-06-17', status: 'LATE' },
  { id: 7, studentId: 1, rollNo: 'CS21B045', subject: 'Database Systems', date: '2026-06-16', status: 'PRESENT' },
]

export let mockLeaveRequests = [
  {
    id: 1,
    studentId: 1,
    rollNo: 'CS21B045',
    studentName: 'Asha Rajan',
    fromDate: '2026-06-25',
    toDate: '2026-06-26',
    reason: 'Family function out of town.',
    status: 'PENDING',
    appliedOn: '2026-06-20',
  },
  {
    id: 2,
    studentId: 1,
    rollNo: 'CS21B045',
    studentName: 'Asha Rajan',
    fromDate: '2026-06-10',
    toDate: '2026-06-10',
    reason: 'Medical appointment.',
    status: 'APPROVED',
    appliedOn: '2026-06-08',
  },
  {
    id: 3,
    studentId: 4,
    rollNo: 'CS21B047',
    studentName: 'Lakshmi Pillai',
    fromDate: '2026-06-22',
    toDate: '2026-06-23',
    reason: 'Fever, attaching medical certificate on return.',
    status: 'PENDING',
    appliedOn: '2026-06-21',
  },
]

export let mockNotifications = [
  {
    id: 1,
    title: 'Database Systems class rescheduled',
    body: "Friday's Database Systems class moves to Room CS-110 due to maintenance in CS-105.",
    sentBy: 'Dr. Priya Nair',
    sentOn: '2026-06-20T14:30:00',
    audience: 'Semester 5',
  },
  {
    id: 2,
    title: 'Mid-semester exam timetable released',
    body: 'Check the notice board for the revised mid-semester examination schedule.',
    sentBy: 'Examination Cell',
    sentOn: '2026-06-19T10:00:00',
    audience: 'All Students',
  },
  {
    id: 3,
    title: 'Leave request approved',
    body: 'Your leave request for 10 June 2026 has been approved.',
    sentBy: 'Dr. Meera Iyer',
    sentOn: '2026-06-09T09:15:00',
    audience: 'Asha Rajan',
  },
]

let idCounter = 1000
export const nextId = () => ++idCounter

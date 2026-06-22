import { PrismaClient, Role, AttendanceStatus, LeaveStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'demo1234'; // same for all seeded users, for convenience

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // --- Faculty ---
  const meera = await prisma.user.upsert({
    where: { email: 'meera.iyer@campus.edu' },
    update: {},
    create: {
      name: 'Dr. Meera Iyer',
      email: 'meera.iyer@campus.edu',
      password: passwordHash,
      role: Role.FACULTY,
      facultyId: 'FAC-118',
      department: 'Computer Science',
    },
  });

  const sundar = await prisma.user.upsert({
    where: { email: 'r.sundar@campus.edu' },
    update: {},
    create: {
      name: 'Dr. R. Sundar',
      email: 'r.sundar@campus.edu',
      password: passwordHash,
      role: Role.FACULTY,
      facultyId: 'FAC-119',
      department: 'Computer Science',
    },
  });

  // --- Students ---
  const studentSeeds = [
    { rollNo: 'CS21B045', name: 'Asha Rajan', email: 'asha.rajan@campus.edu' },
    { rollNo: 'CS21B046', name: 'Kabir Mehta', email: 'kabir.mehta@campus.edu' },
    { rollNo: 'CS21B047', name: 'Lakshmi Pillai', email: 'lakshmi.pillai@campus.edu' },
    { rollNo: 'CS21B048', name: 'Rohan Verma', email: 'rohan.verma@campus.edu' },
    { rollNo: 'CS21B049', name: 'Sneha Kulkarni', email: 'sneha.kulkarni@campus.edu' },
    { rollNo: 'CS21B050', name: 'Vikram Singh', email: 'vikram.singh@campus.edu' },
  ];

  const students: Awaited<ReturnType<typeof prisma.user.upsert>>[] = [];
  for (const s of studentSeeds) {
    const student = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.name,
        email: s.email,
        password: passwordHash,
        role: Role.STUDENT,
        rollNo: s.rollNo,
        semester: 5,
        department: 'Computer Science',
      },
    });
    students.push(student);
  }
  const asha = students[0];

  // --- Timetable ---
  await prisma.timetable.deleteMany({});
  await prisma.timetable.createMany({
    data: [
      { day: 'Monday', period: 1, time: '09:00 - 09:50', subject: 'Data Structures', room: 'CS-201', facultyId: meera.id },
      { day: 'Monday', period: 2, time: '09:50 - 10:40', subject: 'Operating Systems', room: 'CS-204', facultyId: sundar.id },
      { day: 'Tuesday', period: 1, time: '09:00 - 09:50', subject: 'Data Structures', room: 'CS-201', facultyId: meera.id },
      { day: 'Wednesday', period: 2, time: '09:50 - 10:40', subject: 'Operating Systems', room: 'CS-204', facultyId: sundar.id },
      { day: 'Thursday', period: 3, time: '11:00 - 11:50', subject: 'Data Structures', room: 'CS-201', facultyId: meera.id },
    ],
  });

  // --- Attendance (for Asha) ---
  await prisma.attendance.deleteMany({ where: { studentId: asha.id } });
  const today = new Date();
  const daysAgo = (n: number) => new Date(today.getTime() - n * 24 * 60 * 60 * 1000);

  await prisma.attendance.createMany({
    data: [
      { studentId: asha.id, markedById: meera.id, subject: 'Data Structures', date: daysAgo(3), status: AttendanceStatus.PRESENT },
      { studentId: asha.id, markedById: sundar.id, subject: 'Operating Systems', date: daysAgo(3), status: AttendanceStatus.PRESENT },
      { studentId: asha.id, markedById: meera.id, subject: 'Data Structures', date: daysAgo(2), status: AttendanceStatus.LATE },
      { studentId: asha.id, markedById: sundar.id, subject: 'Operating Systems', date: daysAgo(1), status: AttendanceStatus.ABSENT },
    ],
  });

  // --- Leave requests ---
  await prisma.leaveRequest.deleteMany({ where: { studentId: asha.id } });
  await prisma.leaveRequest.create({
    data: {
      studentId: asha.id,
      fromDate: daysAgo(-3),
      toDate: daysAgo(-2),
      reason: 'Family function out of town.',
      status: LeaveStatus.PENDING,
    },
  });

  // --- Notifications ---
  await prisma.notification.deleteMany({});
  await prisma.notification.create({
    data: {
      title: 'Mid-semester exam timetable released',
      body: 'Check the notice board for the revised mid-semester examination schedule.',
      audience: 'All Students',
      sentById: meera.id,
    },
  });

  console.log('Seed complete.');
  console.log(`All demo users share the password: ${DEMO_PASSWORD}`);
  console.log(`Student login: ${asha.email}`);
  console.log(`Faculty login: ${meera.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# Smart Campus Management System

A full-stack web application for academic institutions, with separate
student and faculty portals for attendance, leave requests, timetables, and
notifications.

```
React + Tailwind CSS  ⇄  NestJS + Prisma + MySQL  ⇄  JWT Auth
```

## Overview

Smart Campus replaces the scattered spreadsheets-and-notice-board workflow
of a typical department with one system both students and faculty log into.
Students check their attendance and timetable, apply for leave, and read
notices. Faculty take attendance, approve or reject leave requests, manage
the class schedule, and broadcast notices — all from the same data, in real
time.

## Features

| Feature | Student | Faculty |
|---|---|---|
| Login (JWT, role-based) | ✅ | ✅ |
| View attendance history & per-subject rate | ✅ | — |
| Mark attendance for a class roster | — | ✅ |
| Apply for leave | ✅ | — |
| Approve / reject leave requests | — | ✅ |
| View weekly timetable | ✅ | ✅ |
| Add / remove timetable slots | — | ✅ |
| Receive notifications | ✅ | ✅ |
| Send notifications | — | ✅ |

## Architecture

```
smart-campus/
├── smart-campus-frontend/   React + Vite + Tailwind CSS
└── smart-campus-backend/    NestJS + Prisma + MySQL
```

The two projects are independent and communicate over a REST API:

```
┌─────────────────────┐        HTTPS / JSON        ┌──────────────────────┐
│  smart-campus-       │ ───────────────────────▶ │  smart-campus-        │
│  frontend             │   Authorization: Bearer  │  backend                │
│  (React, port 5173)   │ ◀─────────────────────── │  (NestJS, port 8080)   │
└─────────────────────┘                            └──────────────────────┘
                                                              │
                                                              ▼
                                                        ┌──────────┐
                                                        │  MySQL   │
                                                        └──────────┘
```

- **Frontend**: React 19, Tailwind CSS, React Router, Vite. All API calls
  live in one file (`src/api/client.js`), so the UI and the network layer
  are cleanly separated.
- **Backend**: NestJS with Prisma ORM against MySQL. JWT-based auth via
  Passport, role-based route guards (`@Roles(Role.FACULTY)` /
  `Role.STUDENT`), and class-validator request validation.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite |
| Styling | Tailwind CSS 3 |
| Routing | React Router v7 |
| Icons | lucide-react |
| Backend framework | NestJS 11 |
| ORM | Prisma |
| Database | MySQL |
| Auth | JWT (`@nestjs/jwt`, `passport-jwt`) + bcrypt |
| Validation | class-validator / class-transformer |

## Getting started

Each sub-project has its own detailed setup guide. The short version:

### 1. Backend

```bash
cd smart-campus-backend
npm install
cp .env.example .env        # set your MySQL credentials + JWT secret
npm run prisma:generate
npm run prisma:migrate
npm run db:seed             # creates demo users (password: demo1234)
npm run start:dev           # → http://localhost:8080/api
```

See [`smart-campus-backend/README.md`](./smart-campus-backend/README.md)
for the full Prisma schema, environment variables, and API reference.

### 2. Frontend

```bash
cd smart-campus-frontend
npm install
npm run dev                 # → http://localhost:5173
```

See [`smart-campus-frontend/README.md`](./smart-campus-frontend/README.md)
for project structure and how the API client is wired up.

### 3. Log in

| Role | Email | Password |
|---|---|---|
| Student | `asha.rajan@campus.edu` | `demo1234` |
| Faculty | `meera.iyer@campus.edu` | `demo1234` |

## API reference

All endpoints are served from the backend at `http://localhost:8080/api`
and require `Authorization: Bearer <token>` except login.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/auth/login` | public | `{ email, password, role }` → `{ token, user }` |
| GET | `/timetable` | student/faculty | weekly timetable |
| POST | `/timetable` | faculty | add a class slot |
| DELETE | `/timetable/:id` | faculty | remove a class slot |
| GET | `/attendance/student/:id` | student (self) / faculty | a student's attendance history |
| GET | `/faculty/students` | faculty | roster of all students |
| POST | `/attendance/mark` | faculty | bulk-mark attendance for a class |
| GET | `/leave/student/:id` | student (self) / faculty | one student's leave requests |
| GET | `/leave/all` | faculty | all leave requests |
| POST | `/leave/apply` | student | submit a leave request |
| PATCH | `/leave/:id/status` | faculty | `{ status: "APPROVED" \| "REJECTED" }` |
| GET | `/notifications` | student/faculty | notification feed |
| POST | `/notifications` | faculty | `{ title, body, audience }` |

## Data model

A single `User` table holds both students and faculty, distinguished by a
`role` enum (`STUDENT` \| `FACULTY`). Supporting tables: `Timetable`,
`Attendance`, `LeaveRequest`, `Notification` — each linked back to the
`User` who owns or created it. Full schema in
[`smart-campus-backend/prisma/schema.prisma`](./smart-campus-backend/prisma/schema.prisma).

## Why this project

This was built as a resume/portfolio project to demonstrate:

- End-to-end CRUD across a real relational schema
- Role-based access control enforced at the API layer, not just hidden in
  the UI
- A clean separation between frontend and backend, connected by a typed,
  documented REST contract
- Practical, everyday enterprise application patterns (auth, validation,
  guards, DTOs) rather than a toy CRUD demo

## License

This project is unlicensed / for educational and portfolio use.

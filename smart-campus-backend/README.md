# Smart Campus Management System — Backend (NestJS)

REST API for the Smart Campus Management System, built to match the contract
already expected by the React frontend (`src/api/client.js` there).

## Tech stack

- NestJS 11 (TypeScript)
- Prisma ORM + MySQL
- JWT auth via `@nestjs/jwt` + `passport-jwt`
- bcrypt password hashing
- class-validator / class-transformer for request validation

## 1. Prerequisites

- Node.js 18+
- A running MySQL server (local or remote)

## 2. Setup

```bash
npm install
```

Copy the env file and fill in your real MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/smart_campus"
JWT_SECRET="some-long-random-string"
JWT_EXPIRES_IN="1d"
PORT=8080
CORS_ORIGIN="http://localhost:5173"
```

Create the database (if it doesn't exist yet):

```sql
CREATE DATABASE smart_campus;
```

## 3. Generate Prisma client & run migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This creates the `users`, `timetable`, `attendance`, `leave_requests`, and
`notifications` tables per `prisma/schema.prisma`.

## 4. Seed demo data

```bash
npm run db:seed
```

This creates:
- Faculty: `meera.iyer@campus.edu`, `r.sundar@campus.edu`
- Students: `asha.rajan@campus.edu` (roll `CS21B045`) and 5 classmates
- A starter timetable, some attendance history, one pending leave request,
  and one notification.

**All seeded users share the password `demo1234`.**

## 5. Run the server

```bash
npm run start:dev
```

API is served at `http://localhost:8080/api`.

## Connecting the React frontend

In the frontend's `src/api/client.js`, set:

```js
export const USE_MOCK = false
```

and uncomment the real `fetch` blocks. `BASE_URL` there already points to
`http://localhost:8080/api`, which matches this server's `app.setGlobalPrefix('api')`
+ default port.

CORS is open to `CORS_ORIGIN` in `.env` (defaults to the Vite dev server at
`http://localhost:5173`).

## API reference

All endpoints are prefixed with `/api`. Protected endpoints require
`Authorization: Bearer <token>`, obtained from `/auth/login`.

| Method | Endpoint                      | Role           | Purpose                              |
|--------|--------------------------------|----------------|----------------------------------------|
| POST   | `/auth/login`                  | public         | `{ email, password, role }` → `{ token, user }` |
| GET    | `/timetable`                   | student/faculty| weekly timetable                       |
| POST   | `/timetable`                   | faculty        | add a class slot                       |
| DELETE | `/timetable/:id`               | faculty        | remove a class slot                    |
| GET    | `/attendance/student/:id`      | student (self) / faculty | a student's attendance history |
| GET    | `/faculty/students`            | faculty        | roster of all students                 |
| POST   | `/attendance/mark`             | faculty        | bulk-mark attendance for a class       |
| GET    | `/leave/student/:id`           | student (self) / faculty | one student's leave requests |
| GET    | `/leave/all`                   | faculty        | all leave requests                     |
| POST   | `/leave/apply`                 | student        | submit a leave request                 |
| PATCH  | `/leave/:id/status`            | faculty        | `{ status: "APPROVED" | "REJECTED" }`  |
| GET    | `/notifications`                | student/faculty| notification feed                      |
| POST   | `/notifications`                | faculty        | `{ title, body, audience }`            |

### Example: login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha.rajan@campus.edu","password":"demo1234","role":"STUDENT"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 3,
    "name": "Asha Rajan",
    "email": "asha.rajan@campus.edu",
    "role": "STUDENT",
    "rollNo": "CS21B045",
    "semester": 5,
    "department": "Computer Science"
  }
}
```

Use the token on subsequent requests:

```bash
curl http://localhost:8080/api/attendance/student/3 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Project structure

```
prisma/
  schema.prisma       <- data model (User/Role, Timetable, Attendance, LeaveRequest, Notification)
  seed.ts              <- demo data seed script
src/
  prisma/              <- PrismaService (global, injectable)
  auth/                <- login, JWT strategy, guards, @Roles()/@CurrentUser() decorators
  users/                <- faculty roster endpoint
  timetable/            <- timetable CRUD
  attendance/           <- attendance history + bulk marking
  leave/                <- leave request apply/list/approve/reject
  notifications/        <- notification feed + send
  app.module.ts
  main.ts               <- global prefix /api, ValidationPipe, CORS
```

## Role-based access control

- `@UseGuards(JwtAuthGuard, RolesGuard)` is applied per-controller.
- `@Roles(Role.FACULTY)` (or `Role.STUDENT`) restricts a route to that role;
  omitting it allows any authenticated user.
- Students are additionally checked in the service/controller layer so they
  can only read their own attendance/leave records (`/attendance/student/:id`,
  `/leave/student/:id`), even though the route itself is open to any
  authenticated student.

## Notes on the Prisma schema

- A single `User` table holds both students and faculty, distinguished by the
  `role` enum (`STUDENT` | `FACULTY`). This mirrors how the frontend already
  treats login. Student-only fields (`rollNo`, `semester`) and faculty-only
  fields (`facultyId`) are nullable for the role that doesn't use them.
- `Attendance.status` and `LeaveRequest.status` are proper enums
  (`PRESENT/ABSENT/LATE`, `PENDING/APPROVED/REJECTED`), matching the values
  the frontend's `StatusBadge` component already expects.

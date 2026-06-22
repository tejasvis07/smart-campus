# Smart Campus Management System — Frontend

React + Tailwind frontend for the Smart Campus Management System. Wired up
to the real NestJS + Prisma + MySQL backend (`smart-campus-backend`).

## Tech stack

- React 19 + Vite
- Tailwind CSS 3
- React Router v7
- lucide-react (icons)

## Getting started

1. Make sure the backend is running first (see its own README):
   ```bash
   # in smart-campus-backend/
   npm run start:dev
   # -> http://localhost:8080/api
   ```
2. Then start the frontend:
   ```bash
   npm install
   npm run dev
   ```

Open the printed local URL (typically `http://localhost:5173`).

Build for production:

```bash
npm run build
```

## Demo logins

These match the backend's seed script (`npm run db:seed` in the backend
project). All seeded accounts share the password `demo1234`.

- **Student:** asha.rajan@campus.edu
- **Faculty:** meera.iyer@campus.edu

Use the role selector on the login page, or the "Demo access" quick-fill
buttons.

## Project structure

```
src/
  api/
    client.js        <- ALL backend calls go through here (real fetches to NestJS)
    mockData.js       <- in-memory mock dataset, used only if USE_MOCK = true
  components/         <- shared UI: Card, StatusBadge, TimetableGrid, layout, route guard
  context/
    AuthContext.jsx   <- login state, JWT storage, logout
  pages/
    LoginPage.jsx
    student/          <- Overview, Attendance, Leave, Timetable, Notifications
    faculty/           <- Overview, Mark Attendance, Leave approvals, Timetable, Notifications
  App.jsx             <- routes
  main.jsx            <- entry point
```

## How the API layer works

`src/api/client.js` is the only file that talks to the network.

- `export const USE_MOCK = false` — currently live against the real backend.
  Set this to `true` to fall back to in-memory mock data if you want to work
  on the UI without the backend running.
- `BASE_URL = 'http://localhost:8080/api'` — must match wherever your NestJS
  backend is actually running. Change this if you deploy the backend
  elsewhere or run it on a different port.
- `apiFetch()` attaches `Authorization: Bearer <token>` from
  `localStorage` on every request, and unpacks NestJS's JSON error shape
  (`{ statusCode, message, error }`) into a readable `Error`.
- A few `create`/`apply`/`send` functions intentionally strip extra fields
  (like `studentId`, `faculty`, `sentBy`) before sending, because the
  backend's `ValidationPipe` uses `forbidNonWhitelisted: true` — those
  fields are derived server-side from the JWT instead, and a stray field in
  the request body would cause a 400. The full object (with those fields
  filled back in) comes back in the response and is what's used to update
  on-screen state.

## Troubleshooting

- **"Could not reach the server"** — the backend isn't running, or
  `BASE_URL` doesn't match its port. Confirm `http://localhost:8080/api/timetable`
  loads in a browser (it'll 401 without a token, but that still proves the
  server is up).
- **CORS errors in the browser console** — set `CORS_ORIGIN` in the
  backend's `.env` to match the frontend's dev URL (`http://localhost:5173`
  by default).
- **401 on every request right after logging in** — check that the backend
  and frontend agree on `JWT_SECRET`/the token isn't expired; tokens are
  stored under the `campus_jwt` key in `localStorage` if you want to inspect
  one directly.

## Design notes

Visual identity is built around the idea of a campus **timetable/ledger**:
a deep ink-blue + warm amber palette, a serif display face (Fraunces) for
headings, and a monospace face for times/periods/IDs — like a real academic
register rather than a generic admin-panel template.

# Ticktock Timesheet

Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll land on the login page.

**Demo login:**
- Email: `boyden@ticktock.com`
- Password: `password123`

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript 5
- Tailwind CSS v4

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — ESLint check

## Features

- **Auth** — session cookies signed with JOSE, route protection via `proxy.ts`
- **Weekly timesheets** — navigate weeks via `/timesheet/[weekId]`
- **Task CRUD** — add, edit, and delete time entries through a modal form
- **Projects & work types** — pick from preset projects and task categories
- **Progress bar** — visual hours-per-week tracker with status badge
- **Filters, sort & pagination** 
- **Responsive UI**

## A quick tour to check everything works

1. **Log in** — hit `/`, you'll redirect to `/login`. Use the creds above. Try a wrong password first to see the error.
2. **Tick "Remember me"** — your session sticks around for 7 days instead of 1.
3. **Land on the timesheet** — you should see the current week's entries (or an empty state if it's fresh).
4. **Add a task** — click **Add new task** on any day. Try saving with empty fields to see validation errors.
5. **Edit task** — hit the row menu, change the hours, save. The progress bar at the top should update.
6. **Delete task** — same menu, remove it. The status badge goes back to "Incomplete" or "Missing".
7. **Fill a full 40 hours** — watch the badge turn green and say "Completed".
8. **Move between weeks** — use the week picker. Each week keeps its own tasks.
9. **Play with the list view** — go to `/timesheet`, try sorting, filtering by status, and changing page size.
10. **Log out, then visit `/timesheet`** — you should get redirect back to `/login`. If you're logged in and try to hit `/login` it redirects you to the timesheet.
11. **Resize the window** — it's mobile responsive too. Somewhat.

## Project Layout

```
app/
├── api/           # Route handlers (auth, timesheets)
├── components/    # UI building blocks
├── lib/           # Session, users, timesheet helpers, constants
├── login/         # Login page
└── timesheet/     # Timesheet pages
proxy.ts           # Request proxy (Next 16)
```


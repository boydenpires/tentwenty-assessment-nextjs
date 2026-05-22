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

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **JOSE** — JWT session signing
- **clsx** — conditional class names
- **ESLint 9** + `eslint-config-next`

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

## How to Test (Manual)

1. **Login flow** — visit `/`, get redirected to `/login`, sign in with the above creds.
2. **Create a task** — open any week, hit **Add new task**, fill in all the required fields and save.
3. **Edit & delete** — use the row action menu to modify or remove a task.
4. **Week navigation** — jump between weeks and verify entries persist per `weekId`.
5. **Filters & paging** — try sorting, filtering, and changing page size on the timesheet list.
6. **Auth guard** — log out and try hitting `/timesheet` directly; you should bounce to `/login`.

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



# Pettopia-Fe

Monorepo, 2 independent Next.js 16 (App Router) + React 19 + TS + Tailwind 4 apps. No root package.json.

| App | Dir | Port | Users |
|---|---|---|---|
| Customer | `pettopia-fe/` | 4001 | pet owners: pets, appointments, community, payment |
| Partner | `pettopia-clinic-fe/` | 4000 | Admin / Staff / Clinic / Vet / User(applicant) dashboards |

Backend (separate repo): `NEXT_PUBLIC_PETTOPIA_API_URL` (default `http://localhost:3000/api/v1`).
File map: see `docs/PROJECT_STRUCTURE.md` — read it only when you need to locate files.

## Token rules
- Ask which app if the task is ambiguous; work in ONE app dir only.
- Locate with grep/glob first; read only the needed range (offset/limit). Never read whole large pages (>400 lines) without need.
- Never read: `node_modules/`, `.next/`, `package-lock.json`, `database.json`, `public/`, images.
- No exploratory sweeps of the whole repo; no re-reading files already in context.
- Answers: short, code-first, no summaries of what was changed unless asked.
- Edits: minimal diffs via edit tool; don't rewrite whole files; no new comments/docs unless asked.

## Code conventions
- Path alias `@/*` -> `<app>/src/*`.
- API calls live in `src/services/<domain>/*Service.ts` (axios instance + Bearer token from `localStorage.authToken`). New code should call services, not axios/fetch directly (some legacy pages still do).
- Large files (>600 lines, grep before reading): `clinic-fe/app/clinic/appointment/page.tsx` (1.7k), `fe/app/user/pet/new`, `fe/app/user/appointments/booking`, `fe/app/user/edit-profile`, `clinic-fe/components/common/UpdateProfile.tsx`, `fe/services/petcare/petService.ts`, `clinic-fe/services/partner/veterianrianService.ts`.
- Route guard: `src/proxy.ts` (Next 16 replacement of middleware), role read from cookie `userRole`.
- Toasts: `src/contexts/ToastContext.tsx`. Pages are `'use client'` components under `src/app/**/page.tsx`.
- UI text is Vietnamese; keep files UTF-8 (PowerShell 5.1 `Get-Content` shows mojibake — use the read tool).
- Two apps duplicate some files (`proxy.ts`, `utils/jwt.ts`, `utils/cookieHelper.ts`, `ToastContext`, `Toast`, `NotificationBell`, auth forms). Change both only if the user asks.

## Commands (run inside the app dir)
- `npm install` · `npm run dev` · `npm run build`
- Typecheck: `npx tsc --noEmit` (no lint script configured).

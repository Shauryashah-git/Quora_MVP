# Quora MVP

## Overview

Quora MVP is a fast, modern Q&A platform clone built with **Next.js 14 (App Router)** and **TypeScript**, focused on clean UX, accessibility, security-minded defaults, and easy backend extensibility. It currently runs on mock in-memory data (questions, answers, users) that you can later swap for a real database (Supabase, Postgres, Prisma, etc.).

### Core Capabilities
- Ask, edit, and delete questions (mock persistence layer)
- Post, edit, and delete answers & comments
- Upvote / downvote with optimistic UI patterns
- Follow users & explore topics / tags
- Lightweight notifications & moderation scaffolding
- Accessible components (keyboard navigation & ARIA-friendly patterns)
- Dark / light theme toggle via `next-themes`
- Centralized validation & sanitization (Zod + utility helpers)
- SEO-ready: metadata, Open Graph, sitemap, robots directives
- Security middleware: headers, CSP, basic in-memory rate limiting
- Performance: component memoization & skeleton loading states

### Tech Stack
| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript / React 18 |
| Styling | Tailwind CSS + custom design tokens |
| UI Primitives | Radix UI + custom wrappers |
| Forms & Validation | React Hook Form + Zod |
| State Helpers | Context + lightweight utilities |
| Testing | Jest + React Testing Library (base setup) |
| Auth (current) | Mock (localStorage + SHA-256 hashing) |

### Folder Structure Highlights
- `app/` – Routes, layout, sitemap, loading & error boundaries
- `components/` – UI + domain components (cards, modals, forms, skeletons)
- `contexts/` – Auth, voting, follow, notification state containers
- `lib/` – Utilities (validation, date, password hashing, SEO, mock data)
- `middleware.ts` – Security headers + rate limiting logic
- `types/` – Shared TypeScript interfaces

### Why This Starter?
- Clean separation of concerns for rapid feature iteration
- Secure-by-default considerations (sanitization & headers scaffold)
- Realistic UI flows without locking you into any backend
- Easy theming & future design expansion

### Ready for Extension
Add real persistence by replacing mock providers in `lib/mock-data.ts` and wiring API routes (`app/api/*`). Introduce Supabase / Prisma models, then progressively migrate state contexts to server actions or data fetching hooks.

This repository is standalone; no external platform auto-sync.

## Local Development

1. Install dependencies (pnpm preferred):
	```bash
	pnpm install
	```
2. Copy `.env.example` to `.env.local` and adjust values.
3. Run the dev server:
	```bash
	pnpm dev
	```
4. Build for production & start locally:
	```bash
	pnpm build && pnpm start
	```

## Production Hardening Notes

- Mock auth only (localStorage); not for real user data.
- Security headers & CSP applied via `middleware.ts` and `next.config.mjs`.
- Input sanitization & validation implemented in `lib/validation.ts`.
- Passwords (mock) hashed client-side (SHA-256) – upgrade to real backend before launch.
- Rate limiting in middleware (in-memory; replace with Redis for scaling).

## Deployment Checklist

- [ ] Set real domain in ALLOWED_ORIGIN
- [ ] Replace mock auth with real backend (if going public)
- [ ] Review CSP for any added external assets
- [ ] Enable analytics (optional) by setting NEXT_PUBLIC_GA_ID
- [ ] Run `pnpm lint` and ensure no critical issues
- [ ] Run `pnpm build` to confirm successful production build

## License

Internal demo / educational use.

## Deployment (Self-Host)

Example minimal flow:
```bash
pnpm install
pnpm build
pnpm start
```

Environment:
- Set `NEXT_PUBLIC_BASE_URL` to your production URL
- Optionally configure Supabase/Redis if you later enable them

## How It Works

1. Develop locally
2. Commit & push
3. Your chosen host builds & serves `.next` output

---

(Legacy Vercel/v0 instructions deleted.)

## Roadmap Ideas
- Real auth (Supabase / NextAuth) & sessions
- DB-backed questions / answers / votes
- Infinite scroll & pagination
- Rich text / media uploads
- Real-time updates (WebSockets or Supabase channels)
- Role-based moderation + reporting workflows
- Expanded test coverage (units + integration + a11y checks)

## Contributing
1. Fork & branch: `feat/your-feature`
2. Run lint & type checks: `pnpm lint && pnpm typecheck`
3. Add/update tests when changing logic
4. Open PR with clear description + screenshots/GIFs if UI related

## Quick Start TL;DR
```bash
pnpm install
cp .env.example .env.local   # adjust values
pnpm dev                     # run locally
```

## Run Directly From GitHub (Full Steps)

Clone the repository:
```bash
git clone https://github.com/Shauryashah-git/Quora_MVP.git
cd Quora_MVP
```

Install dependencies (choose one package manager):
```bash
# pnpm (recommended)
pnpm install

# OR npm
npm install

# OR yarn
yarn install
```

Set up environment file:
```bash
cp .env.example .env.local
# edit .env.local as needed (BASE URL, keys, etc.)
```

Start development server:
```bash
pnpm dev
# then open http://localhost:3000
```

Build & run production locally:
```bash
pnpm build
pnpm start
```

Access from phone on same network (optional):
```bash
pnpm dev -- -H 0.0.0.0
# find your PC IP (ipconfig) then visit http://YOUR_IP:3000
```

Troubleshooting:
- Clear lockfiles if switching managers (remove `pnpm-lock.yaml` if using npm).
- If port busy, specify another: `pnpm dev -- -p 4000`.
- For Windows firewall prompts, allow Node.js to accept connections if using LAN access.

Production build:
```bash
pnpm build && pnpm start
```

## License
Internal demo / educational use (adapt as needed for your project).

---
Need a shorter tagline or badges re-added? Ask and we can tailor it.
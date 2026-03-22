# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **frontend** for Clawkathon — an AI-powered recruitment platform. It is a React + Vite + TypeScript SPA that connects to a separate backend (default: `http://localhost:8000`).

**Flow:** Landing page → Create job → Upload resumes (PDF/DOCX) → Start AI phone calls → View candidate scores/transcripts → Download report

## Commands

```bash
npm run dev        # Dev server on port 8080 (not 3000)
npm run build      # Production build → ./dist
npm run build:dev  # Dev-mode build
npm run lint       # ESLint
npm run test       # Run tests once (vitest)
npm run test:watch # Watch mode tests
npm run preview    # Preview production build
```

## Architecture

**Stack:** React 18, React Router v6, TanStack Query v5, Tailwind CSS, shadcn/ui (Radix UI), Zod, react-hook-form.

**Key files:**
- `src/lib/types.ts` — All shared TypeScript types (`Job`, `Candidate`, `Call`, `Scores`, etc.)
- `src/lib/api.ts` — All backend API calls; reads backend URL from `VITE_API_URL` env var
- `src/App.tsx` — Route definitions (BrowserRouter)

**Pages (`src/pages/`):**
- `LandingPage.tsx` — Job list
- `CreateJobPage.tsx` — Create job with scoring criteria
- `JobDetailPage.tsx` — Upload resumes, start/track calls, candidate table; polls every 4s when job is `calling` or `debriefing`
- `CandidateDetailPage.tsx` — Transcript, scores breakdown, recommendation
- `Index.tsx` / `NotFound.tsx` — Index redirect and 404

**State machine (from backend):**
- Job status: `created` → `calling` → `debriefing` → `done`
- Candidate status: `pending` → `calling` → `completed` | `rescheduled` | `no_answer`

**UI conventions:**
- `src/components/ui/` — shadcn/ui primitives (do not hand-edit these)
- `src/components/ScoreBar.tsx`, `StatusBadge.tsx` — Domain-specific shared components
- CSS utility classes `page-container`, `content-wrapper`, `card-surface`, `btn-primary`, `input-field` are defined in global CSS (not Tailwind utilities)
- `@` alias resolves to `src/`

## Environment

Create `frontend/.env.local` (or `.env` in this directory):
```
VITE_API_URL=http://localhost:8000
```

## Testing

Tests use Vitest + `@testing-library/react`. Test files live in `src/test/`. Playwright config is present (`playwright.config.ts`) via `lovable-agent-playwright-config` for e2e.

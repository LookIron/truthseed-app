# Build Spec Prompt “TruthSeed” (PWA) — v1

## Role

Act as a Staff-level Full-Stack Engineer + Product Engineer. Design and implement an installable web app (PWA) with **Next.js (App Router) + TypeScript** using production-grade best practices, clean architecture, and strong tooling.

## Objective (v1)

Build a **mobile-installable PWA** (Android/iOS) that shows users a **random biblical truth** about identity in Christ, supported by Bible references and verse text, with an option to **listen** to the verse.

### v1 UX (Only)

**Home screen `/`**

- On first load, show **one random Truth** from a local dataset.
- Display:
  1. Truth title (e.g., “Soy aceptado”, “Tengo plena seguridad”, “Soy importante”)
  2. “Renounce” line (e.g., “Renuncio a la mentira que… En Cristo…”)
  3. References list (e.g., “Juan 1:12”, “Romanos 8:1–2”, etc.)
  4. Verse text fetched from a Bible provider for the **primary** reference (first reference by default)
- Controls:
  - Button: **“Another truth”** → shows a different random truth
  - Button: **“Listen”** → reads the verse text out loud
  - Optional: translation selector (only if trivial)

### Explicitly Out of Scope for v1 (Save for v2)

- No “list all truths” page
- No search
- No truth detail pages
- No accounts/login

---

## Input Data (Truths Dataset)

The app ships with a local dataset (curated by the user). Model it cleanly.

### Data Model

- Truth:
  - `id: string` (slug)
  - `title: string`
  - `renounceStatement: string`
  - `category: "accepted" | "secure" | "important"` (or similar)
  - `references: Reference[]`
  - `tags?: string[]`
- Reference:
  - `book: string` (e.g., “Juan”)
  - `chapter: number`
  - `verseStart: number`
  - `verseEnd?: number`
  - `display: string` (e.g., “Juan 1:12”, “Romanos 8:35–39”)
  - `translation?: string` (e.g., “RVR60”)

Store in: `/src/content/truths.json`  
Validate at runtime with `zod` and fail fast with a meaningful error.

Add a script:

- `pnpm validate:content` → validates `truths.json` against zod schemas.

---

## Bible Text Retrieval (Provider Interface)

### Requirements

- Implement `BibleProvider` interface to fetch verse text from a `Reference`.
- Provide:
  - `BibleApiProvider` (real adapter)
  - `MockBibleProvider` (tests)
- Caching:
  - Client cache via IndexedDB (preferred) or Cache Storage:
    - key: `${translation}:${book}:${chapter}:${verseStart}-${verseEnd}`
  - Server caching via Next.js `fetch` with `revalidate` and safe headers.

### API Constraints

- Bible APIs vary by licensing/auth; design as:
  - Env vars for API base URL + key + translation
  - If not configured, show references only and a friendly message: “Bible text provider not configured.”

**Important:** Do not invent or paraphrase Scripture text. Only display what the configured provider returns.

---

## Audio (“Listen”)

### v1 Requirements

- Use **Web Speech API** (client-side TTS) as the default MVP.
- Controls:
  - play / pause / stop
  - speed (0.8x, 1x, 1.2x)
- Accessibility:
  - Keyboard operable
  - Proper ARIA labels
  - Visible focus states

---

## Tech Stack (Fixed)

- Next.js (App Router) + TypeScript
- Package manager: **pnpm**
- Styling: **Tailwind CSS** (preferred for speed/consistency)
- Validation: zod

### Testing

- Unit: Vitest + React Testing Library
- E2E: Playwright

### Lint/Format

- ESLint (next/core-web-vitals) + TypeScript rules
- Prettier

### Git Hygiene

- Husky + lint-staged
- commitlint (Conventional Commits)

---

## PWA Requirements

- Must be installable:
  - `manifest.webmanifest` with icons, name, short_name, theme_color, display=standalone
  - Service worker for offline caching
- Choose ONE approach and implement cleanly:
  - Option A: `next-pwa` (recommended for simplicity)
  - Option B: Workbox custom config

Offline strategy (v1):

- App shell cached (static assets)
- Truth dataset always local
- Verse text cached after first fetch (stale-while-revalidate)

iOS notes:

- Add `apple-touch-icon`
- Document “Add to Home Screen” behavior
- Ensure the app works reasonably without background sync assumptions

---

## Architecture & Folder Structure

Use a maintainable structure, with good practice but simple

Principles:

- UI components are simple; business logic in services/domain.
- External integrations behind interfaces.
- Strict TypeScript. No `any`.

---

## Pages & Behavior (v1)

### Home `/`

- On first load, pick a random truth and display it.
- Button “Another truth” picks a different one (avoid immediate repeats).
- Fetch verse text for the first reference (or a “primaryReference” field if present).
- Listen reads the verse text (fallback: read the reference display if text unavailable).

---

## Environment Variables

Provide `.env.example` and document:

- `BIBLE_API_BASE_URL`
- `BIBLE_API_KEY`
- `BIBLE_DEFAULT_TRANSLATION`
- `NEXT_PUBLIC_APP_NAME`

Never expose private API keys to the client. If needed, proxy through `/api/verse`.

---

## Testing Requirements

### Unit tests (Vitest)

- zod schema validation for dataset
- random selector avoids immediate repeats (deterministic via seeded RNG helper)
- BibleProvider mocked for verse fetching
- ListenButton logic with Web Speech API mocked

### E2E (Playwright)

- Home loads and shows a truth
- “Another truth” updates content
- Verse fetch path mocked (or use Mock provider behind a flag)

---

## CI

Add a GitHub Actions workflow to run on PR:

- install (pnpm)
- lint
- typecheck
- unit tests
- e2e tests (optional but preferred)

---

## Security & Licensing (Must Include)

- Do not hardcode Bible text unless the selected translation’s license allows it.
- Default to showing references if the provider is not configured.
- Keep API keys server-side.

---

## Delivery Format (Mandatory)

1. Briefly explain the overall architecture.
2. Show the final folder structure.
3. Implement the code **file by file** (full contents per file).
4. Explain key parts (BibleProvider, caching, PWA, TTS, random selection).
5. Explain how to run the project and tests (exact commands).

### Additionally include

6. A “Definition of Done” checklist with commands to verify everything is green.
7. Key decisions & trade-offs (PWA approach, caching, provider fallback).
8. Security/licensing notes and `.env.example`.
9. CI workflow file and explanation.
10. `pnpm validate:content` script and how it works.

---

## Start Now

Generate the entire project codebase, configs, and update the README with all the proyecte info. Keep the implementation clean, modular, and production-grade.

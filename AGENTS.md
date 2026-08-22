# AGENTS.md

Vue 3 (Composition API, `<script setup>`) + TypeScript PWA for tracking Canastra card-game scores. Vite build, Pinia state (with persisted-state plugin), Tailwind v4, Vitest for unit tests, Playwright for e2e.

## Environment
- **Node v26** — pinned via `.nvmrc` and `engines.node`. Use `pnpm` (not npm). CI installs with `pnpm install --frozen-lockfile`.
- Path alias `@` → `src/` (defined in `vite.config.ts`).

## Commands
- `pnpm dev` — Vite dev server (port 5173).
- `pnpm build` — runs **type-check then `vite build`** (`run-p type-check "build-only"`). Type errors fail the build.
- `pnpm type-check` — `vue-tsc --build` (project-references based; reads the `tsconfig*.json` set).
- `pnpm test:unit` — Vitest (jsdom env). Tests live in `src/**/__tests__/*` and `src/__tests__/`.
- `pnpm test:e2e` — Playwright, tests in `e2e/`. **First run needs `npx playwright install`.**
- `pnpm lint` — ESLint with `--fix` over the whole repo. Includes Vue, TS, Vitest, and Playwright configs (scoped by file glob).
- `pnpm format` — Prettier, but **only `src/`**. `e2e/` and config files are not auto-formatted.

## Gotchas
- **CI (`master.yml`) only runs `pnpm lint` + `pnpm test:unit`.** It does NOT run `type-check` or `test:e2e`. Type errors can reach `main` without failing the PR — run `pnpm type-check` yourself before finishing.
- E2E `webServer` auto-starts the dev server locally (`reuseExistingServer`), but on CI runs `pnpm preview` against the production build, so **build the app before debugging CI e2e** (`pnpm build` first).
- Tailwind v4 is wired via `@tailwindcss/vite` + CSS in `src/assets/css/tailwind.css`, not via `content` globs. Don't add `content` config expecting class scanning there.
- PWA (`vite-plugin-pwa`) service worker is disabled in dev (`devOptions.enabled: false`).

## Domain constants
- Default win threshold `3000` and obrigação threshold `1500` are hard-coded defaults in `src/stores/canastra.ts` (lines 11–12, reset at 31–32). Change both places if adjusting.

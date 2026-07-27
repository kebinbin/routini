# Routini website

The landing/docs site for [routini](https://github.com/kebinbin/routini), deployed to
[routini.dev](https://routini.dev). It doubles as a case study: a real Vite + React app
that installs `routini` from npm (not workspace-linked — see "Relationship to the
monorepo" below) and dogfoods the router for all of its own navigation, including
lazy routes, `<Navigate>` redirects, hash-anchor scrolling, and scroll restoration.

## Stack

- **React 19** + **Vite**
- **routini** — real npm dependency (see `package.json`), not a workspace link
- **Tailwind CSS v4** — via `@tailwindcss/vite`, no separate config file, no CSS-in-JS
- **Shiki** — build-time syntax highlighting (devDependency only, never ships to the client — see "Code snippets" below)
- **Lucide React** — icons
- **Geist Sans + Geist Mono** — via `@fontsource-variable/geist` / `geist-mono`
- **TypeScript**, **ESLint**

## Relationship to the monorepo

This app is **not** an npm workspace member — it has its own `package.json` and
`package-lock.json`, and depends on `routini` as a published package (see the
`"routini"` version in `package.json`). That's deliberate: it's meant to be a real
project consuming the real published library, not a monorepo trick. Testing a
not-yet-published library change here means bumping the dependency after a
release; for day-to-day library development, use `playground/` instead
(workspace-linked, instant iteration — see its own README).

## Commands

From this directory:

```bash
npm run dev       # start the Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview the production build locally
```

Or from the repo root: `npm run dev:website` (equivalent to `npm run dev` here,
via `--prefix examples/website`).

## Routing (dogfooded)

All routes are declared in `src/App.tsx` and are prefixed with a required `:lang`
segment (`en` or `es`):

| Route | Component | Notes |
| --- | --- | --- |
| `/` | — | `<Navigate to="/:lang">` (default lang), replace-by-default so Back doesn't bounce forward again |
| `/:lang` | `Home` | Eager (above-the-fold hero, not code-split) |
| `/:lang/docs` | `Docs` | Lazy — API reference |
| `/:lang/examples` | `Examples` | Lazy — annotated code samples |
| `/:lang/examples/sona` | `SonaCaseStudy` | Lazy — case study on the [music-player demo](../music-player) |
| `*` | `NotFound` | Lazy — catch-all 404 |

`<Router>` is configured with `scrollRestoration` (window-scoped — this app has no
nested scroll container, so `scrollContainer` isn't used) and a global `loading`
fallback; `/docs` and `/examples` override it with a layout-matching
`<PageSkeleton>` per route.

**Unknown-language guard:** `:lang` matches any single segment, so a URL like
`/xyz` resolves to the `/:lang` route rather than 404ing — a router can't
constrain a param to `en|es`. `src/components/Layout.tsx` checks
`useParams().lang` against the known `LANGS` list and renders the lazy
`NotFound` instead of `<Outlet />` when it's neither. This is consumer-side
logic, not a routini feature — one check covers `/:lang`, `/:lang/docs`,
`/:lang/examples`, and `/:lang/examples/sona`; `*` and `/` have no lang param
and pass straight through.

## Structure

```
src/
├── App.tsx              ← routes array + <Router> config
├── main.tsx              ← entry point
├── components/
│   ├── Layout.tsx        ← Nav + Outlet (or NotFound) + Footer, skip-to-content link
│   ├── Nav.tsx            ← top nav, lang switcher, theme toggle
│   ├── Footer.tsx
│   ├── LangSwitcher.tsx   ← swaps the :lang segment of the current path
│   ├── ThemeToggle.tsx    ← light/dark, CSS-only via [data-theme], no flash on load
│   ├── Logo.tsx / GithubMark.tsx
│   ├── PageSkeleton.tsx   ← layout-matching loading fallback for lazy routes
│   ├── CodeBlock.tsx      ← renders a pre-highlighted Shiki snippet by id
│   ├── Bundle.tsx / BundleChart.tsx  ← bundle-size figure + comparison chart
│   ├── BuiltIn.tsx / BuiltInVariants.tsx  ← "Built in" features showcase
│   ├── BuiltWith.tsx      ← community gallery ("Built with routini")
│   ├── Highlights.tsx
│   └── InstallCommand.tsx ← copy-to-clipboard install command
├── pages/                ← one file per route, default export (required for lazy)
│   ├── Home.tsx
│   ├── Docs.tsx
│   ├── Examples.tsx
│   ├── SonaCaseStudy.tsx
│   └── NotFound.tsx
├── lib/
│   ├── i18n.ts            ← LANGS, useLang/useT, langPath() helper
│   ├── i18n.home.ts, i18n.docs.ts, i18n.examples.ts, i18n.notFound.ts, i18n.sonaCaseStudy.ts
│   │                        ← per-page copy, loads with the page that uses it
│   ├── snippets.ts        ← source of truth for every code sample shown on the site
│   ├── meta.ts             ← BUNDLE_SIZE_KB, the one place the published gzip size is stated
│   ├── useActiveSection.ts ← scroll-driven sidebar highlighting (Docs page)
│   └── usePageTitle.ts
└── index.css
plugins/
└── highlight-snippets.ts  ← Vite plugin, runs Shiki at build time (see below)
```

## Internationalization

Two languages, `en` and `es` (`LANGS` in `src/lib/i18n.ts`), selected by the
`:lang` URL segment — there's no browser-locale detection or cookie, the URL is
the single source of truth. Copy is split by scope:

- **Global strings** (nav, footer, skip link, install-copy button) live in the
  `global` object in `i18n.ts` and ship in the initial bundle, since they're on
  every page.
- **Page-specific copy** lives in per-page modules (`i18n.home.ts`, `i18n.docs.ts`,
  etc.) and loads lazily with the page that uses it, keeping other lazy routes'
  translations out of their bundles.

`useLang()` reads `:lang` via `useParams()` and falls back to `DEFAULT_LANG`
("en") for anything not in `LANGS`. `useT()` returns the global strings for the
current language. `langPath(lang, path)` builds a path with a given language
prefix (used by `LangSwitcher` to swap languages without losing the current
page).

Code identifiers (`Router`, `Link`, `useParams`, etc.) are **never translated** —
only surrounding UI text is.

## Code snippets (build-time highlighted)

Every code sample shown on the site (landing page, Docs, Examples, the Sona case
study) lives in `src/lib/snippets.ts`, keyed by a `SnippetId`. The Vite plugin at
`plugins/highlight-snippets.ts` runs Shiki **at build time** and exposes the
highlighted HTML via a virtual module (`virtual:highlighted-snippets`) — Shiki
itself is a devDependency only and never reaches the client bundle.

`<CodeBlock id={...} caption={...} />` (`src/components/CodeBlock.tsx`) is a pure
render of the pre-highlighted HTML for a given `id` — no async, no runtime
highlighting, no Suspense; the build step is the cache. Themes are
`vitesse-light` / `vitesse-dark`, both emitted with `defaultColor: false` so CSS
variables drive light/dark and no re-highlight is needed on theme toggle.

**Adding a new snippet:**

1. Add an entry to `snippets.ts` keyed by a new `SnippetId`.
2. Render it with `<CodeBlock id={...} caption={...} />` — the caption (e.g. a
   filename like `App.tsx`) is passed in by the consuming component.
3. If the caption text needs translation, add it to the relevant `i18n.*.ts`
   module for both `en` and `es`.

Code identifiers and filenames inside snippets are never translated. Editing
`snippets.ts` triggers a full page reload in dev (wired via the plugin's
`handleHotUpdate`), since the highlighted output is baked at build/import time,
not re-computed per render.

## Design

- Dark/light theme is CSS-only (`[data-theme]` attribute), no flash on load.
- Smooth scroll with `scroll-padding-top` for hash-anchored Docs links (via
  routini's built-in hash-anchor scrolling).
- Skip-to-content link, focus rings, semantic HTML, ARIA labels.
- OG image + favicon set live in `public/`.

## Deployment

Deployed to Vercel via the CLI (not the GitHub App integration — merging to
`main` does **not** auto-deploy):

```bash
npx vercel --prod
```

from this directory. Custom domain is `routini.dev` (+ `www.routini.dev`
redirecting to the apex). `vercel.json` has an SPA rewrite
(`/(.*) → /index.html`) so direct navigation/refresh on a client-side route
doesn't hit Vercel's static 404 — required for any client-side router, including
this one.

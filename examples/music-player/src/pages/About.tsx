const ROUTINI = [
  [
    "<Router> + a routes array",
    "All routing is configured in one place (App.tsx): a typed array mapping each path to a component or a lazy import. The home feed is eager; everything else is code-split.",
  ],
  [
    "Lazy routes (code-splitting)",
    "Each page is a dynamic import(), so it ships as its own chunk. The Leaflet-powered map — the heaviest screen — only downloads when you open it, keeping the initial bundle small.",
  ],
  [
    "<Link> + preload=\"hover\"",
    "Every navigation is a <Link>. With preload=\"hover\" the target route's chunk is fetched on pointer-enter, so by the time you click it's already cached — lazy navigation feels instant.",
  ],
  [
    "<Link> + View Transitions",
    "Tapping a feed row morphs its artwork, name and date straight into the artist hero (and back). It's a shared-element transition: the same view-transition-name is set on both pages and the browser animates between them — no animation library.",
  ],
  [
    "<Outlet>",
    "AppLayout renders the matched page inside a single <Outlet>. Crucially, the audio player and navigation live OUTSIDE that Outlet, so the <audio> element is never unmounted on navigation — that's how playback keeps going as you move between pages.",
  ],
  [
    "useParams",
    "The artist (/artist/:id) and event (/event/:id) pages read the route param to look up their record from the static dataset — so each page is self-contained and deep-linkable, and back/forward just work.",
  ],
  [
    "useLocation",
    "AppLayout reads useLocation().path to drop the \"For you\" sidebar and go full-width on a couple of routes (this About page, the Activity page).",
  ],
  [
    "useSearchParams",
    "The map keeps its center and zoom in the URL (?lat&lng&z). Pan or zoom and the link updates in place (replace, so it never floods history); refresh or share it and the map opens on the exact same view. Because routini's location store is pathname-only, writing the query never remounts the map.",
  ],
  [
    "<Navigate>",
    "\"/\" redirects straight to \"/artists\". <Navigate> replaces the history entry by default specifically to avoid a back-button trap — without it, Back from the feed would bounce you into the redirect and right back out again.",
  ],
  [
    "Catch-all \"*\"",
    "Any unmatched URL renders the 404 page.",
  ],
  [
    "Error boundary",
    "Every route — six of the eight here are lazy — is wrapped in routini's built-in error boundary automatically, no setup required. A failed chunk after a bad deploy gets a fallback instead of a white screen. Not customized in this prototype (errorFallback/onError), so it's the default minimal message.",
  ],
];

const SECTIONS = [
  ["overview", "Overview"],
  ["app", "What the app does"],
  ["architecture", "How it's built"],
  ["routini", "How routini is used"],
  ["map-url", "Shareable map state"],
  ["stack", "Stack"],
  ["status", "Status"],
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 pt-12 first:pt-0">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-text-dim">{children}</div>
    </section>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18A14 14 0 0 1 12 3z" />
    </svg>
  );
}

// A faux address bar — the path dim, the live query string highlighted.
function UrlBar({ path, query }: { path: string; query: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 font-mono text-xs sm:text-sm">
      <GlobeIcon className="h-4 w-4 shrink-0 text-text-faint" />
      <span className="truncate">
        <span className="text-text-faint">{path}</span>
        <span className="text-text">{query}</span>
      </span>
    </div>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-360 px-8 pb-20 pt-16 sm:px-12 lg:pb-28 lg:pt-24">
      <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        {/* Section nav — sticky in-page anchors, like a docs sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-0 flex flex-col gap-1 py-1 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-faint">
              On this page
            </p>
            {SECTIONS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-md py-1 text-text-dim transition hover:text-text"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="max-w-3xl">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-faint">
              About this project
            </p>
            <h1 className="mt-3 text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
              Sona
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-dim">
              A music &amp; event-discovery app — find artists and shows
              happening near you, hear their music, and explore the local scene
              on a map. It's a{" "}
              <strong className="text-text">work-in-progress prototype</strong>,
              built to put <strong className="text-text">routini</strong> — a
              tiny, ~3&nbsp;KB TypeScript-first React router — through its paces
              in a realistic product rather than a toy example.
            </p>
          </header>

          <Section id="overview" title="Overview">
            <p>
              Sona is a single-page app with no backend. The dataset (artists,
              events, a shared 15-track song pool across six Creative Commons
              albums) is generated by a script and imported statically, so the
              whole thing is self-contained and deployable anywhere. The goal
              isn't to ship a music service — it's to exercise every routini
              feature inside a product that actually feels like one.
            </p>
          </Section>

          <Section id="app" title="What the app does">
            <p>
              The home feed ranks artists by distance from you ("1.7 km from
              you"), nearest first. Each artist has a page with their tracks, the
              events they'll play, and the other acts they're performing
              alongside. Events live both on an interactive map and in
              a grid. Follow an artist (the heart) and their new shows and
              releases show up in your "For you" feed. A player docked at the
              bottom keeps playing while you browse, and the whole app supports
              light and dark themes.
            </p>
          </Section>

          <Section id="architecture" title="How it's built">
            <p>
              A single layout component (<code className="text-text">AppLayout</code>)
              is the persistent shell: a top bar, an events sidebar (desktop) that
              becomes a bottom tab bar (mobile), one route{" "}
              <code className="text-text">&lt;Outlet&gt;</code>, and the player.
              Because the player sits outside the Outlet, audio survives
              navigation; its state (current track, queue, volume) lives in a
              small zustand store driving a single{" "}
              <code className="text-text">&lt;audio&gt;</code> element.
            </p>
            <p>
              Pages are self-contained — each reads what it needs from the URL
              (<code className="text-text">useParams</code>) and the static
              dataset, with no props drilled through the router. The map
              is real (Leaflet + OpenStreetMap/CARTO tiles), themed to match
              light/dark, and only loads when you open it.
            </p>
          </Section>

          <Section id="routini" title="How routini is used">
            <p>
              routini ships eight exports and a handful of features; here's each
              one Sona exercises and how:
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {ROUTINI.map(([name, how]) => (
                <li key={name} className="border-l-2 border-border pl-4">
                  <code className="text-sm font-semibold text-text">{name}</code>
                  <p className="mt-1 text-sm leading-relaxed text-text-dim">
                    {how}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              Available but not yet wired in this prototype: the imperative{" "}
              <code className="text-text">navigate()</code> — every navigation
              here goes through a <code className="text-text">&lt;Link&gt;</code>{" "}
              or a declarative <code className="text-text">&lt;Navigate&gt;</code>.
            </p>
          </Section>

          <Section id="map-url" title="Shareable map state">
            <p>
              Open the map and pan or zoom. Watch the address bar — it
              rewrites itself live:
            </p>
            <figure className="not-prose">
              <div className="space-y-2.5 rounded-xl border border-border bg-surface p-4">
                <UrlBar path="sona.app/map" query="?lat=18.41&lng=-66.06&z=11" />
                <p className="pl-1 text-xs text-text-faint">
                  zoomed out to the whole metro
                </p>
                <UrlBar path="sona.app/map" query="?lat=18.47&lng=-66.11&z=15" />
                <p className="pl-1 text-xs text-text-faint">
                  zoomed into a single venue — same page, different view
                </p>
              </div>
              <figcaption className="mt-2 text-xs text-text-faint">
                The query string (lat, lng, zoom) is written as you move the map.
              </figcaption>
            </figure>
            <p>
              Copy that link to another device, or just refresh the tab: the map
              opens on the <strong className="text-text">exact same spot and
              zoom</strong>. The URL is the single source of truth for the view —
              the same idea behind the <code className="text-text">@lat,lng,zoom</code>{" "}
              in a Google Maps link. It makes a view shareable, bookmarkable and
              refresh-safe.
            </p>
            <p>
              This uses routini's{" "}
              <code className="text-text">useSearchParams()</code> — a reactive{" "}
              <code className="text-text">[URLSearchParams, setter]</code> pair.
              The map reads it once on load to set its starting view, and on every
              move calls the setter to write <code className="text-text">lat</code>,{" "}
              <code className="text-text">lng</code> and{" "}
              <code className="text-text">z</code> back to the URL. The only
              app-specific glue is listening to Leaflet's{" "}
              <code className="text-text">moveend</code> event.
            </p>
            <p>
              The subtle part is what <em>doesn't</em> happen: routini's location
              store tracks the <strong className="text-text">pathname only</strong>,
              not the query string. So writing{" "}
              <code className="text-text">?lat&amp;lng&amp;z</code> updates the URL{" "}
              <strong className="text-text">without remounting the route</strong> —
              the Leaflet map (expensive to recreate) is never torn down as you
              pan. A router that tracked the whole URL would rebuild the map on
              every drag.
            </p>
            <p>
              <strong className="text-text">Keeping history clean.</strong> A new
              history entry per pan would bury the Back button — ten little drags,
              ten entries to step through before you leave the page. So each write
              uses <code className="text-text">replace</code> (one of routini's
              navigate options): it swaps the current URL in place instead of
              pushing a new one. Back still does the obvious thing — it leaves
              the map — while the URL always mirrors the live view. Coordinates are
              rounded to four decimals (~11 m) to keep the link tidy.
            </p>
          </Section>

          <Section id="stack" title="Stack">
            <p>
              React 19 · TypeScript · Vite · Tailwind CSS v4 · routini · zustand
              (audio store) · Radix Slider · Leaflet / react-leaflet (the
              map).
            </p>
          </Section>

          <Section id="status" title="Status">
            <p>
              Prototype, actively in progress. Done so far: the feed, artist,
              event, map, events grid, follow + a "For you" activity
              feed, this page, light/dark theming, and a responsive
              desktop↔mobile shell. Next up: music-first previews, an event-page
              pass, an in-app credits surface, a landing page, and a public deploy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://github.com/kebinbin/routini"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-text px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
              >
                routini on GitHub
              </a>
              <a
                href="https://github.com/kebinbin/routini/tree/main/examples/music-player"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-dim transition hover:text-text"
              >
                This demo's source
              </a>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

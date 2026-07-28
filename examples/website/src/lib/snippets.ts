/**
 * Code snippets shown on the landing page and (soon) the docs page.
 *
 * These are intentionally **not** translated — code identifiers (Router, Link,
 * useParams, etc.) stay in English in every language. Only the surrounding
 * UI text (captions, intros, etc.) is translated via i18n.ts.
 *
 * Each entry is highlighted at build time by `plugins/highlight-snippets.ts`
 * and exposed via the `virtual:highlighted-snippets` module. The runtime
 * `<CodeBlock>` component reads the pre-rendered HTML from that virtual
 * module — Shiki never ships to the client.
 *
 * When you add a snippet:
 * 1. Add an entry here keyed by `SnippetId`
 * 2. Render it via `<CodeBlock id={...} caption={...} />`. Captions are passed
 *    in by the consuming component (e.g. a filename like `App.tsx`); code
 *    identifiers and filenames are not translated.
 */
export const snippets = {
  setup: `import { Router } from "routini";
import Home from "./Home";

const routes = [
  { path: "/", component: Home },
  { path: "/products/:id", lazy: () => import("./Product") },
  { path: "*", lazy: () => import("./NotFound") },
];

export default function App() {
  return <Router routes={routes} />;
}
`,

  routeChildren: `import { Router, Route } from "routini";

// JSX form — same routing, declarative.
// Best for eager component routes.
export default function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}
`,

  lazyRoutes: `// In the routes array.
// routini handles React.lazy + Suspense for you.
{
  path: "/products/:id",
  lazy: () => import("./Product"),
}
`,

  typedParams: `import { useParams } from "routini";

function Product() {
  const { id } = useParams<{ id: string }>();
  return <h1>Product {id}</h1>;
}
`,

  navigateFromCode: `import { navigate } from "routini";

function LogoutButton() {
  return (
    <button onClick={() => navigate("/login")}>
      Log out
    </button>
  );
}
`,

  currentPath: `import { useLocation } from "routini";

function Breadcrumb() {
  const { path } = useLocation();
  return <span>You are at {path}</span>;
}
`,

  apiSurface: `// Nine exports. That's the entire API.
import {
  Router, Route, Link, Outlet, Navigate,
  useLocation, useParams, useSearchParams,
  navigate,
} from "routini";
`,

  dataLayer: `import { useParams } from "routini";
import useSWR from "swr";

const fetcher = (u) => fetch(u).then(r => r.json());

function Product() {
  const { id } = useParams();      // routini → the URL
  const { data } = useSWR(         // you → the data
    \`/api/products/\${id}\`, fetcher);

  return <h1>{data?.name}</h1>;
}
`,

  linkUsage: `import { Link } from "routini";

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/docs#api">API</Link>
    </nav>
  );
}
`,

  outletLayout: `import { Router, Outlet } from "routini";

export default function App() {
  return (
    <Router routes={routes}>
      <Header />
      <Outlet />
      <Footer />
    </Router>
  );
}
`,

  navigateRedirect: `import { Navigate } from "routini";

const routes = [
  { path: "/", component: () => <Navigate to="/home" /> },
  { path: "/home", component: Home },
];
`,

  codeSplit: `import { Router } from "routini";
import Home from "./Home";

// Home is eager (above the fold); everything else is
// code-split and only fetched when its route matches.
const routes = [
  { path: "/", component: Home },
  {
    path: "/dashboard",
    lazy: () => import("./Dashboard"),
    loading: <Skeleton />, // per-route fallback
  },
  { path: "*", lazy: () => import("./NotFound") },
];

export default () => <Router routes={routes} />;
`,

  activeNav: `import { Router, Outlet, Link, useLocation } from "routini";

function NavLink({ to, children }) {
  const { path } = useLocation();
  const active = path === to;
  return (
    <Link to={to} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <Router routes={routes}>
      <header>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
      </header>
      <Outlet />
    </Router>
  );
}
`,

  redirects404: `import { Navigate } from "routini";
import Home from "./Home";

const routes = [
  // Send "/" to the real landing page.
  { path: "/", component: () => <Navigate to="/home" /> },
  { path: "/home", component: Home },
  // Anything unmatched falls through to the 404.
  { path: "*", lazy: () => import("./NotFound") },
];
`,

  viewTransitions: `import { Link, navigate } from "routini";

// Opt in per navigation — the browser animates between
// the old and new page. Unsupported browsers navigate
// instantly. Give an element a view-transition-name in
// CSS (or inline) to morph it across pages.
function AlbumCard({ album }) {
  return (
    <Link to={\`/album/\${album.id}\`} viewTransition>
      <img
        src={album.cover}
        style={{ viewTransitionName: "cover" }}
      />
    </Link>
  );
}

// Or from code:
navigate("/album/9", { viewTransition: true });
`,

  sharedElement: `import { Link } from "routini";

// Same view-transition-name on the element on BOTH pages, then navigate with
// viewTransition — the browser morphs one into the other. Names must be UNIQUE
// per item (two elements can't share a name on one page), so key them by id.

// List page
function ProductCard({ product }) {
  return (
    <Link to={\`/product/\${product.id}\`} viewTransition>
      <img
        src={product.cover}
        style={{
          viewTransitionName: \`cover-\${product.id}\`,
          viewTransitionClass: "cover", // shared hook for styling
        }}
      />
    </Link>
  );
}

// Detail page — same name + class on the matching element
function Product({ product }) {
  return (
    <img
      src={product.cover}
      style={{
        viewTransitionName: \`cover-\${product.id}\`,
        viewTransitionClass: "cover",
      }}
    />
  );
}

// Style the whole family by class — no per-id rules:
//   ::view-transition-group(.cover) { animation-duration: 300ms }
// (Or ::view-transition-group(*) to target every transition, for wider support.)
`,

  preload: `import { Link } from "routini";

// Warm a lazy route's code-split chunk before the click, so
// the page is ready instantly — and View Transitions land on
// the real page, not the loading fallback. No-op for eager routes.
function Nav() {
  return (
    <nav>
      {/* on hover / keyboard focus — the user signalled intent */}
      <Link to="/dashboard" preload="hover">Dashboard</Link>

      {/* on mount, in an idle callback — the route almost
          everyone visits next */}
      <Link to="/album/9" preload="render">Featured album</Link>

      {/* when it scrolls into view — links far down a long page.
          All viewport links share one IntersectionObserver. */}
      <Link to="/album/42" preload="viewport">Deep cut</Link>
    </nav>
  );
}
`,

  errorHandling: `import { Router } from "routini";

// A failed lazy chunk or a render error shows this instead
// of white-screening the app. Pass nothing for a minimal
// default; pass a function for full control.
export default function App() {
  return (
    <Router
      routes={routes}
      onError={(error) => report(error)}
      errorFallback={({ error, reset, reload, isChunkError }) =>
        isChunkError ? (
          // Stale chunk after a deploy — a fresh document fixes it.
          <button onClick={reload}>Reload</button>
        ) : (
          // A render error — retry in place, keep app state.
          <button onClick={reset}>Try again — {error.message}</button>
        )
      }
    />
  );
}
`,

  searchParams: `import { useSearchParams } from "routini";

// Search state that lives in the URL — shareable, bookmarkable,
// and Back/Forward steps through each query. Reads re-render on
// every query change; the route itself never remounts.
function ProductSearch() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "newest";

  return (
    <>
      <input
        value={q}
        // push a new entry as the user types
        onChange={(e) => setParams({ q: e.target.value, sort })}
      />

      <select
        value={sort}
        // replace, so changing the sort doesn't flood history
        onChange={(e) => setParams({ q, sort: e.target.value }, { replace: true })}
      >
        <option value="newest">Newest</option>
        <option value="price">Price</option>
      </select>

      <Results query={q} sort={sort} />
    </>
  );
}
`,

  scrollRestoration: `import { Router } from "routini";

// Scrolls to top on a forward nav, restores the previous
// offset on back/forward. Off by default.
<Router routes={routes} scrollRestoration />

// Scrolling a nested container instead of the window?
// Point it at the element.
const mainRef = useRef<HTMLElement>(null);

<Router routes={routes} scrollRestoration scrollContainer={mainRef} />
<main ref={mainRef}>
  <Outlet />
</main>
`,

  overview: `import { Router, Link, useParams, navigate } from "routini";
import Home from "./pages/Home";

// One routes array: an eager landing page, lazy (code-split) pages,
// a URL param, and a catch-all 404.
const routes = [
  { path: "/", component: Home },
  { path: "/products/:id", lazy: () => import("./pages/Product") },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

export default function App() {
  return <Router routes={routes} />;
}

// Pages are self-contained — read the matched URL, link, or navigate.
function Product() {
  const { id } = useParams<{ id: string }>();

  return (
    <article>
      <h1>Product {id}</h1>

      {/* preload warms the chunk on hover; viewTransition animates it */}
      <Link to="/products/42" preload="hover" viewTransition>
        Next product
      </Link>

      <button onClick={() => navigate("/")}>Done</button>
    </article>
  );
}
`,

  // ── Sona case study (examples/sona) — all six are real excerpts from
  // examples/music-player, trimmed for length. Not contrived examples.
  sonaRoutes: `const routes: RouteDefinition[] = [
  { path: "/", component: RootRedirect },
  { path: "/artists", component: Feed },
  { path: "/events", lazy: () => import("./pages/Events") },
  { path: "/map", lazy: () => import("./pages/Map") },
  { path: "/activity", lazy: () => import("./pages/Activity") },
  { path: "/about", lazy: () => import("./pages/About") },
  { path: "/artist/:id", lazy: () => import("./pages/Artist") },
  { path: "/event/:id", lazy: () => import("./pages/Event") },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

export default function App() {
  return (
    <Router routes={routes} loading={<div>Loading…</div>}>
      <AppLayout />
    </Router>
  );
}
`,

  sonaLayout: `export function AppLayout() {
  const { path } = useLocation();
  const fullWidth = path === "/about" || path === "/activity";

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <TopBar />
      <div className={fullWidth ? "" : "grid lg:grid-cols-[340px_1fr]"}>
        {!fullWidth && <Sidebar />}
        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {/* Outside the Outlet, so this never unmounts on navigation — that's
          how playback keeps going as you move between pages. */}
      <footer>
        <Player />
        <BottomNav />
      </footer>
    </div>
  );
}
`,

  sonaPreloadVt: `<li className="group relative ...">
  <Link
    to={\`/artist/\${a.id}\`}
    preload="hover"
    viewTransition
    aria-label={a.name}
    className="absolute inset-0"
  />
  {/* ...row content... */}
</li>
`,

  sonaParams: `export default function Artist() {
  const { id } = useParams<{ id: string }>();
  const artist = id ? getArtist(id) : undefined;

  if (!artist) {
    return <div>Artist not found.</div>;
  }
  // ...self-contained from here: everything the page needs
  // came from the URL and the static dataset.
}
`,

  sonaSearchParams: `// Writes the live center+zoom back to the URL on every move. \`replace\`
// keeps panning out of the history stack; the pathname-only store means
// this never remounts the map.
function ViewSync() {
  const [, setParams] = useSearchParams();
  const write = (map: L.Map) => {
    const c = map.getCenter();
    setParams(
      { lat: c.lat.toFixed(4), lng: c.lng.toFixed(4), z: String(map.getZoom()) },
      { replace: true },
    );
  };
  const map = useMapEvents({ moveend: () => write(map) });
  return null;
}
`,

  sonaRedirect: `function RootRedirect() {
  // <Navigate> replaces by default, so Back doesn't bounce off "/"
  // into a redirect loop.
  return <Navigate to="/artists" />;
}

const routes: RouteDefinition[] = [
  { path: "/", component: RootRedirect },
  // ...
];
`,

  sonaScrollRestoration: `// App.tsx — AppLayout scrolls its own <main>, not the window,
// so Router needs a ref to that element instead of the default.
const mainRef = useRef<HTMLElement>(null);

<Router routes={routes} scrollRestoration scrollContainer={mainRef}>
  <AppLayout mainRef={mainRef} />
</Router>

// AppLayout.tsx — the ref lands on the element Router should restore.
<main ref={mainRef} className="overflow-y-auto">
  <Outlet />
</main>
`,

  sonaErrorFallback: `function RouteErrorFallback({
  error,
  reset,
  reload,
  isChunkError,
}: ErrorFallbackContext) {
  return (
    <div role="alert">
      <p>
        {isChunkError
          ? "This page failed to load, likely from a new deploy."
          : "Something went wrong loading this page."}
      </p>
      <p>{error.message}</p>
      {/* A stale chunk only clears on a fresh document; a render error
          can retry in place, keeping playback and app state alive. */}
      <button onClick={isChunkError ? reload : reset}>
        {isChunkError ? "Reload" : "Try again"}
      </button>
      <Link to="/" viewTransition>Back to discover</Link>
    </div>
  );
}

<Router routes={routes} errorFallback={RouteErrorFallback}>
`,

} as const;

export type SnippetId = keyof typeof snippets;

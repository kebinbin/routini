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

  apiSurface: `// Seven exports. That's the entire API.
import {
  Router, Route, Link, Outlet,
  Navigate, useLocation, useParams,
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
} as const;

export type SnippetId = keyof typeof snippets;

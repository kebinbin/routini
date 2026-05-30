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
} as const;

export type SnippetId = keyof typeof snippets;

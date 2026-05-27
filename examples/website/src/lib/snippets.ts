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
 * 2. Add the matching caption to `i18n.ts` under `quickStart.captions`
 *    (both `en` and `es`)
 * 3. If it should appear in the Quick Start tab list, add the id to
 *    `QUICK_START_ORDER` in `components/QuickStart.tsx`
 */
export const snippets = {
  setup: `import { Router, Link } from "routini";

// Routes outside the component so the lazy() cache
// keeps a stable identity between renders.
const routes = [
  { path: "/", component: Home },
  { path: "/products/:id", lazy: () => import("./Product") },
  { path: "*", lazy: () => import("./NotFound") },
];

export default function App() {
  return <Router routes={routes} />;
}

function Home() {
  return (
    <main>
      <h1>Welcome</h1>
      <Link to="/products/42">View product 42</Link>
    </main>
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
} as const;

export type SnippetId = keyof typeof snippets;

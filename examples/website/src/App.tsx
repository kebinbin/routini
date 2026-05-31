import { Navigate, Router, type RouteDefinition } from "routini";
import { Layout } from "./components/Layout";
import { Logo } from "./components/Logo";
import { DocsSkeleton } from "./components/DocsSkeleton";
import { DEFAULT_LANG } from "./lib/i18n";
import Home from "./pages/Home";

// Home is eager (above-the-fold hero); the rest are lazy + code-split.
// Docs gets a layout-matching skeleton via its per-route `loading`; the others
// fall back to Router's global `loading`.
const routes: RouteDefinition[] = [
  { path: "/", component: () => <Navigate to={`/${DEFAULT_LANG}`} /> },
  { path: "/:lang", component: Home },
  {
    path: "/:lang/docs",
    lazy: () => import("./pages/Docs"),
    loading: <DocsSkeleton />,
  },
  { path: "/:lang/examples", lazy: () => import("./pages/Examples") },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

export default function App() {
  return (
    <Router routes={routes} loading={<PageLoading />}>
      <Layout />
    </Router>
  );
}

function PageLoading() {
  return (
    <div className="loader-reveal flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <Logo className="h-7 w-auto animate-pulse text-bone-dim motion-reduce:animate-none" />
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
        loading
      </span>
    </div>
  );
}

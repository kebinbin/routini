import { Navigate, Router, type RouteDefinition } from "routini";
import { Layout } from "./components/Layout";
import { DEFAULT_LANG } from "./lib/i18n";
import Home from "./pages/Home";

// Home is eager (above-the-fold hero); the rest are lazy + code-split.
const routes: RouteDefinition[] = [
  { path: "/", component: () => <Navigate to={`/${DEFAULT_LANG}`} /> },
  { path: "/:lang", component: Home },
  { path: "/:lang/docs", lazy: () => import("./pages/Docs") },
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
    <div className="mx-auto max-w-7xl px-6 py-24 font-mono text-sm text-bone-faint">
      loading…
    </div>
  );
}

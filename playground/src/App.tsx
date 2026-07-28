import {
  Route,
  Router,
  type ErrorFallbackContext,
  type RouteDefinition,
} from "routini";
import { AppLayout } from "./layout/AppLayout";
import Home from "./pages/Home";
import Eager from "./pages/Eager";
import { markLoaded } from "./lib/chunkLog";

// Artificial delay so lazy loading fallbacks are actually visible in the UI —
// a real app wouldn't do this. Wraps a dynamic import in a timed promise.
const slowImport = <T,>(factory: () => Promise<T>, ms = 700) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(factory()), ms));

// Same as slowImport, but also records the resolution in chunkLog so the
// Preload demo can show a live "loaded" indicator per preload mode.
const trackedImport = <T,>(key: string, factory: () => Promise<T>, ms = 700) =>
  slowImport(factory, ms).then((mod) => {
    markLoaded(key);
    return mod;
  });

// One reference shared by all three /params routes below — routini's lazy
// cache is keyed by function identity, so separate closures would each
// suspend on first visit despite importing the same file.
const paramsLazy = () => import("./pages/Params");

// Most routes live in this array (the recommended form). One route below is
// declared as a <Route> JSX child instead, to exercise the other input form —
// Router concatenates array routes + <Route> children.
const routes: RouteDefinition[] = [
  { path: "/", component: Home },
  { path: "/eager", component: Eager },
  {
    path: "/lazy",
    lazy: () => slowImport(() => import("./pages/LazyDemo")),
    // Per-route loading — overrides the Router's global `loading` below.
    loading: <div className="loading-box">Loading the lazy route’s chunk…</div>,
  },
  { path: "/params", lazy: paramsLazy },
  { path: "/params/:userId", lazy: paramsLazy },
  { path: "/params/:userId/:postId", lazy: paramsLazy },
  { path: "/search", lazy: () => import("./pages/SearchParams") },
  { path: "/navigate", lazy: () => import("./pages/NavigateDemo") },
  // Redirect target — <Navigate> sends visitors from here to /navigate.
  { path: "/redirect-me", lazy: () => import("./pages/RedirectMe") },
  { path: "/transitions/a", lazy: () => import("./pages/TransitionA") },
  { path: "/transitions/b", lazy: () => import("./pages/TransitionB") },
  { path: "/preload", lazy: () => import("./pages/Preload") },
  {
    path: "/preload/target-hover",
    lazy: () => trackedImport("hover", () => import("./pages/PreloadTarget")),
  },
  {
    path: "/preload/target-render",
    lazy: () => trackedImport("render", () => import("./pages/PreloadTarget")),
  },
  {
    path: "/preload/target-viewport",
    lazy: () =>
      trackedImport("viewport", () => import("./pages/PreloadTarget")),
  },
  { path: "/error", lazy: () => import("./pages/ErrorDemo") },
  // A lazy import that always rejects — routini tags it as a chunk error, so
  // the fallback's isChunkError is `true` here (vs `false` for /error's render
  // throw). Simulates a stale chunk after a deploy.
  {
    path: "/error-chunk",
    lazy: () =>
      Promise.reject(new Error("Simulated failed chunk load (stale deploy)")),
  },
  { path: "/hash", lazy: () => import("./pages/Hash") },
  { path: "/scroll", lazy: () => import("./pages/ScrollDemo") },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

// Function errorFallback — receives the full context (error + recovery helpers).
// Applies to every route; the /error page throws on demand to trigger it.
function errorFallback({
  error,
  reset,
  reload,
  isChunkError,
}: ErrorFallbackContext) {
  return (
    <div className="content">
      <h1 className="page-title" style={{ color: "var(--danger)" }}>
        Something threw
      </h1>
      <p className="page-intro">
        This is a custom function <code>errorFallback</code> on{" "}
        <code>&lt;Router&gt;</code>.
      </p>
      <div className="readout" style={{ marginBottom: "1rem" }}>
        {error.message}
        {"\n"}isChunkError: {String(isChunkError)}
      </div>
      <div className="row">
        <button className="primary" onClick={reset}>
          reset() — retry in place
        </button>
        <button onClick={reload}>reload() — hard refresh</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router
      routes={routes}
      loading={<div className="loading-box">Loading…</div>}
      errorFallback={errorFallback}
      scrollRestoration
      onError={(error, info) =>
        // Logging/telemetry hook — check the console when /error throws.
        console.error("[routini onError]", error.message, info.componentStack)
      }
    >
      {/* JSX-child route form, concatenated with the routes array above. */}
      <Route path="/jsx-route" lazy={() => import("./pages/JsxRoute")} />
      <AppLayout />
    </Router>
  );
}

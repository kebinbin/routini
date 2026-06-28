import { Navigate, Router, type RouteDefinition } from "routini";
import { AppLayout } from "./components/AppLayout";
import Feed from "./pages/Feed";

// Root redirects to the first discovery lens. <Navigate> replaces by default, so
// Back doesn't bounce off "/" into a redirect loop.
function RootRedirect() {
  return <Navigate to="/artists" />;
}

const routes: RouteDefinition[] = [
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
    <Router
      routes={routes}
      loading={<div className="p-6 text-sm text-text-faint">Loading…</div>}
    >
      <AppLayout />
    </Router>
  );
}

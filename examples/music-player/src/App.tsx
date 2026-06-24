import { Router, type RouteDefinition } from "routini";
import { AppLayout } from "./components/AppLayout";
import Feed from "./pages/Feed";

const routes: RouteDefinition[] = [
  { path: "/", component: Feed },
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

import { Router, type RouteDefinition } from "routini";
import { AppLayout } from "./components/AppLayout";
import Feed from "./pages/Feed";

// Shared import so /notifications and /notifications/:id resolve to the SAME
// lazy component — routini keeps the instance across the two routes (no
// remount), and useParams just drives whether a notification is open.
const notifications = () => import("./pages/Notifications");

const routes: RouteDefinition[] = [
  { path: "/", component: Feed },
  { path: "/events", lazy: () => import("./pages/Events") },
  { path: "/explore", lazy: () => import("./pages/Explore") },
  { path: "/about", lazy: () => import("./pages/About") },
  { path: "/notifications", lazy: notifications },
  { path: "/notifications/:id", lazy: notifications },
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

import { Link, Outlet, useLocation } from "routini";

// Nav links live here. Each demo page maps to one entry.
const LINKS: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/eager", label: "Eager route" },
  { to: "/lazy", label: "Lazy + loading" },
  { to: "/params", label: "useParams" },
  { to: "/search", label: "useSearchParams" },
  { to: "/navigate", label: "navigate + Navigate" },
  { to: "/transitions/a", label: "View Transitions" },
  { to: "/preload", label: "Link preload" },
  { to: "/error", label: "Error boundary" },
  { to: "/hash", label: "Hash anchors" },
  { to: "/scroll", label: "Scroll restoration" },
  { to: "/jsx-route", label: "JSX <Route>" },
  { to: "/nope", label: "Catch-all (404)" },
];

// Active-link styling hand-rolled on top of useLocation() — routini has no
// built-in active-link helper yet, so this is the canonical pattern: compare
// the reactive current path to the link target and set aria-current.
function NavLink({ to, label }: { to: string; label: string }) {
  const { path } = useLocation();
  const active = to === "/" ? path === "/" : path.startsWith(to);
  return (
    <Link to={to} aria-current={active ? "page" : undefined}>
      {label}
    </Link>
  );
}

export function AppLayout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>routini playground</h1>
        <p>Every feature, one minimal app.</p>
        <nav>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} label={l.label} />
          ))}
        </nav>
      </aside>
      {/* The matched route renders here. */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

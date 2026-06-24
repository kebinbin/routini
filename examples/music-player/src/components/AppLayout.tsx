import { Link, Outlet } from "routini";
import { Player } from "../player/Player";
import { events } from "../lib/data";

// Equalizer-bars logo (from the design), recolorable via currentColor.
function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 25" fill="currentColor" className={className} role="img" aria-label="Sona">
      <rect y="18" width="2" height="7" />
      <rect x="6" width="2" height="25" />
      <rect x="12" y="8" width="2" height="17" />
      <rect x="18" y="16" width="2" height="9" />
      <rect x="24" y="12" width="2" height="13" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

// Bottom-bar icons (mobile only).
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

// Generic placeholder avatar (no real user photo) in a circle.
function Avatar({ className }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-surface-3 text-text-dim ${className ?? ""}`}
      role="img"
      aria-label="Account"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3/5 w-3/5" aria-hidden>
        <circle cx="12" cy="9" r="4" />
        <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6v1H4v-1Z" />
      </svg>
    </span>
  );
}

function TopBar() {
  return (
    <header className="flex items-center gap-4 px-2 py-1">
      <Link to="/" viewTransition aria-label="Sona home" className="shrink-0 px-1 text-text">
        <Logo className="h-5 w-auto" />
      </Link>
      {/* On mobile (no nav actions) the search fills out to the right edge;
          on desktop it's centered and capped. */}
      <div className="flex w-full items-center gap-2.5 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm lg:mx-auto lg:max-w-md">
        <SearchIcon className="h-4 w-4 shrink-0 text-text-faint" />
        <input
          type="search"
          placeholder="Where are you heading to?"
          className="w-full bg-transparent text-text placeholder:text-text-faint focus:outline-none"
        />
      </div>
      {/* Secondary actions live in the bottom bar on mobile; the top bar keeps
          just the logo + search there. */}
      <nav className="hidden shrink-0 items-center gap-3 text-sm lg:flex">
        <button className="rounded-full bg-text px-4 py-1.5 font-medium text-bg transition hover:opacity-90">
          Explore near you
        </button>
        <a href="#" className="text-text-dim transition hover:text-text">
          About this project
        </a>
        <Avatar className="h-8 w-8" />
      </nav>
    </header>
  );
}

// Events panel — the desktop left column. On mobile it's replaced by the
// "Events" item in the bottom bar, so it's hidden below lg.
function Sidebar() {
  return (
    <aside
      className="hidden min-h-0 flex-col rounded-xl bg-surface lg:flex"
      style={{ viewTransitionName: "sona-sidebar" }}
    >
      <div className="px-4 pt-4">
        <p className="text-base font-semibold text-text">Events for you</p>
        <div className="mt-3 flex items-center justify-between text-text-faint">
          <button className="grid h-7 w-7 place-items-center rounded-md transition hover:bg-surface-2 hover:text-text" aria-label="Search events">
            <SearchIcon className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 text-xs transition hover:text-text">
            <FilterIcon className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
      </div>
      <ul className="mt-2 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              to={`/event/${e.id}`}
              preload="hover"
              viewTransition
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-surface-2"
            >
              <img
                src={e.poster}
                alt=""
                className="h-20 w-14 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{e.title}</p>
                <p className="mt-0.5 truncate text-xs text-text-faint">
                  {e.date} @ {e.venue}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Persistent mobile bottom bar (hidden at lg, where the top bar + events
// sidebar take over). "Events" stands in for the desktop sidebar; the user
// sits at the right.
const BOTTOM_NAV = [
  { Icon: CalendarIcon, label: "Events" },
  { Icon: CompassIcon, label: "Explore" },
  { Icon: InfoIcon, label: "About" },
];

function BottomNav() {
  return (
    <nav className="flex items-center justify-around px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      {BOTTOM_NAV.map(({ Icon, label }) => (
        <button
          key={label}
          className="flex flex-1 flex-col items-center gap-1 py-1 text-text-faint transition hover:text-text"
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
      <button className="flex flex-1 flex-col items-center gap-1 py-1 text-text-faint transition hover:text-text">
        <Avatar className="h-6 w-6" />
        <span className="text-[10px] font-medium">Account</span>
      </button>
    </nav>
  );
}

export function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] bg-bg">
      <div className="px-2.5 pt-2.5" style={{ viewTransitionName: "sona-topbar" }}>
        <TopBar />
      </div>
      <div className="grid min-h-0 gap-2.5 px-2.5 py-2.5 lg:grid-cols-[300px_1fr]">
        <Sidebar />
        <main className="min-h-0 overflow-y-auto rounded-xl bg-surface">
          <Outlet />
        </main>
      </div>
      <footer className="bg-surface" style={{ viewTransitionName: "sona-player" }}>
        <Player />
        <BottomNav />
      </footer>
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "routini";
import { Player } from "../player/Player";
import { setTheme, useTheme } from "../lib/theme";
import { ActivityFeed, SortIcon } from "./ActivityFeed";
import { useUnseenCount } from "../lib/seen";

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

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
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

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Avatar that opens a dropdown with the theme switch. `variant` sets the trigger
// and which way the menu opens (top bar opens downward, bottom bar upward).
function UserMenu({ variant }: { variant: "topbar" | "bottom" }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`relative ${variant === "bottom" ? "flex-1" : ""}`} ref={ref}>
      {variant === "topbar" ? (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Account"
          aria-haspopup="menu"
          aria-expanded={open}
          className="block rounded-full"
        >
          <Avatar className="h-8 w-8 ring-1 ring-border" />
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Account"
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex w-full flex-col items-center gap-1 py-1 text-text-faint transition hover:text-text"
        >
          <Avatar className="h-6 w-6" />
          <span className="text-[10px] font-medium">Account</span>
        </button>
      )}
      {open && (
        <div
          role="menu"
          className={`absolute right-0 z-50 w-48 rounded-xl border border-border bg-surface p-1 shadow-xl ${
            variant === "bottom" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <p className="px-3 pt-1.5 pb-1 text-xs font-medium text-text-faint">
            Appearance
          </p>
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              role="menuitemradio"
              aria-checked={theme === t}
              onClick={() => setTheme(t)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm capitalize text-text transition hover:bg-surface-2"
            >
              {t === "light" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
              {t}
              {theme === t && <CheckIcon className="ml-auto h-4 w-4 text-text-dim" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar() {
  const activityCount = useUnseenCount();
  return (
    <header className="flex items-center gap-4 px-2 py-3">
      <Link to="/" viewTransition aria-label="Sona home" className="shrink-0 rounded-md px-1 text-text">
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
      <nav className="hidden shrink-0 items-center gap-7 text-sm lg:flex">
        {/* "Explore near you" — kept for layout; its real behavior isn't built
            yet. INTENDED: on click, read the device location via
            navigator.geolocation, store it as the shared search center, and have
            all three lenses (Artists / Events / Map) do a radius search around
            it. We can't compute the device location yet, so for now it just
            links to the Map lens. (Switching lenses lives in DiscoveryTabs.) */}
        <Link
          to="/map"
          preload="hover"
          className="rounded-full bg-text px-4 py-1.5 font-medium text-bg transition hover:opacity-90"
        >
          Explore near you
        </Link>
        <Link
          to="/about"
          preload="hover"
          className="rounded-md text-text-dim transition hover:text-text"
        >
          About this project
        </Link>
        <Link
          to="/activity"
          preload="hover"
          aria-label={`For you, ${activityCount} updates`}
          className="relative rounded-md text-text-dim transition hover:text-text"
        >
          <BellIcon className="h-5 w-5" />
          {activityCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 text-[10px] font-bold leading-none text-bg ring-2 ring-bg">
              {activityCount}
            </span>
          )}
        </Link>
        <UserMenu variant="topbar" />
      </nav>
    </header>
  );
}

// "For you" panel — the desktop left column: activity (new shows + releases)
// from the artists you follow. On mobile it's the bell → /activity instead, so
// it's hidden below lg.
function Sidebar() {
  return (
    <aside
      className="hidden min-h-0 flex-col rounded-xl bg-surface lg:flex"
      style={{ viewTransitionName: "sona-sidebar" }}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-base font-semibold text-text">For you</p>
        <div className="flex items-center gap-1.5 text-text-faint">
          <button
            type="button"
            aria-label="Sort activity"
            className="grid h-7 w-7 place-items-center rounded-md transition hover:bg-surface-2 hover:text-text"
          >
            <SortIcon className="h-4 w-4" />
          </button>
          <Link
            to="/activity"
            preload="hover"
            className="rounded-md text-xs transition hover:text-text"
          >
            See all
          </Link>
        </div>
      </div>
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        <ActivityFeed />
      </div>
    </aside>
  );
}

// Persistent mobile bottom bar (hidden at lg, where the top bar + events
// sidebar take over). "Events" stands in for the desktop sidebar; the user
// sits at the right.
const BOTTOM_NAV = [
  { Icon: CalendarIcon, label: "Events", to: "/events" },
  { Icon: CompassIcon, label: "Map", to: "/map" },
  { Icon: BellIcon, label: "For you", to: "/activity" },
  { Icon: InfoIcon, label: "About", to: "/about" },
];

function BottomNav() {
  const activityCount = useUnseenCount();
  return (
    <nav className="flex items-center justify-around px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      {BOTTOM_NAV.map(({ Icon, label, to }) => (
        <Link
          key={label}
          to={to}
          preload="hover"
          className="flex flex-1 flex-col items-center gap-1 rounded-md py-1 text-text-faint transition hover:text-text"
        >
          <span className="relative">
            <Icon className="h-5 w-5" />
            {to === "/activity" && activityCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 text-[10px] font-bold leading-none text-bg ring-2 ring-bg">
                {activityCount}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
      <UserMenu variant="bottom" />
    </nav>
  );
}

export function AppLayout() {
  // Read the path so a page can opt out of the "For you" sidebar and take the
  // full width (About has its own section nav; Activity is the full-page feed).
  const { path } = useLocation();
  // About/Activity have their own full-width layouts; the discovery lenses
  // (Artists, Events, Map) all keep the "For you" sidebar.
  const fullWidth = path === "/about" || path === "/activity";

  // routini leaves scroll handling to the app (out of scope), and our scroll
  // container is <main>, not the window — so a client-side navigation keeps the
  // previous scroll offset. Reset <main> to the top on each pathname change;
  // skip it when there's a hash so anchor links (e.g. About's section nav) still
  // scroll to their target.
  const mainRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!window.location.hash) mainRef.current?.scrollTo({ top: 0 });
  }, [path]);

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] bg-bg">
      <div className="relative z-30 px-2.5 pt-2.5" style={{ viewTransitionName: "sona-topbar" }}>
        <TopBar />
      </div>
      <div
        className={`grid min-h-0 gap-2.5 px-2.5 py-2.5 ${
          fullWidth ? "" : "lg:grid-cols-[340px_1fr]"
        }`}
      >
        {!fullWidth && <Sidebar />}
        <main ref={mainRef} className="min-h-0 overflow-y-auto rounded-xl bg-surface">
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

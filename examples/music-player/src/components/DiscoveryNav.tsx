import type { ReactNode } from "react";
import { Link, useLocation } from "routini";

// The three lenses on the same "near you" dataset. Plain route links styled as a
// segmented control (same look as the feed's view switcher), with the active one
// filled. Lives in the page content, not the top nav.
const LENSES = [
  ["/artists", "Artists"],
  ["/events", "Events"],
  ["/map", "Map"],
] as const;

export function DiscoveryTabs() {
  const { path } = useLocation();
  return (
    <div className="inline-flex shrink-0 rounded-full border border-border p-0.5 text-xs">
      {LENSES.map(([to, label]) => {
        const active = path === to;
        return (
          <Link
            key={to}
            to={to}
            preload="hover"
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 font-medium transition ${
              active ? "bg-text text-bg" : "text-text-dim hover:text-text"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Location context for the discovery views. Static (San Juan) for now; becomes
// dynamic once "Explore near you" geolocation + the search-bar city picker land.
export function LocationLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-dim">
      <PinIcon className="h-4 w-4 text-text-faint" />
      San Juan, PR
    </span>
  );
}

// Shared sticky header for the Artists / Events list pages. The lens switcher
// sits on the left (its own row); the page `title` and any per-page control
// (`right`, e.g. the Artists view switcher) share the row below.
export function DiscoveryHeader({
  title,
  right,
}: {
  title?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 bg-surface px-4 pt-5 pb-3 sm:px-6 lg:px-8">
      {title && (
        <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
          {title}
        </h1>
      )}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 ${
          title ? "mt-3" : ""
        }`}
      >
        <DiscoveryTabs />
        {right}
      </div>
    </div>
  );
}

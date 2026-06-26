import { ActivityFeed, SortIcon } from "../components/ActivityFeed";

// Full-page "For you" — the same feed the desktop sidebar shows, but as a route
// (so the mobile bell/tab has somewhere to go).
export default function Activity() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 lg:pt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            For you
          </h1>
          <p className="mt-2 text-sm text-text-faint">
            New shows and releases from the artists you follow.
          </p>
        </div>
        {/* Sort control — recency now, "closest to you" etc. coming later. */}
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm text-text-dim transition hover:text-text"
        >
          <SortIcon className="h-4 w-4" />
          Sort
        </button>
      </div>
      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  );
}

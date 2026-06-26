import { Link } from "routini";
import { activitiesFor, type Activity } from "../lib/activity";
import { useFollowStore } from "../lib/follow";

// Sort/filter affordance for the activity headers (sort by recency/closeness is
// a later feature — this is the control it'll hang off).
export function SortIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

// One activity row: always the artist's circle + a line of text + a timestamp.
// Deliberately a plain Link (no view-transition-name) — the circle avatar can't
// cleanly morph into the horizontal artist hero, so we keep the shared-element
// transition exclusive to the feed's cover → hero.
function ActivityRow({ activity }: { activity: Activity }) {
  const isShow = activity.kind === "show";
  const to = isShow
    ? `/event/${activity.event.id}`
    : `/artist/${activity.artist.id}`;
  const line = isShow
    ? `New show · ${activity.event.title}`
    : `New single · "${activity.song.title}"`;

  return (
    <li>
      <Link
        to={to}
        preload="hover"
        className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-surface-2"
      >
        <img
          src={activity.artist.avatar}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">
            {activity.artist.name}
          </p>
          <p className="truncate text-xs text-text-faint">{line}</p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-text-faint">
          {activity.when}
        </span>
      </Link>
    </li>
  );
}

function ActivityEmpty() {
  return (
    <div className="px-3 py-8 text-sm">
      <p className="font-medium text-text-dim">Nothing here yet</p>
      <p className="mt-1 text-text-faint">
        Follow an artist (tap the heart) to see their new shows and releases here.
      </p>
    </div>
  );
}

export function ActivityFeed() {
  const following = useFollowStore((s) => s.following);
  const items = activitiesFor(following);
  if (items.length === 0) return <ActivityEmpty />;
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((a) => (
        <ActivityRow key={a.id} activity={a} />
      ))}
    </ul>
  );
}

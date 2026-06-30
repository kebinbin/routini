import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "routini";
import { activitiesFor, type Activity } from "../lib/activity";
import { useFollowStore } from "../lib/follow";
import { useSeenStore } from "../lib/seen";
import { getArtist, type Artist, type Song } from "../lib/data";
import { usePlayerStore } from "../player/playerStore";
import { PlayPause } from "../components/PlayPause";
import { SortIcon } from "../components/ActivityFeed";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 9h18" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// Rows resting on bg-surface-2 → hover bg-surface-3, the same lift the /artists
// feed rows use, so the two pages read as one app.
const ROW =
  "flex items-center gap-4 rounded-xl bg-surface-2 p-2.5 transition hover:bg-surface-3 sm:p-3";

// A "new show" a followed artist is on. Whole card → the event; the flyer leads,
// sits centered at its true 3:4 inside a fixed square slot (no crop) so every
// row keeps the same height, and shares poster-<id> with the event hero so it
// morphs across.
function ShowCard({ activity }: { activity: Extract<Activity, { kind: "show" }> }) {
  const { event, when } = activity;
  return (
    <li>
      <Link to={`/event/${event.id}`} preload="hover" viewTransition className={`group ${ROW}`}>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center">
          <img
            src={event.poster}
            alt=""
            className="h-16 w-12 rounded-lg object-cover transition group-hover:opacity-90"
            style={{ viewTransitionName: `poster-${event.id}` }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            New show
          </p>
          <h3 className="mt-0.5 truncate text-base font-semibold text-text">
            {event.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-faint">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {event.date} · {event.time}
            </span>
            <span className="flex items-center gap-1">
              <PinIcon className="h-3.5 w-3.5" />
              {event.venue}
            </span>
          </div>
        </div>
        <div className="flex w-12 shrink-0 flex-col items-end gap-1.5">
          <span className="text-xs tabular-nums text-text-faint">{when}</span>
          <ChevronRightIcon className="h-4 w-4 text-text-faint transition group-hover:translate-x-0.5 group-hover:text-text" />
        </div>
      </Link>
    </li>
  );
}

// Play control for a release card — same active/playing logic as the artist
// page's song rows, styled as a badge over the cover.
function ReleasePlayButton({ song, queue }: { song: Song; queue: Song[] }) {
  const current = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  const isCurrent = current?.id === song.id;
  const showPause = isCurrent && isPlaying;

  return (
    <button
      type="button"
      onClick={() => (isCurrent ? setIsPlaying(!isPlaying) : play(song, queue))}
      aria-label={showPause ? `Pause ${song.title}` : `Play ${song.title}`}
      className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-text text-bg shadow-md transition hover:scale-105"
    >
      <PlayPause playing={showPause} className="h-3.5 w-3.5" />
    </button>
  );
}

// A "new single" from a followed artist. The cover leads and plays it inline
// (music first); the text links to the artist.
function ReleaseCard({ activity }: { activity: Extract<Activity, { kind: "release" }> }) {
  const { artist, song, when } = activity;
  return (
    <li className={ROW}>
      <div className="relative h-16 w-16 shrink-0">
        <img src={song.cover} alt="" className="h-16 w-16 rounded-lg object-cover" />
        <ReleasePlayButton song={song} queue={artist.songs} />
      </div>
      <Link to={`/artist/${artist.id}`} preload="hover" className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          New single
        </p>
        <h3 className="mt-0.5 truncate text-base font-semibold text-text">
          {song.title}
        </h3>
        <p className="mt-1 truncate text-xs text-text-faint">
          {artist.name} · {song.album} · {song.year}
        </p>
      </Link>
      <div className="flex w-12 shrink-0 flex-col items-end gap-1.5">
        <span className="text-xs tabular-nums text-text-faint">{when}</span>
        <span className="text-xs tabular-nums text-text-faint">{song.duration}</span>
      </div>
    </li>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return activity.kind === "show" ? (
    <ShowCard activity={activity} />
  ) : (
    <ReleaseCard activity={activity} />
  );
}

// Buckets the feed by recency. `ts` is "minutes ago" (within ~21 days).
function groupByRecency(items: Activity[]) {
  const buckets: { label: string; items: Activity[] }[] = [
    { label: "Today", items: [] },
    { label: "This week", items: [] },
    { label: "Earlier", items: [] },
  ];
  for (const a of items) {
    if (a.ts < 24 * 60) buckets[0].items.push(a);
    else if (a.ts < 7 * 24 * 60) buckets[1].items.push(a);
    else buckets[2].items.push(a);
  }
  return buckets.filter((b) => b.items.length > 0);
}

// Relative "followed when" from the stored epoch ms.
function followedAgo(ts?: number): string {
  if (!ts) return "recently";
  const min = Math.max(1, Math.floor((Date.now() - ts) / 60000));
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

// The full list of follows — a real list (avatar, full name, "Followed …",
// links to the artist), not a wall of cropped circles. Opened from "Show all".
function FollowingModal({ artists, onClose }: { artists: Artist[]; onClose: () => void }) {
  const followedAt = useFollowStore((s) => s.followedAt);
  const sorted = [...artists].sort(
    (a, b) => (followedAt[b.id] ?? 0) - (followedAt[a.id] ?? 0),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Artists you follow"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">Following · {sorted.length}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-text-dim transition hover:bg-surface-2 hover:text-text"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto p-2">
          {sorted.map((a) => (
            <li key={a.id}>
              <Link
                to={`/artist/${a.id}`}
                preload="hover"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-surface-2"
              >
                <img
                  src={a.avatar}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">{a.name}</p>
                  <p className="truncate text-xs text-text-faint">
                    Followed {followedAgo(followedAt[a.id])}
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-text-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

// Followed artists as avatars, capped so following hundreds doesn't become an
// endless strip. "Show all" / the "+N" chip open the full list in a modal.
const FOLLOW_CAP = 12;

function FollowingStrip({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState(false);
  const overflow = artists.length - FOLLOW_CAP;
  const visible = artists.slice(0, FOLLOW_CAP);

  return (
    <section className="mt-9">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
          Following · {artists.length}
        </h2>
        {overflow > 0 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs font-medium text-text-dim transition hover:text-text"
          >
            Show all
          </button>
        )}
      </div>
      <ul className="no-scrollbar mt-3 flex gap-5 overflow-x-auto pb-1">
        {visible.map((a) => (
          <li key={a.id} className="w-16 shrink-0 text-center">
            <Link to={`/artist/${a.id}`} preload="hover" className="group block">
              <img
                src={a.avatar}
                alt=""
                className="h-16 w-16 rounded-full object-cover ring-1 ring-border transition group-hover:ring-text"
              />
              <span className="mt-1.5 block truncate text-xs text-text-dim">
                {a.name}
              </span>
            </Link>
          </li>
        ))}
        {overflow > 0 && (
          <li className="w-16 shrink-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Show all ${artists.length} followed artists`}
              className="grid h-16 w-16 place-items-center rounded-full border border-border text-sm font-semibold text-text-dim transition hover:border-text hover:text-text"
            >
              +{overflow}
            </button>
          </li>
        )}
      </ul>
      {open && <FollowingModal artists={artists} onClose={() => setOpen(false)} />}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <p className="text-base font-semibold text-text">Nothing here yet</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-text-faint">
        Follow an artist (tap the heart on the feed) and their new shows and
        releases will show up here.
      </p>
      <Link
        to="/artists"
        preload="hover"
        className="mt-6 inline-block rounded-full bg-text px-5 py-2 text-sm font-medium text-bg transition hover:opacity-90"
      >
        Discover artists
      </Link>
    </div>
  );
}

// Full-page "For you". The desktop sidebar shows a compact glance of the same
// feed; this is the richer version — a following strip, recency grouping, and
// uniform cards with cover art (and inline play for releases). Opening it marks
// the current activity seen, so the bell badge clears.
export default function Activity() {
  const following = useFollowStore((s) => s.following);
  const markSeen = useSeenStore((s) => s.markSeen);
  const followedArtists = following
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => !!a);

  // Dedupe shows by event — following several artists on one bill shouldn't
  // repeat the event (and keeps poster-<id> view-transition-names unique).
  const seen = new Set<string>();
  const items = activitiesFor(following).filter((a) => {
    if (a.kind !== "show") return true;
    if (seen.has(a.event.id)) return false;
    seen.add(a.event.id);
    return true;
  });

  const ids = items.map((a) => a.id);
  const idsKey = ids.join(",");
  useEffect(() => {
    markSeen(idsKey ? idsKey.split(",") : []);
  }, [markSeen, idsKey]);

  const groups = groupByRecency(items);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">For you</h1>
          <p className="mt-2 text-sm text-text-faint">
            New shows and releases from the artists you follow.
          </p>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm text-text-dim transition hover:text-text"
        >
          <SortIcon className="h-4 w-4" />
          Sort
        </button>
      </div>

      {followedArtists.length > 0 && <FollowingStrip artists={followedArtists} />}

      {groups.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-10 space-y-8">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-faint">
                {group.label}
              </h2>
              <ul className="mt-2 flex flex-col gap-2">
                {group.items.map((a) => (
                  <ActivityCard key={a.id} activity={a} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

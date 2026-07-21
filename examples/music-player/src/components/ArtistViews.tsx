import { Link } from "routini";
import { coPerformers, type Artist } from "../lib/data";
import { usePlayerStore } from "../player/playerStore";
import { useFollowStore } from "../lib/follow";
import { useFeedView } from "../lib/viewMode";
import { PlayPause } from "./PlayPause";

// Shared artist-list renderer: the four feed layouts (Classic / Immersive /
// Compact / Grid) + the view switcher, reused by the Artists feed and the event
// lineup. Pass any list of artists.

// The heart IS the follow — toggling it adds the artist to your "For you" feed.
function Heart({ artistId, size = 22 }: { artistId: string; size?: number }) {
  const following = useFollowStore((s) => s.following.includes(artistId));
  const toggle = useFollowStore((s) => s.toggle);
  return (
    <button
      onClick={() => toggle(artistId)}
      aria-label={following ? "Following" : "Follow"}
      className={`relative z-10 grid shrink-0 place-items-center rounded-md transition ${
        following ? "text-text" : "text-text-faint hover:text-text"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={following ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        className="block"
        aria-hidden
      >
        <path d="M12 20.8S3 15.4 3 9.3A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.3c0 6.1-9 11.5-9 11.5z" />
      </svg>
    </button>
  );
}

// Per-artist playback state, derived from the global player store.
function usePlayback(a: Artist) {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const first = a.songs[0];
  const isCurrent =
    !!currentSong && a.songs.some((s) => s.id === currentSong.id);
  const rowPlaying = isCurrent && isPlaying;
  const toggle = () =>
    isCurrent ? setIsPlaying(!isPlaying) : first && play(first, a.songs);
  return { isCurrent, rowPlaying, toggle };
}

// Who they share a stage with — small overlapping avatars. Bounded + shrink-0,
// shown only at xl: the first thing to hide as the row narrows.
function CoPerformers({ a }: { a: Artist }) {
  const peers = coPerformers(a.id);
  if (peers.length === 0) return null;
  const shown = peers.slice(0, 3);
  // Label with the shortest name so the line stays compact.
  const shortest = peers.reduce((s, p) =>
    p.name.length < s.name.length ? p : s,
  );
  return (
    <div className="pointer-events-none hidden shrink-0 items-center gap-3 xl:flex">
      <div className="flex -space-x-2">
        {shown.map((p) => (
          <img
            key={p.id}
            src={p.avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-2 ring-surface-2"
          />
        ))}
      </div>
      <span className="max-w-44 truncate text-xs text-text-faint">
        with {shortest.name}
        {peers.length > 1 && ` & ${peers.length - 1} more`}
      </span>
    </div>
  );
}

// ── 0. Classic: the original — play column, wide banner, genres column ───────
function ClassicRow({ a }: { a: Artist }) {
  const { isCurrent, rowPlaying, toggle } = usePlayback(a);
  return (
    <li className="group relative flex h-12 items-center overflow-hidden rounded-xl pr-3 transition hover:bg-surface-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent sm:h-16 lg:h-24 lg:pr-6">
      <Link
        to={`/artist/${a.id}`}
        preload="hover"
        viewTransition
        aria-label={a.name}
        className="absolute inset-0 focus-visible:outline-none"
      />
      <button
        onClick={toggle}
        aria-label={rowPlaying ? `Pause ${a.name}` : `Play ${a.name}`}
        className="relative z-10 grid h-full w-10 shrink-0 place-items-center rounded-l-xl text-text-dim transition hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:w-16"
      >
        <PlayPause playing={rowPlaying} className="h-7 w-7" />
      </button>
      <div
        className="pointer-events-none relative h-full w-36 shrink-0 overflow-hidden sm:w-48 lg:w-72"
        style={{ viewTransitionName: `img-${a.id}` }}
      >
        <img
          src={a.photo}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="ml-4 flex min-w-0 flex-1 items-center gap-6 lg:ml-6 lg:gap-10">
        {/* Left content — name + place, kept intact */}
        <div className="pointer-events-none min-w-0 flex-1">
          <p
            className={`truncate text-base font-semibold ${
              isCurrent ? "text-accent" : "text-text"
            }`}
            style={{ viewTransitionName: `name-${a.id}` }}
          >
            {a.name}
          </p>
          <p
            className="mt-0.5 truncate text-sm text-text-faint"
            style={{ viewTransitionName: `date-${a.id}` }}
          >
            <span className="text-text-dim">
              {a.distanceKm.toFixed(1)} km away
            </span>
            {a.performing && ` · ${a.performing.date} · ${a.performing.venue}`}
          </p>
        </div>

        {/* Right column — same as Immersive: co-performers | genres + heart */}
        <div className="flex shrink-0 items-center justify-between gap-4 xl:flex-1">
          <CoPerformers a={a} />
          <div className="flex shrink-0 items-center gap-3">
            <div className="pointer-events-none hidden items-center gap-1.5 md:flex">
              {a.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-text-dim"
                >
                  {g}
                </span>
              ))}
            </div>
            <Heart artistId={a.id} />
          </div>
        </div>
      </div>
    </li>
  );
}

// ── Compact: one row, equal left-aligned columns ────────────────────────────
function CompactRow({ a }: { a: Artist }) {
  const { isCurrent, rowPlaying, toggle } = usePlayback(a);
  return (
    <li className="group relative flex items-center gap-4 overflow-hidden rounded-lg px-2 py-1 transition hover:bg-surface-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
      <Link
        to={`/artist/${a.id}`}
        preload="hover"
        viewTransition
        aria-label={a.name}
        className="absolute inset-0 focus-visible:outline-none"
      />
      <button
        onClick={toggle}
        aria-label={rowPlaying ? `Pause ${a.name}` : `Play ${a.name}`}
        className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-md text-text-dim transition hover:text-text"
      >
        <PlayPause playing={rowPlaying} className="h-5 w-5" />
      </button>
      <div
        className="pointer-events-none relative h-11 w-11 shrink-0 overflow-hidden rounded-md"
        style={{ viewTransitionName: `img-${a.id}` }}
      >
        <img
          src={a.photo}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      {/* Equal, left-aligned columns on a single row (table-style). */}
      <div className="pointer-events-none flex min-w-0 flex-1 items-center gap-4 text-sm lg:gap-8">
        <span
          className={`min-w-0 flex-1 truncate font-medium ${
            isCurrent ? "text-accent" : "text-text"
          }`}
          style={{ viewTransitionName: `name-${a.id}` }}
        >
          {a.name}
        </span>
        <span
          className="hidden min-w-0 flex-1 truncate text-text-faint lg:block"
          style={{ viewTransitionName: `date-${a.id}` }}
        >
          {a.performing?.date}
        </span>
        <span className="hidden min-w-0 flex-1 truncate text-text-faint lg:block">
          {a.performing?.venue}
        </span>
        <span className="hidden min-w-0 flex-1 truncate text-text-dim sm:block">
          {a.distanceKm.toFixed(1)} km
        </span>
      </div>
      {/* Genres as pills, just before the heart — first to drop (at xl).
          Fixed-width column so the left columns stay aligned across rows. */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="pointer-events-none hidden w-48 items-center gap-1.5 overflow-hidden xl:flex">
          {a.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="shrink-0 rounded-full bg-surface-3 px-2 py-0.5 text-xs text-text-dim"
            >
              {g}
            </span>
          ))}
        </div>
        <Heart artistId={a.id} />
      </div>
    </li>
  );
}

// ── 2. Immersive: tall photo + genre pills (same look, no hover-autoplay) ────
function ImmersiveRow({ a }: { a: Artist }) {
  const { isCurrent, rowPlaying, toggle } = usePlayback(a);
  return (
    <li className="group relative flex min-h-24 items-center gap-4 overflow-hidden rounded-xl pr-4 transition hover:bg-surface-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
      <Link
        to={`/artist/${a.id}`}
        preload="hover"
        viewTransition
        aria-label={a.name}
        className="absolute inset-0 focus-visible:outline-none"
      />

      {/* LEFT column — photo + artist + place (priority; wraps, never cut) */}
      <div className="flex min-w-0 flex-[1.4] items-center gap-4 self-stretch">
        <div
          className="relative w-24 shrink-0 self-stretch overflow-hidden sm:w-44 lg:w-64"
          style={{ viewTransitionName: `img-${a.id}` }}
        >
          <img
            src={a.photo}
            alt=""
            className="pointer-events-none h-full w-full object-cover object-center"
          />
          <button
            onClick={toggle}
            aria-label={rowPlaying ? `Pause ${a.name}` : `Play ${a.name}`}
            className="absolute inset-0 z-10 grid place-items-center rounded-l-xl bg-black/35 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-text text-bg shadow-lg">
              <PlayPause playing={rowPlaying} className="h-6 w-6" />
            </span>
          </button>
        </div>
        <div className="pointer-events-none flex min-w-0 flex-1 flex-col justify-center gap-1 py-2">
          <p
            className={`text-lg font-semibold leading-tight ${
              isCurrent ? "text-accent" : "text-text"
            }`}
            style={{ viewTransitionName: `name-${a.id}` }}
          >
            {a.name}
          </p>
          <p
            className="text-sm leading-snug text-text-faint"
            style={{ viewTransitionName: `date-${a.id}` }}
          >
            <span className="text-text-dim">
              {a.distanceKm.toFixed(1)} km away
            </span>
            {a.performing && ` · ${a.performing.date} · ${a.performing.venue}`}
          </p>
        </div>
      </div>

      {/* RIGHT column — co-performers (start) | genres + heart (end), spread
          apart. Co-performers hide first (below xl), genres next (below md). */}
      <div className="flex shrink-0 items-center justify-between gap-4 xl:flex-1">
        <CoPerformers a={a} />
        <div className="flex shrink-0 items-center gap-3">
          <div className="pointer-events-none hidden items-center gap-1.5 md:flex">
            {a.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-text-dim"
              >
                {g}
              </span>
            ))}
          </div>
          <Heart artistId={a.id} />
        </div>
      </div>
    </li>
  );
}

// ── 3. Card grid: photo-forward, play overlay, info below ────────────────────
function GridCard({ a }: { a: Artist }) {
  const { isCurrent, rowPlaying, toggle } = usePlayback(a);
  return (
    <li className="group relative overflow-hidden rounded-xl transition hover:bg-surface-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
      <Link
        to={`/artist/${a.id}`}
        preload="hover"
        viewTransition
        aria-label={a.name}
        className="absolute inset-0 focus-visible:outline-none"
      />
      <div
        className="pointer-events-none relative aspect-square overflow-hidden"
        style={{ viewTransitionName: `img-${a.id}` }}
      >
        <img
          src={a.photo}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* genres, top-right (max 2) */}
        <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[85%] flex-wrap justify-end gap-1">
          {a.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              {g}
            </span>
          ))}
        </div>
        {/* Hover scrim — decorative only (clicks pass through to the card → artist) */}
        <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition group-hover:opacity-100" />
        {/* Centered play button — ONLY this plays; the rest of the card navigates */}
        <button
          onClick={toggle}
          aria-label={rowPlaying ? `Pause ${a.name}` : `Play ${a.name}`}
          className={`pointer-events-auto absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-text text-bg shadow-lg transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bg ${
            rowPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <PlayPause playing={rowPlaying} className="h-8 w-8" />
        </button>
      </div>
      <div className="pointer-events-none flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-semibold ${
              isCurrent ? "text-accent" : "text-text"
            }`}
            style={{ viewTransitionName: `name-${a.id}` }}
          >
            {a.name}
          </p>
          <p
            className="mt-0.5 truncate text-xs text-text-faint"
            style={{ viewTransitionName: `date-${a.id}` }}
          >
            <span className="text-text-dim">{a.distanceKm.toFixed(1)} km</span>
            {a.performing && ` · ${a.performing.date}`}
          </p>
        </div>
        <span className="pointer-events-auto">
          <Heart artistId={a.id} size={26} />
        </span>
      </div>
    </li>
  );
}

// ── View-switcher icons — one representative glyph per layout (macOS-style) ──
export function ClassicIcon({ className }: { className?: string }) {
  // rows with a cover thumbnail — a media list
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4.5" width="6" height="6" rx="1.5" />
      <path d="M12 6h9M12 9h5" />
      <rect x="3" y="13.5" width="6" height="6" rx="1.5" />
      <path d="M12 15h9M12 18h5" />
    </svg>
  );
}
function ImmersiveIcon({ className }: { className?: string }) {
  // one large cover + details — the showcase row
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4" width="9" height="16" rx="2" />
      <path d="M15 8h6M15 12h6M15 16h4" />
    </svg>
  );
}
function CompactIcon({ className }: { className?: string }) {
  // dense list rows — table style
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function GridIcon({ className }: { className?: string }) {
  // grid of cards
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

// "classic" left out of the switcher on purpose; ClassicRow/Icon stay defined.
const VIEWS = [
  ["immersive", "Immersive", ImmersiveIcon],
  ["compact", "Compact", CompactIcon],
  ["grid", "Grid", GridIcon],
] as const;

// macOS-style icon-only segmented control; persists to the shared view store.
export function ViewSwitcher() {
  const view = useFeedView((s) => s.view);
  const setView = useFeedView((s) => s.setView);
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-border p-0.5">
      {VIEWS.map(([v, label, Icon]) => (
        <button
          key={v}
          type="button"
          onClick={() => setView(v)}
          title={label}
          aria-label={label}
          aria-pressed={view === v}
          className={`grid place-items-center rounded-full p-1.5 transition ${
            view === v ? "bg-text text-bg" : "text-text-dim hover:text-text"
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

// Renders a list of artists in the currently-selected layout.
export function ArtistViews({ artists }: { artists: Artist[] }) {
  const view = useFeedView((s) => s.view);
  return view === "grid" ? (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {artists.map((a) => (
        <GridCard key={a.id} a={a} />
      ))}
    </ul>
  ) : (
    <ul
      className={`flex flex-col ${view === "compact" ? "gap-0.5" : "gap-2.5"}`}
    >
      {artists.map((a) =>
        view === "compact" ? (
          <CompactRow key={a.id} a={a} />
        ) : view === "classic" ? (
          <ClassicRow key={a.id} a={a} />
        ) : (
          <ImmersiveRow key={a.id} a={a} />
        ),
      )}
    </ul>
  );
}

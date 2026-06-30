import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "routini";
import { getArtist, eventsForArtist, coPerformers, type Song } from "../lib/data";
import { usePlayerStore } from "../player/playerStore";
import { useFollowStore } from "../lib/follow";
import { SpotifyIcon, SoundCloudIcon, YouTubeIcon } from "../components/BrandIcons";
import { PlayPause } from "../components/PlayPause";

function FollowButton({ artistId }: { artistId: string }) {
  const following = useFollowStore((s) => s.following.includes(artistId));
  const toggle = useFollowStore((s) => s.toggle);
  return (
    <button
      onClick={() => toggle(artistId)}
      aria-pressed={following}
      className={`mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
        following
          ? "border border-border text-text hover:bg-surface-2"
          : "bg-text text-bg hover:opacity-90"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill={following ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 20.8S3 15.4 3 9.3A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.3c0 6.1-9 11.5-9 11.5z" />
      </svg>
      {following ? "Following" : "Follow"}
    </button>
  );
}

// Play/pause toggle for a song row. Icon-only, like the feed and the player —
// brighter when it's the active track, no chrome.
function PlayButton({ song, queue }: { song: Song; queue: Song[] }) {
  const current = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  const isCurrent = current?.id === song.id;
  const showPause = isCurrent && isPlaying;

  return (
    <button
      onClick={() => (isCurrent ? setIsPlaying(!isPlaying) : play(song, queue))}
      aria-label={showPause ? `Pause ${song.title}` : `Play ${song.title}`}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-md transition hover:text-text ${
        isCurrent ? "text-text" : "text-text-dim"
      }`}
    >
      <PlayPause playing={showPause} className="h-6 w-6" />
    </button>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FiltersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

// The artist's streaming links — a single row at the foot of the track list.
function StreamingLinks({ artist }: { artist: string }) {
  const q = encodeURIComponent(artist);
  const items: Array<[string, string, React.FC<{ className?: string }>]> = [
    ["Spotify", `https://open.spotify.com/search/${q}`, SpotifyIcon],
    ["SoundCloud", `https://soundcloud.com/search?q=${q}`, SoundCloudIcon],
    ["Youtube", `https://www.youtube.com/results?search_query=${q}`, YouTubeIcon],
  ];
  return (
    <div className="mt-6 flex items-center justify-end gap-7 text-sm text-text-faint">
      {items.map(([label, href, Icon]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${artist} on ${label}`}
          className="flex items-center gap-2 rounded-md transition hover:text-text"
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </div>
  );
}

function CaretIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

// A horizontal rail: ~7 cards visible on a wide screen (plus a peek of the next
// to hint there's more), the rest scroll. Caret buttons appear only when there
// is more to reveal in that direction — left once you've scrolled off the start,
// right while content remains. Replaces a wrapping grid because these "related"
// lists can be long, and gives click targets since trackpad/wheel horizontal
// scroll is awkward on desktop.
function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  // Vertical center of the card *media* (image), so the carets sit on the art
  // rather than drifting down toward the caption text.
  const [caretTop, setCaretTop] = useState<number>();

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1);
    const img = el.querySelector("img");
    if (img) {
      const r = img.getBoundingClientRect();
      setCaretTop(r.top - el.getBoundingClientRect().top + r.height / 2);
    }
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative mt-4">
      <ul
        ref={ref}
        className="no-scrollbar grid auto-cols-[40%] grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-1 sm:auto-cols-[22%] lg:auto-cols-[15.5%] xl:auto-cols-[12.5%]"
      >
        {children}
      </ul>
      {!atStart && (
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label="Scroll left"
          style={{ top: caretTop ?? "50%" }}
          className="absolute left-1.5 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface-2 text-text-dim shadow-lg transition hover:text-text"
        >
          <CaretIcon dir="left" />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => page(1)}
          aria-label="Scroll right"
          style={{ top: caretTop ?? "50%" }}
          className="absolute right-1.5 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface-2 text-text-dim shadow-lg transition hover:text-text"
        >
          <CaretIcon dir="right" />
        </button>
      )}
    </div>
  );
}

export default function Artist() {
  const { id } = useParams<{ id: string }>();
  const artist = id ? getArtist(id) : undefined;

  if (!artist) {
    return <div className="p-6 text-text-dim">Artist not found.</div>;
  }

  const upcoming = eventsForArtist(artist.id);
  const peers = coPerformers(artist.id);

  return (
    <div>
      <div className="relative aspect-4/3 w-full overflow-hidden sm:aspect-2/1 lg:aspect-8/3">
        {/* Photo + scrim share ONE view-transition-name, so they morph together
            as a single snapshot — the scrim is baked into the image's box and
            tracks it the whole way (no seam where a fixed overlay would sit).
            Dark on the left for legibility, and along the bottom so the hero
            merges into the content below (matches the Figma). */}
        <div
          className="absolute inset-0"
          style={{ viewTransitionName: `img-${artist.id}` }}
        >
          <img
            src={artist.photo}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-surface via-surface/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-surface to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            {artist.performing && (
              <p
                className="text-base font-medium text-text-dim sm:text-lg"
                style={{ viewTransitionName: `date-${artist.id}` }}
              >
                Performing {artist.performing.date} @ {artist.performing.venue}
              </p>
            )}
            <h1
              className="mt-3.5 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-[5rem]"
              style={{ viewTransitionName: `name-${artist.id}` }}
            >
              {artist.name}
            </h1>
            <p
              className="mt-7 max-w-lg text-sm leading-relaxed text-text-dim sm:mt-8"
              style={{ viewTransitionName: "artist-bio" }}
            >
              {artist.bio}
            </p>
            <FollowButton artistId={artist.id} />
          </div>
        </div>
      </div>

      <div className="space-y-12 px-4 py-8 sm:px-6 lg:space-y-16 lg:px-8 lg:py-12">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Hear more from {artist.name}</h2>
            <div className="hidden items-center gap-5 text-sm text-text-faint sm:flex">
              <button type="button" className="flex items-center gap-1.5 rounded-md transition hover:text-text">
                Sort by album
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <button type="button" className="flex items-center gap-1.5 rounded-md transition hover:text-text">
                <FiltersIcon className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {artist.songs.map((s) => (
              <li
                key={s.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-surface-2 sm:gap-4 sm:px-3"
              >
                <PlayButton song={s} queue={artist.songs} />
                <img
                  src={s.cover}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded object-cover"
                />
                {/* Equal, left-aligned columns — same shape as the feed rows */}
                <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
                  <div className="min-w-0 flex-[1.4]">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="truncate text-xs text-text-dim">{s.album}</p>
                  </div>
                  <span className="hidden min-w-0 flex-1 truncate text-sm text-text-dim md:block">
                    {s.genres.join(", ")}
                  </span>
                  <span className="hidden min-w-0 flex-1 truncate text-sm tabular-nums text-text-faint lg:block">
                    {s.year}
                  </span>
                  <span className="ml-auto hidden w-12 shrink-0 text-sm tabular-nums text-text-faint sm:block">
                    {s.duration}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <StreamingLinks artist={artist.name} />
        </section>

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-lg font-bold">{artist.name} will be in</h2>
            <Carousel>
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/event/${e.id}`}
                    preload="hover"
                    viewTransition
                    className="group block overflow-hidden rounded-xl transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div
                      className="relative aspect-3/4 overflow-hidden"
                      style={{ viewTransitionName: `poster-${e.id}` }}
                    >
                      <img
                        src={e.poster}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-text">{e.title}</p>
                      <p className="mt-0.5 truncate text-xs text-text-faint">
                        {e.date} @ {e.venue}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </Carousel>
          </section>
        )}

        {peers.length > 0 && (
          <section>
            <h2 className="text-lg font-bold">Performing soon with</h2>
            <Carousel>
              {peers.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/artist/${c.id}`}
                    preload="hover"
                    viewTransition
                    className="group block rounded-xl focus-visible:outline-none"
                  >
                    {/* Circle spans the full card width; the wrapper's pt-[50%]
                        reserves its top half so the hover tint (on the inner box,
                        which also clears its own bottom half) only ever shows
                        from the circle's middle down — never behind its top. */}
                    <div className="relative pt-[50%]">
                      <div className="rounded-xl px-3 pb-4 pt-[50%] transition group-hover:bg-surface-2 group-focus-visible:ring-2 group-focus-visible:ring-accent">
                        <p className="mt-2 truncate text-sm font-semibold text-text">{c.name}</p>
                        {c.performing && (
                          <p className="mt-0.5 truncate text-xs text-text-faint">
                            {c.performing.date} @ {c.performing.venue}
                          </p>
                        )}
                      </div>
                      <img
                        src={c.avatar}
                        alt=""
                        className="absolute inset-x-0 top-0 z-10 aspect-square w-full rounded-full object-cover"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </Carousel>
          </section>
        )}
      </div>
    </div>
  );
}

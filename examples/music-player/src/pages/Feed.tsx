import { useState } from "react";
import { Link } from "routini";
import { artists } from "../lib/data";
import { usePlayerStore } from "../player/playerStore";

function PlayPause({ playing, className }: { playing: boolean; className?: string }) {
  return playing ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function Heart() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => setLiked((v) => !v)}
      aria-label={liked ? "Saved" : "Save"}
      className={`relative z-10 shrink-0 transition ${liked ? "text-text" : "text-text-faint hover:text-text"}`}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 20.8S3 15.4 3 9.3A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.3c0 6.1-9 11.5-9 11.5z" />
      </svg>
    </button>
  );
}

export default function Feed() {
  const play = usePlayerStore((s) => s.play);
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
          Discover artists near San Juan
        </h1>
        <div className="hidden items-center gap-5 text-xs text-text-dim sm:flex">
          <button className="flex items-center gap-1 transition hover:text-text">
            Sort by distance
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <button className="flex items-center gap-1.5 transition hover:text-text">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-2.5">
        {[...artists]
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .map((a) => {
          const first = a.songs[0];
          const isCurrent =
            !!currentSong && a.songs.some((s) => s.id === currentSong.id);
          const rowPlaying = isCurrent && isPlaying;
          return (
            <li
              key={a.id}
              className="group relative flex h-12 items-center overflow-hidden bg-surface-2 pr-3 transition hover:bg-surface-3 sm:h-16 lg:h-24 lg:pr-6"
            >
              {/* Whole row navigates to the artist; sits under the buttons.
                  The image/title/date carry per-artist view-transition names
                  that match the Artist page, so they morph into the hero. */}
              <Link
                to={`/artist/${a.id}`}
                preload="hover"
                viewTransition
                aria-label={a.name}
                className="absolute inset-0"
              />

              <button
                onClick={() =>
                  isCurrent ? setIsPlaying(!isPlaying) : first && play(first, a.songs)
                }
                aria-label={rowPlaying ? `Pause ${a.name}` : `Play ${a.name}`}
                className="relative z-10 grid h-full w-10 shrink-0 place-items-center text-text-dim transition hover:text-text sm:w-16"
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

              <div className="pointer-events-none ml-4 flex min-w-0 flex-1 items-center gap-6 lg:ml-6 lg:gap-10">
                <div className="min-w-0 flex-[1.4]">
                  <p
                    className={`truncate text-base font-semibold ${
                      isCurrent ? "text-accent" : "text-text"
                    }`}
                    style={{ viewTransitionName: `name-${a.id}` }}
                  >
                    {a.name}
                  </p>
                  {a.performing && (
                    <p
                      className="mt-0.5 truncate text-sm text-text-faint"
                      style={{ viewTransitionName: `date-${a.id}` }}
                    >
                      {a.performing.date} @ {a.performing.venue}
                    </p>
                  )}
                </div>

                <span className="hidden min-w-0 flex-1 truncate text-sm text-text-dim md:block">
                  {a.genres.join(", ")}
                </span>

                <span className="hidden min-w-0 flex-1 truncate text-sm text-text-faint lg:block">
                  {a.songs.length} songs
                </span>

                <span className="hidden min-w-0 flex-1 truncate text-sm text-text-faint lg:block">
                  {a.distanceKm.toFixed(1)}km from you
                </span>
              </div>

              <Heart />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

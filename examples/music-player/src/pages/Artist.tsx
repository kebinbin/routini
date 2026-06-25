import { Link, useParams } from "routini";
import { getArtist, eventsForArtist, coPerformers } from "../lib/data";
import { usePlayerStore } from "../player/playerStore";

export default function Artist() {
  const { id } = useParams<{ id: string }>();
  const artist = id ? getArtist(id) : undefined;
  const play = usePlayerStore((s) => s.play);

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
          <div className="max-w-xl">
            {artist.performing && (
              <p
                className="text-sm text-text-dim"
                style={{ viewTransitionName: `date-${artist.id}` }}
              >
                Performing {artist.performing.date} @ {artist.performing.venue}
              </p>
            )}
            <h1
              className="mt-2 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl"
              style={{ viewTransitionName: `name-${artist.id}` }}
            >
              {artist.name}
            </h1>
            <p
              className="mt-4 max-w-md text-sm leading-relaxed text-text-dim"
              style={{ viewTransitionName: "artist-bio" }}
            >
              {artist.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 lg:py-6">
        <h2 className="text-lg font-bold">Hear more from {artist.name}</h2>
        <ul className="mt-4 flex flex-col">
          {artist.songs.map((s, i) => (
            <li
              key={s.id}
              className="group flex items-center gap-4 rounded-md px-3 py-2 transition hover:bg-surface-2"
            >
              <button
                onClick={() => play(s, artist.songs)}
                aria-label={`Play ${s.title}`}
                className="w-6 shrink-0 text-center text-sm text-text-faint group-hover:text-text"
              >
                {i + 1}
              </button>
              <img
                src={s.cover}
                alt=""
                className="h-10 w-10 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="truncate text-xs text-text-dim">{s.artist}</p>
              </div>
              <span className="shrink-0 text-sm text-text-faint tabular-nums">
                {s.duration}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {upcoming.length > 0 && (
        <div className="px-4 py-5 sm:px-6 lg:py-6">
          <h2 className="text-lg font-bold">{artist.name} will be in</h2>
          <ul className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {upcoming.map((e) => (
              <li key={e.id} className="w-40 shrink-0 sm:w-44">
                <Link
                  to={`/event/${e.id}`}
                  preload="hover"
                  viewTransition
                  className="group block"
                >
                  <img
                    src={e.poster}
                    alt=""
                    className="aspect-3/4 w-full rounded-lg object-cover transition group-hover:opacity-90"
                  />
                  <p className="mt-2 truncate text-sm font-medium">{e.title}</p>
                  <p className="truncate text-xs text-text-faint">
                    {e.date} @ {e.venue}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {peers.length > 0 && (
        <div className="px-4 py-5 sm:px-6 lg:py-6">
          <h2 className="text-lg font-bold">Performing soon with</h2>
          <ul className="mt-4 flex gap-5 overflow-x-auto pb-2">
            {peers.map((c) => (
              <li key={c.id} className="w-24 shrink-0 text-center">
                <Link
                  to={`/artist/${c.id}`}
                  preload="hover"
                  viewTransition
                  className="group block"
                >
                  <img
                    src={c.avatar}
                    alt=""
                    className="aspect-square w-24 rounded-full object-cover transition group-hover:opacity-90"
                  />
                  <p className="mt-2 truncate text-sm font-medium">{c.name}</p>
                  {c.performing && (
                    <p className="truncate text-xs text-text-faint">
                      {c.performing.date} @ {c.performing.venue}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { Link } from "routini";
import {
  coPerformers,
  eventsForArtist,
  type Artist,
  type MusicEvent,
} from "../lib/data";
import { usePlayerStore } from "../player/playerStore";
import type { Notif } from "./NotificationList";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function ArtistRail({ title, list }: { title: string; list: Artist[] }) {
  if (!list.length) return null;
  return (
    <section className="mt-10">
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {list.map((a) => (
          <li key={a.id} className="w-16 shrink-0 text-center">
            <Link to={`/artist/${a.id}`} preload="hover" viewTransition>
              <img
                src={a.avatar}
                alt=""
                className="h-14 w-14 rounded-full object-cover ring-1 ring-border transition hover:ring-text"
              />
              <span className="mt-1 block truncate text-[11px] text-text-dim">
                {a.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EventRail({ title, list }: { title: string; list: MusicEvent[] }) {
  if (!list.length) return null;
  return (
    <section className="mt-10">
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {list.map((e) => (
          <li key={e.id} className="w-32 shrink-0">
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
              <p className="mt-1.5 truncate text-xs font-medium">{e.title}</p>
              <p className="truncate text-[11px] text-text-faint">{e.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NotificationMessage({ notif }: { notif: Notif }) {
  const play = usePlayerStore((s) => s.play);
  const { artist } = notif;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <img
          src={artist.avatar}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <Link
            to={`/artist/${artist.id}`}
            preload="hover"
            viewTransition
            className="font-semibold hover:underline"
          >
            {artist.name}
          </Link>
          <p className="text-xs text-text-faint">
            {notif.kind === "show" ? "New show near you" : "New release"} ·{" "}
            {notif.when}
          </p>
        </div>
      </div>

      {notif.kind === "show" ? (
        <>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">
            {notif.event.title}
          </h2>
          <p className="mt-1 text-sm text-text-faint">
            {notif.event.date} @ {notif.event.venue}
          </p>
          <img
            src={notif.event.poster}
            alt=""
            className="mt-4 w-44 rounded-xl object-cover"
          />
          <p className="mt-4 leading-relaxed text-text-dim">
            {artist.name} just joined the lineup for {notif.event.title},{" "}
            {notif.event.date} at {notif.event.venue}. {notif.event.description}{" "}
            It's shaping up to be one of the season's standout nights — doors open
            early and the room fills fast, so plan ahead and bring friends who'll
            appreciate {artist.genres.join(" and ")}.
          </p>
          <Link
            to={`/event/${notif.event.id}`}
            preload="hover"
            viewTransition
            className="mt-6 inline-block rounded-full bg-text px-5 py-2 text-sm font-medium text-bg transition hover:opacity-90"
          >
            View event
          </Link>
          <EventRail
            title={`${artist.name} will be presenting in`}
            list={eventsForArtist(artist.id)}
          />
        </>
      ) : (
        <>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">
            {notif.song.title}
          </h2>
          <p className="mt-1 text-sm text-text-faint">
            New single from {artist.name}
          </p>
          <img
            src={notif.song.cover}
            alt=""
            className="mt-4 h-44 w-44 rounded-xl object-cover"
          />
          <p className="mt-4 leading-relaxed text-text-dim">
            {artist.name} just dropped a new single, "{notif.song.title}". It's
            streaming now — hit play below. If it lands, it sits right between{" "}
            {artist.genres.join(" and ")}, and there's more from the upcoming
            record on the way. Add it to your rotation and catch them live soon.
          </p>
          <button
            onClick={() => play(notif.song, artist.songs)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-text px-5 py-2 text-sm font-medium text-bg transition hover:opacity-90"
          >
            <PlayIcon className="h-4 w-4" />
            Play now
          </button>
          <ArtistRail
            title={`${artist.name} will be playing soon with`}
            list={coPerformers(artist.id)}
          />
        </>
      )}
    </div>
  );
}

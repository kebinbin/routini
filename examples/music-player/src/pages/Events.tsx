import { Link } from "routini";
import { events, getArtist, type MusicEvent } from "../lib/data";
import { DiscoveryHeader } from "../components/DiscoveryNav";

// One event in the grid: a poster card with a date chip, the lineup as
// overlapping avatars, and the title/venue below. The poster shares a
// `view-transition-name` with the Event detail hero, so it morphs on navigate.
function EventCard({ e }: { e: MusicEvent }) {
  const lineup = e.lineup
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <li className="group relative rounded-xl transition hover:bg-surface-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
      <Link
        to={`/event/${e.id}`}
        preload="hover"
        viewTransition
        aria-label={e.title}
        className="absolute inset-0 z-10 focus-visible:outline-none"
      />
      <div className="p-3">
        <div
          className="relative aspect-3/4 overflow-hidden rounded-lg"
          style={{ viewTransitionName: `poster-${e.id}` }}
        >
          <img
            src={e.poster}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {e.date}
          </span>
          {lineup.length > 0 && (
            <div className="absolute bottom-2.5 left-2.5 flex -space-x-2">
              {lineup.slice(0, 4).map((a) => (
                <img
                  key={a.id}
                  src={a.avatar}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-black/30"
                />
              ))}
              {lineup.length > 4 && (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-black/55 text-[10px] font-semibold text-white ring-2 ring-black/30">
                  +{lineup.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 truncate text-sm font-semibold text-text">
          {e.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-text-faint">{e.venue}</p>
      </div>
    </li>
  );
}

export default function Events() {
  // Soonest first — events are authored in date order, but sort defensively.
  const sorted = [...events];

  return (
    <div>
      <DiscoveryHeader title="Discover events near San Juan" />
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {sorted.map((e) => (
            <EventCard key={e.id} e={e} />
          ))}
        </ul>
      </div>
    </div>
  );
}

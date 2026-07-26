import { useParams } from "routini";
import { getArtist, getEvent } from "../lib/data";
import { ViewSwitcher, ArtistViews } from "../components/ArtistViews";
import { EventMiniMap } from "../components/EventMap";

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4Z" />
      <path d="M13 7v10" strokeDasharray="2 2" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEvent(id) : undefined;

  if (!event) {
    return <div className="p-6 text-text-dim">Event not found.</div>;
  }

  const lineup = event.lineup
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // No ticketUrl in the (generated) data yet — build a real outbound search so
  // the CTA works. A stored ticketUrl per event would replace this later.
  const ticketUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${event.title} ${event.venue} tickets`,
  )}`;

  return (
    <div>
      {/* Hero — cover-tall, but the height follows its content (in-flow) so
          neither the text nor the flyer is ever clipped. No landscape cover, so
          the vertical flyer is stretched + heavily blurred into an ambient
          backdrop (keeps its colors); the content sits on top, split in two
          columns: text+buttons left, flyer centered right. */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.poster}
            alt=""
            className="h-full w-full scale-110 object-cover blur-lg"
          />
          {/* Darken behind the text (left) for legibility; let color show right. */}
          <div className="absolute inset-0 bg-linear-to-r from-surface via-surface/55 to-surface/15" />
          <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent" />
        </div>

        <div className="relative grid grid-cols-1 items-center gap-x-5 gap-y-8 px-5 py-10 sm:gap-x-8 sm:gap-y-10 sm:px-8 sm:py-12 md:grid-cols-2 md:gap-8 lg:px-10 lg:py-14">
          {/* Left column — text + buttons */}
          <div className="min-w-0">
            <p className="text-base font-medium text-text-dim sm:text-lg">
              {event.date} · {event.time} · {event.venue}
            </p>
            <h1 className="mt-3.5 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-[5rem]">
              {event.title}
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-text-dim">
              {event.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
              >
                <TicketIcon className="h-4 w-4" />
                Get tickets
              </a>
              <a
                href="#event-map"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("event-map")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-text-dim transition hover:text-text"
              >
                <MapPinIcon className="h-4 w-4" />
                View on map
              </a>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {lineup.slice(0, 5).map((a) => (
                    <img
                      key={a.id}
                      src={a.avatar}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-surface"
                    />
                  ))}
                </div>
                <span className="text-sm text-text-faint">
                  {lineup.length} {lineup.length === 1 ? "artist" : "artists"}
                </span>
              </div>
            </div>
          </div>

          {/* Right column — the WHOLE flyer, centered, capped to a cover-like
              height (object-contain, so the vertical art is never cropped). The
              hero height follows the taller column, so nothing is clipped. */}
          <div className="flex justify-center">
            <img
              src={event.poster}
              alt=""
              className="max-h-80 w-auto max-w-full rounded-xl object-contain shadow-2xl sm:max-h-96 sm:rounded-2xl lg:max-h-112"
              style={{ viewTransitionName: `poster-${event.id}` }}
            />
          </div>
        </div>
      </div>

      {/* Lineup — same artist layouts as the feed, filtered to this event */}
      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Lineup</h2>
          <ViewSwitcher />
        </div>
        <div className="mt-4">
          <ArtistViews artists={lineup} />
        </div>
      </section>

      {/* Where — a focused map of just this event with its popup open. The hero's
          "View on map" anchors here (#event-map). */}
      <section id="event-map" className="scroll-mt-6 px-4 pb-12 sm:px-6 lg:px-10">
        <h2 className="text-lg font-bold">How to get to {event.venue}</h2>
        <div className="mt-4">
          <EventMiniMap event={event} />
        </div>
      </section>
    </div>
  );
}

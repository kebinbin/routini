import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState, type RefObject } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "routini";
import { events, getArtist, type MusicEvent, type Venue } from "../lib/data";
import { useTheme } from "../lib/theme";

// Custom dot marker (a divIcon) so we skip Leaflet's default icon assets and
// theme it via CSS (see .sona-pin in index.css).
export const pinIcon = L.divIcon({
  className: "",
  html: '<span class="sona-pin"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// CARTO basemap (keyless), swapped by theme.
export function tileUrl(theme: string) {
  return theme === "light"
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
}

// Event card inside a map pin's popup: poster (morphs to the event hero) +
// details + lineup + "View event".
function EventCard({ event }: { event: MusicEvent }) {
  const lineup = event.lineup
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => !!a);
  return (
    <div className="flex w-72 sm:w-120">
      <img
        src={event.poster}
        alt=""
        className="hidden w-48 shrink-0 self-stretch bg-surface-2 object-cover sm:block"
        style={{ viewTransitionName: `poster-${event.id}` }}
      />
      <div className="min-w-0 flex-1 p-4">
        <p className="pr-5 text-xs text-text-faint">
          {event.date} · {event.time}
        </p>
        <h2 className="mt-0.5 pr-5 text-lg leading-tight font-bold text-text">
          {event.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-dim">
          {event.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {lineup.map((a) => (
            <Link
              key={a.id}
              to={`/artist/${a.id}`}
              preload="hover"
              viewTransition
              className="flex w-11 flex-col items-center gap-1"
            >
              <img
                src={a.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-1 ring-border transition hover:ring-text"
              />
              <span className="w-full truncate text-center text-[10px] text-text-dim">
                {a.name}
              </span>
            </Link>
          ))}
        </div>
        <Link
          to={`/event/${event.id}`}
          preload="hover"
          viewTransition
          className="sona-cta mt-3 block rounded-full bg-text px-4 py-1.5 text-center text-sm font-medium transition hover:opacity-90"
        >
          View event
        </Link>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

// Map pin popup: one event flyer. The pin is per-venue, so when a venue hosts
// several events, arrows cycle through them in place.
export function VenueEventsPopup({ venue }: { venue: Venue }) {
  const venueEvents = events.filter((e) => e.venueId === venue.id);
  const [i, setI] = useState(0);
  const n = venueEvents.length;
  const at = ((i % n) + n) % n;
  return (
    <div className="relative">
      <EventCard event={venueEvents[at]} />
      {n > 1 && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-full bg-black/55 px-1 py-0.5 text-white backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setI(i - 1)}
            aria-label="Previous event at this venue"
            className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/20"
          >
            <Chevron dir="left" />
          </button>
          <span className="px-0.5 text-[11px] font-semibold tabular-nums">{at + 1}/{n}</span>
          <button
            type="button"
            onClick={() => setI(i + 1)}
            aria-label="Next event at this venue"
            className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/20"
          >
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}

// Opens the marker's popup once the map context is ready (mini-map only).
function AutoOpenPopup({ markerRef }: { markerRef: RefObject<L.Marker | null> }) {
  const map = useMap();
  useEffect(() => {
    markerRef.current?.openPopup();
  }, [map, markerRef]);
  return null;
}

// Venue-focused popup for the event page's own map — venue photo (on top),
// blurb, this event's date/time, any other events at the venue, and directions.
// No lineup (already on the page) and no "View event" (we're on that event).
function VenuePopup({ event }: { event: MusicEvent }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`;
  const alsoHere = events.filter(
    (e) => e.venueId === event.venueId && e.id !== event.id,
  );
  return (
    <div className="w-80 sm:w-96">
      {event.venuePhoto && (
        <img src={event.venuePhoto} alt="" className="h-36 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-base font-bold leading-tight text-text">
          {event.venue}
        </h3>
        <p className="mt-1 text-xs text-text-faint">
          {event.date} · {event.time}
        </p>
        {event.venueDescription && (
          <p className="mt-2 text-sm leading-relaxed text-text-dim">
            {event.venueDescription}
          </p>
        )}

        {alsoHere.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-faint">
              Also at this venue
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {alsoHere.map((e) => (
                <Link
                  key={e.id}
                  to={`/event/${e.id}`}
                  preload="hover"
                  viewTransition
                  className="w-14"
                >
                  <img
                    src={e.poster}
                    alt=""
                    className="aspect-3/4 w-full rounded object-cover transition hover:opacity-90"
                    style={{ viewTransitionName: `poster-${e.id}` }}
                  />
                  <span className="mt-1 block truncate text-[10px] text-text-dim">
                    {e.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <a
          href={directions}
          target="_blank"
          rel="noreferrer"
          className="sona-cta mt-4 block rounded-full bg-text px-4 py-1.5 text-center text-sm font-medium transition hover:opacity-90"
        >
          Get directions
        </a>
      </div>
    </div>
  );
}

// A small embedded map showing ONE event with its venue popup open — used on the
// event page (no URL sync, no other pins).
export function EventMiniMap({ event }: { event: MusicEvent }) {
  const theme = useTheme();
  const markerRef = useRef<L.Marker>(null);
  return (
    <div className="relative isolate h-[78vh] min-h-96 overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={[event.lat, event.lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: "var(--color-surface)" }}
      >
        <TileLayer key={theme} url={tileUrl(theme)} attribution={MAP_ATTRIBUTION} />
        <Marker ref={markerRef} position={[event.lat, event.lng]} icon={pinIcon}>
          <Popup autoPan maxWidth={480} className="sona-popup">
            <VenuePopup event={event} />
          </Popup>
        </Marker>
        <AutoOpenPopup markerRef={markerRef} />
      </MapContainer>
    </div>
  );
}

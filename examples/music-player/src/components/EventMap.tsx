import "leaflet/dist/leaflet.css";
import { useEffect, useRef, type RefObject } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "routini";
import { getArtist, type MusicEvent } from "../lib/data";
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

// Card rendered inside the pin's popup (anchored to the pin, non-blocking).
// `morphPoster` shares the poster's view-transition-name so it morphs into the
// event hero; disable it where the same name already exists on the page (the
// event page's own mini-map, which sits beside the hero flyer).
export function EventCard({
  event,
  morphPoster = true,
}: {
  event: MusicEvent;
  morphPoster?: boolean;
}) {
  const lineup = event.lineup
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <div className="flex w-72 sm:w-120">
      <img
        src={event.poster}
        alt=""
        className="hidden w-48 shrink-0 self-stretch bg-surface-2 object-cover sm:block"
        style={morphPoster ? { viewTransitionName: `poster-${event.id}` } : undefined}
      />
      <div className="min-w-0 flex-1 p-4">
        <p className="pr-5 text-xs text-text-faint">
          {event.date} @ {event.venue}
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

// Opens the marker's popup once the map context is ready (mini-map only).
function AutoOpenPopup({ markerRef }: { markerRef: RefObject<L.Marker | null> }) {
  const map = useMap();
  useEffect(() => {
    markerRef.current?.openPopup();
  }, [map, markerRef]);
  return null;
}

// A small embedded map showing ONE event with its popup open — used on the event
// page (no URL sync, no other pins).
export function EventMiniMap({ event }: { event: MusicEvent }) {
  const theme = useTheme();
  const markerRef = useRef<L.Marker>(null);
  return (
    <div className="relative isolate h-96 overflow-hidden rounded-2xl border border-border sm:h-112">
      <MapContainer
        center={[event.lat, event.lng]}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: "var(--color-surface)" }}
      >
        <TileLayer key={theme} url={tileUrl(theme)} attribution={MAP_ATTRIBUTION} />
        <Marker ref={markerRef} position={[event.lat, event.lng]} icon={pinIcon}>
          <Popup autoPan maxWidth={460} className="sona-popup">
            <EventCard event={event} morphPoster={false} />
          </Popup>
        </Marker>
        <AutoOpenPopup markerRef={markerRef} />
      </MapContainer>
    </div>
  );
}

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Link, useSearchParams } from "routini";
import { events, getArtist, type MusicEvent } from "../lib/data";
import { useTheme } from "../lib/theme";

// Custom dot marker (a divIcon) so we skip Leaflet's default icon assets and
// theme it via CSS (see .sona-pin in index.css).
const pinIcon = L.divIcon({
  className: "",
  html: '<span class="sona-pin"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Fit the view to the pins so they fill the screen (zoom-to-events).
const BOUNDS = L.latLngBounds(
  events.map((e) => [e.lat, e.lng] as [number, number]),
);

// The map view (center + zoom) lives in the URL via routini's useSearchParams,
// so a refresh keeps your spot and a shared link opens on the same view.
type View = { center: [number, number]; zoom: number };

function readView(params: URLSearchParams): View | null {
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  const z = Number(params.get("z"));
  if (!params.get("lat") || !params.get("lng") || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return { center: [lat, lng], zoom: Number.isFinite(z) && z ? z : 13 };
}

// Writes the live center+zoom back to the URL on every move. `replace` keeps
// panning out of the history stack; the pathname-only store means this never
// remounts the map.
function ViewSync() {
  const [, setParams] = useSearchParams();
  const write = (map: L.Map) => {
    const c = map.getCenter();
    setParams(
      { lat: c.lat.toFixed(4), lng: c.lng.toFixed(4), z: String(map.getZoom()) },
      { replace: true },
    );
  };
  const map = useMapEvents({ moveend: () => write(map) });
  // Seed the URL with the initial (fitted) view, so /explore always carries the
  // coordinates even before you touch the map. The fit-bounds moveend fires
  // before this listener mounts, so we write it once here.
  useEffect(() => {
    write(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// Card rendered inside the pin's popup (anchored to the pin, non-blocking).
function EventCard({ event }: { event: MusicEvent }) {
  const lineup = event.lineup
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <div className="flex w-72 sm:w-[30rem]">
      <img
        src={event.poster}
        alt=""
        className="hidden w-48 shrink-0 self-stretch bg-surface-2 object-cover sm:block"
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

export default function Explore() {
  const theme = useTheme();
  const tiles =
    theme === "light"
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  // Read the URL view once for the initial render; fall back to fitting the
  // pins. ViewSync keeps the URL in sync after that.
  const [params] = useSearchParams();
  const [initialView] = useState(() => readView(params));
  const viewProps = initialView
    ? { center: initialView.center, zoom: initialView.zoom }
    : { bounds: BOUNDS, boundsOptions: { padding: [60, 60] as [number, number] } };

  return (
    <div className="relative isolate h-full w-full">
      <MapContainer
        {...viewProps}
        zoomControl={false}
        className="h-full w-full"
        style={{ background: "var(--color-surface)" }}
      >
        <ViewSync />
        <TileLayer
          key={theme}
          url={tiles}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {events.map((e) => (
          <Marker
            key={e.id}
            position={[e.lat, e.lng]}
            icon={pinIcon}
            eventHandlers={{
              mouseover: (ev) => ev.target.openPopup(),
              click: (ev) => ev.target.openPopup(),
            }}
          >
            <Popup autoPan={false} maxWidth={460} className="sona-popup">
              <EventCard event={e} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

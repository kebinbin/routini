import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useSearchParams } from "routini";
import { venues } from "../lib/data";
import { useTheme } from "../lib/theme";
import { DiscoveryHeader } from "../components/DiscoveryNav";
import { VenueEventsPopup, MAP_ATTRIBUTION, pinIcon, tileUrl } from "../components/EventMap";

// Fit the view to the venue pins so they fill the screen.
const BOUNDS = L.latLngBounds(
  venues.map((v) => [v.lat, v.lng] as [number, number]),
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
  // Seed the URL with the initial (fitted) view, so /map always carries the
  // coordinates even before you touch the map. The fit-bounds moveend fires
  // before this listener mounts, so we write it once here.
  useEffect(() => {
    write(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function Map() {
  const theme = useTheme();

  // Read the URL view once for the initial render; fall back to fitting the
  // pins. ViewSync keeps the URL in sync after that.
  const [params] = useSearchParams();
  const [initialView] = useState(() => readView(params));
  const viewProps = initialView
    ? { center: initialView.center, zoom: initialView.zoom }
    : { bounds: BOUNDS, boundsOptions: { padding: [60, 60] as [number, number] } };

  return (
    <div className="flex h-full flex-col">
      <DiscoveryHeader title="Discover events near San Juan" />
      <div className="relative isolate min-h-0 flex-1">
        <MapContainer
          {...viewProps}
          zoomControl={false}
          className="h-full w-full"
          style={{ background: "var(--color-surface)" }}
        >
        <ViewSync />
        <TileLayer key={theme} url={tileUrl(theme)} attribution={MAP_ATTRIBUTION} />
        {venues.map((v) => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={pinIcon}
            eventHandlers={{
              mouseover: (ev) => ev.target.openPopup(),
              click: (ev) => ev.target.openPopup(),
            }}
          >
            <Popup autoPan={false} maxWidth={480} className="sona-popup">
              <VenueEventsPopup venue={v} />
            </Popup>
          </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

import {
  artists,
  eventsForArtist,
  type Artist,
  type MusicEvent,
  type Song,
} from "./data";

// "Activity" is always artist-centric — a thing an artist you follow did. That
// keeps the imagery consistent (always the artist's circle) and ties every item
// back to the artist. Each carries a timestamp so the feed can sort newest-first.
export type Activity = { id: string; ts: number; when: string } & (
  | { kind: "show"; artist: Artist; event: MusicEvent }
  | { kind: "release"; artist: Artist; song: Song }
);

// Deterministic "minutes ago" from an id (FNV-1a) — stable across renders and
// well-scattered, so one artist's items don't clump together once sorted.
function minutesAgo(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % (21 * 24 * 60); // within ~21 days
}

function relTime(min: number): string {
  if (min < 60) return `${Math.max(1, min)}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

// New shows (more of these) + the occasional release, from the artists you
// follow. Sorted newest-first; the scattered timestamps interleave artists.
export function activitiesFor(following: string[]): Activity[] {
  const out: Activity[] = [];
  for (const id of following) {
    const artist = artists.find((a) => a.id === id);
    if (!artist) continue;

    // a show per event (capped so a headliner doesn't flood the feed)
    for (const event of eventsForArtist(artist.id).slice(0, 4)) {
      const aid = `${id}-show-${event.id}`;
      const ts = minutesAgo(aid);
      out.push({ id: aid, kind: "show", artist, event, ts, when: relTime(ts) });
    }

    // only ~40% of artists have a fresh release → fewer releases than shows
    const song = artist.songs[0];
    if (song && minutesAgo(`${id}-rel`) % 5 < 2) {
      const aid = `${id}-release`;
      const ts = minutesAgo(aid);
      out.push({ id: aid, kind: "release", artist, song, ts, when: relTime(ts) });
    }
  }
  return out.sort((a, b) => a.ts - b.ts); // smallest minutes-ago = newest first
}

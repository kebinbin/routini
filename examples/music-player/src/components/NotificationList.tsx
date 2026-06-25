import { Link, useParams } from "routini";
import {
  artists,
  eventsForArtist,
  type Artist,
  type MusicEvent,
  type Song,
} from "../lib/data";

// Shared notification model + feed, used by both the list and the message view.
export type Notif =
  | { id: string; kind: "show"; artist: Artist; event: MusicEvent; when: string }
  | { id: string; kind: "release"; artist: Artist; song: Song; when: string };

const RAW: Array<["show" | "release", number, string]> = [
  ["show", 0, "2h ago"],
  ["release", 2, "5h ago"],
  ["show", 5, "Yesterday"],
  ["release", 8, "Yesterday"],
  ["show", 1, "2d ago"],
  ["release", 3, "2d ago"],
  ["show", 4, "4d ago"],
  ["release", 10, "5d ago"],
  ["show", 7, "1w ago"],
  ["release", 12, "1w ago"],
  ["show", 9, "2w ago"],
];

export const FEED: Notif[] = RAW.flatMap(([kind, ai, when], i): Notif[] => {
  const artist = artists[ai];
  if (!artist) return [];
  if (kind === "show") {
    const event = eventsForArtist(artist.id)[0];
    return event ? [{ id: `n${i}`, kind: "show", artist, event, when }] : [];
  }
  const song = artist.songs[0];
  return song ? [{ id: `n${i}`, kind: "release", artist, song, when }] : [];
});

export const summary = (n: Notif) =>
  n.kind === "show" ? `is playing ${n.event.title}` : `released "${n.song.title}"`;

// The list. Reads the open id from the route to highlight it; each row links to
// /notifications/:id. Rendered by the Notifications page in both states.
export function NotificationList() {
  const { id } = useParams<{ id?: string }>();
  return (
    <>
      <h1 className="px-5 pt-6 pb-2 text-xl font-bold tracking-tight">
        Notifications
      </h1>
      <ul className="px-2 pb-4">
        {FEED.map((n) => (
          <li key={n.id}>
            <Link
              to={`/notifications/${n.id}`}
              preload="hover"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition ${
                id === n.id ? "bg-surface-2" : "hover:bg-surface-2"
              }`}
            >
              <img
                src={n.artist.avatar}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <p className="min-w-0 flex-1 truncate text-sm">
                <span className="font-semibold">{n.artist.name}</span>{" "}
                <span className="text-text-dim">{summary(n)}</span>
              </p>
              <span className="shrink-0 text-xs text-text-faint">{n.when}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

import { Link } from "routini";
import { useChunkLoaded } from "../lib/chunkLog";

// Live pill reflecting chunkLog — flips the instant the target's lazy import
// actually resolves, so preloading is visible without opening devtools.
function ChunkStatus({ chunkKey }: { chunkKey: string }) {
  const loaded = useChunkLoaded(chunkKey);
  return (
    <span
      className="pill"
      style={
        loaded
          ? { color: "var(--accent)", borderColor: "var(--accent)" }
          : undefined
      }
    >
      {loaded ? "● loaded" : "○ pending"}
    </span>
  );
}

export default function Preload() {
  return (
    <>
      <h1 className="page-title">Link preload</h1>
      <p className="page-intro">
        Warm a lazy route’s chunk <em>before</em> the click, so navigation lands
        instantly. Each pill below flips to “loaded” the moment that target’s
        chunk actually resolves — no devtools required. Each chunk is fetched
        at most once.
      </p>

      <section className="demo">
        <h2>
          preload="hover" <ChunkStatus chunkKey="hover" />
        </h2>
        <p className="note">
          Fetches on pointer-enter or keyboard focus (intent signalled). The
          pill should flip the moment you hover, before you even click.
        </p>
        <Link className="btn" to="/preload/target-hover" preload="hover">
          Hover me, then click
        </Link>
      </section>

      <section className="demo">
        <h2>
          preload="render" <ChunkStatus chunkKey="render" />
        </h2>
        <p className="note">
          Fetches as soon as the link mounts (in an idle callback) — the pill
          usually flips within a moment of this page loading, before you
          interact with anything.
        </p>
        <Link className="btn" to="/preload/target-render" preload="render">
          Already warmed
        </Link>
      </section>

      <div style={{ height: "120vh" }} className="note">
        ↓ scroll down — the viewport-preload link is below the fold, so its
        pill stays “pending” until you scroll to it ↓
      </div>

      <section className="demo">
        <h2>
          preload="viewport" <ChunkStatus chunkKey="viewport" />
        </h2>
        <p className="note">
          Fetches when the link scrolls into view (one shared
          IntersectionObserver for all viewport links). Watch the pill flip
          right as this section enters the viewport.
        </p>
        <Link className="btn" to="/preload/target-viewport" preload="viewport">
          Fetched on scroll-into-view
        </Link>
      </section>
    </>
  );
}

export default function LazyDemo() {
  return (
    <>
      <h1 className="page-title">Lazy route + loading fallback</h1>
      <p className="page-intro">
        This page is defined with <code>lazy: () =&gt; import(...)</code>, so
        its code lives in a separate chunk fetched on first visit. The import is
        artificially delayed ~700ms so you can actually see the fallback.
      </p>

      <section className="demo">
        <h2>Per-route vs global loading</h2>
        <p className="note">
          While this chunk loads, routini shows this route’s own{" "}
          <code>loading</code> node (“Loading the lazy route’s chunk…”), which
          overrides the <code>&lt;Router loading&gt;</code> global fallback. Most
          other lazy routes here have no per-route <code>loading</code>, so they
          fall back to the global one (“Loading…”).
        </p>
      </section>

      <section className="demo">
        <h2>Chunk caching</h2>
        <p className="note">
          Navigate away and back — the second visit is instant. routini caches
          the resolved lazy component (keyed by the import function), so it’s
          fetched at most once. This is why routes must be defined outside the
          component that renders <code>&lt;Router&gt;</code>.
        </p>
      </section>
    </>
  );
}

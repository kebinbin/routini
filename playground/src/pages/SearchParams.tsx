import { useSearchParams } from "routini";

export default function SearchParams() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "relevance";

  return (
    <>
      <h1 className="page-title">useSearchParams</h1>
      <p className="page-intro">
        Reactive read/write of the URL query string. Editing below updates the
        address bar; the component re-renders without remounting the route.
      </p>

      <section className="demo">
        <h2>Live query</h2>
        <div className="readout" style={{ marginBottom: "1rem" }}>
          ?{params.toString() || "(empty)"}
        </div>
        <div className="row">
          <input
            aria-label="query"
            placeholder="search query"
            value={q}
            onChange={(e) => {
              // Preserve sort while updating q. Replace so typing doesn't
              // flood the history stack.
              const next = new URLSearchParams(params);
              if (e.target.value) next.set("q", e.target.value);
              else next.delete("q");
              setParams(next, { replace: true });
            }}
          />
          <button
            onClick={() => {
              const next = new URLSearchParams(params);
              next.set("sort", sort === "relevance" ? "recent" : "relevance");
              setParams(next);
            }}
          >
            sort: {sort}
          </button>
          <button onClick={() => setParams({})}>clear</button>
        </div>
      </section>

      <section className="demo">
        <h2>Why it re-renders</h2>
        <p className="note">
          routini’s location store tracks the <em>pathname only</em>, so a
          query-only change never remounts the matched route. This hook keeps
          its own subscription, so components reading the query stay in sync
          while the rest of the tree is untouched.
        </p>
      </section>
    </>
  );
}

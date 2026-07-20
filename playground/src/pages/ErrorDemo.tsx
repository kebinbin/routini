import { useState } from "react";
import { Link } from "routini";

export default function ErrorDemo() {
  const [boom, setBoom] = useState(false);

  if (boom) {
    // Thrown during render — caught by the <Router errorFallback> boundary.
    // Check the console too: the onError callback logs it.
    throw new Error("Deliberate render error from /error");
  }

  return (
    <>
      <h1 className="page-title">Error boundary</h1>
      <p className="page-intro">
        routini wraps every route in an error boundary, so one broken page shows
        a fallback instead of white-screening the app. It catches both failed
        lazy <code>import()</code>s (stale chunks after a deploy) and render
        errors like the one below.
      </p>

      <section className="demo">
        <h2>Trigger a render error</h2>
        <p className="note">
          This calls the custom function <code>errorFallback</code> set on{" "}
          <code>&lt;Router&gt;</code>, which exposes <code>reset()</code>,{" "}
          <code>reload()</code>, and <code>isChunkError</code>. Clicking{" "}
          <code>reset</code> in the fallback retries this page in place.
        </p>
        <div className="row">
          <button className="danger" onClick={() => setBoom(true)}>
            Throw during render
          </button>
        </div>
      </section>

      <section className="demo">
        <h2>Chunk error vs render error</h2>
        <p className="note">
          The button above throws during render (<code>isChunkError: false</code>).
          Visiting a route whose lazy <code>import()</code> fails instead gives{" "}
          <code>isChunkError: true</code> — the “stale chunk after a deploy”
          case, where <code>reload()</code> is the right recovery.
        </p>
        <div className="row">
          <Link className="btn" to="/error-chunk">
            Visit a route with a failing chunk →
          </Link>
        </div>
      </section>

      <section className="demo">
        <h2>Auto-recovery on navigation</h2>
        <p className="note">
          If a page is stuck in an error, navigating to another route clears the
          boundary automatically (keyed on the current path) — no manual reset
          needed.
        </p>
      </section>
    </>
  );
}

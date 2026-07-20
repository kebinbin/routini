import { Link } from "routini";

export default function TransitionA() {
  return (
    <>
      <h1 className="page-title">View Transitions — Page A</h1>
      <p className="page-intro">
        The <code>viewTransition</code> prop wraps navigation in the platform
        View Transitions API. The colored box below has a shared{" "}
        <code>view-transition-name</code>, so it morphs between pages A and B.
      </p>

      <div
        style={{
          viewTransitionName: "morph-box",
          background: "var(--accent)",
          color: "var(--accent-fg)",
          borderRadius: 12,
          padding: "1.5rem",
          width: 180,
          fontWeight: 600,
          marginBottom: "1.5rem",
        }}
      >
        Shared element
      </div>

      <section className="demo">
        <h2>Animate forward</h2>
        <div className="row">
          <Link className="btn" to="/transitions/b" viewTransition>
            → Page B (viewTransition)
          </Link>
          <Link className="btn" to="/transitions/b">
            → Page B (no transition)
          </Link>
        </div>
        <p className="note" style={{ marginTop: "0.75rem" }}>
          After animating forward with the first link, press the browser Back
          button — routini replays the transition automatically, because it
          tagged the history entry. The second link’s edge stays instant.
        </p>
      </section>
    </>
  );
}

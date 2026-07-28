import { Link } from "routini";

export default function TransitionB() {
  return (
    <>
      <h1 className="page-title">View Transitions — Page B</h1>
      <p className="page-intro">
        Same shared box, now on Page B and restyled — the browser animates
        between the two snapshots.
      </p>

      <div
        style={{
          viewTransitionName: "morph-box",
          background: "var(--danger)",
          color: "var(--accent-fg)",
          borderRadius: 40,
          padding: "2.5rem 1.5rem",
          width: 260,
          fontWeight: 600,
          marginBottom: "1.5rem",
        }}
      >
        Shared element
      </div>

      <section className="demo">
        <h2>Animate back</h2>
        <div className="row">
          <Link className="btn" to="/transitions/a" viewTransition preload="hover">
            ← Page A (viewTransition)
          </Link>
        </div>
        <p className="note" style={{ marginTop: "0.75rem" }}>
          On a browser without the View Transitions API, every link here just
          navigates instantly — same code path, no feature checks needed.
        </p>
      </section>
    </>
  );
}

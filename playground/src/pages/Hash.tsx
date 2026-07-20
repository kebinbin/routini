import { Link } from "routini";

const SECTIONS = ["alpha", "beta", "gamma", "delta"];

export default function Hash() {
  return (
    <>
      <h1 className="page-title">Hash-anchor scrolling</h1>
      <p className="page-intro">
        Pure <code>#hash</code> links scroll natively. A <code>path#hash</code>{" "}
        link navigates, then scrolls to the target once the route commits —
        which also works on lazy routes and deep links on first load.
      </p>

      <section className="demo">
        <h2>Jump within this page</h2>
        <div className="row">
          {SECTIONS.map((s) => (
            <Link key={s} className="btn" to={`#${s}`}>
              #{s}
            </Link>
          ))}
        </div>
        <p className="note" style={{ marginTop: "0.75rem" }}>
          These are pure <code>#hash</code> links — the browser scrolls, routini
          stays out of the way. <code>scroll-padding-top</code> keeps targets
          clear of the sticky header.
        </p>
      </section>

      {SECTIONS.map((s, i) => (
        <section
          key={s}
          id={s}
          className="demo"
          style={{ minHeight: "70vh" }}
        >
          <h2 style={{ textTransform: "capitalize" }}>
            {s} <span className="pill">#{s}</span>
          </h2>
          <p className="note">Section {i + 1} of {SECTIONS.length}.</p>
          {i === SECTIONS.length - 1 && (
            <p className="note">
              A <code>path#hash</code> link from elsewhere — e.g.{" "}
              <code>/hash#alpha</code> — navigates here and scrolls to the top
              section:{" "}
              <Link to="/hash#alpha">/hash#alpha</Link>.
            </p>
          )}
        </section>
      ))}
    </>
  );
}

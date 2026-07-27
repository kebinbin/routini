import { Link } from "routini";

export default function ScrollDemo() {
  return (
    <>
      <h1 className="page-title">scrollRestoration</h1>
      <p className="page-intro">
        Enabled on this app's <code>&lt;Router&gt;</code> (window-scoped —
        this playground has no nested scroll container to demo{" "}
        <code>scrollContainer</code>; see Sona's <code>AppLayout</code> for
        that variant, which scrolls its own <code>&lt;main&gt;</code>).
      </p>

      <section className="demo">
        <h2>Try it</h2>
        <ol className="note">
          <li>Scroll down this page a bit.</li>
          <li>
            Click <Link to="/eager">Eager route</Link>, then click Back —
            you'll land back at the same scroll offset.
          </li>
          <li>
            Click a link below, then a fresh <Link to="/">Home</Link> visit
            starts at the top, same as a normal page load.
          </li>
        </ol>
      </section>

      {/* Filler content so this page is actually tall enough to scroll. */}
      {Array.from({ length: 40 }, (_, i) => (
        <p key={i} className="note">
          Line {i + 1} — scroll filler.
        </p>
      ))}
    </>
  );
}

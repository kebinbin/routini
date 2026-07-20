import { Link, navigate, useLocation } from "routini";

export default function NavigateDemo() {
  const { path, navigate: navFromHook } = useLocation();

  return (
    <>
      <h1 className="page-title">navigate() &amp; &lt;Navigate&gt;</h1>
      <p className="page-intro">
        Three ways to change the URL: a <code>&lt;Link&gt;</code> (user click),{" "}
        the <code>navigate()</code> util / <code>useLocation().navigate</code>{" "}
        (imperative), and <code>&lt;Navigate&gt;</code> (redirect on render).
      </p>

      <section className="demo">
        <h2>Imperative — navigate()</h2>
        <p className="note">
          Current path: <code>{path}</code>
        </p>
        <div className="row">
          <button onClick={() => navigate("/eager")}>
            navigate("/eager")
          </button>
          <button onClick={() => navigate("/lazy", { replace: true })}>
            navigate("/lazy", &#123; replace &#125;)
          </button>
          <button onClick={() => navFromHook("/search")}>
            useLocation().navigate("/search")
          </button>
        </div>
      </section>

      <section className="demo">
        <h2>Declarative redirect — &lt;Navigate&gt;</h2>
        <p className="note">
          <code>/redirect-me</code> renders a <code>&lt;Navigate to="/navigate"&gt;</code>,
          which replaces by default — so after the redirect, Back does{" "}
          <em>not</em> bounce you into the redirect again.
        </p>
        <div className="row">
          <Link className="btn" to="/redirect-me">
            Visit /redirect-me →
          </Link>
        </div>
      </section>

      <section className="demo">
        <h2>Link options &amp; browser fallback</h2>
        <div className="row">
          <Link className="btn" to="/eager" replace>
            &lt;Link replace&gt;
          </Link>
          <Link className="btn" to="/hash" target="_blank">
            &lt;Link target="_blank"&gt; (new tab)
          </Link>
        </div>
        <p className="note" style={{ marginTop: "0.75rem" }}>
          <code>target="_blank"</code> (and cmd/ctrl-click, or any non-primary
          click) falls back to native browser behavior instead of client-side
          navigation.
        </p>
      </section>
    </>
  );
}

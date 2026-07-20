import { Link, useParams } from "routini";

export default function Params() {
  // Typed params via the generic. Both keys are optional because this one
  // component serves /params, /params/:userId, and /params/:userId/:postId.
  const params = useParams<{ userId?: string; postId?: string }>();

  return (
    <>
      <h1 className="page-title">useParams</h1>
      <p className="page-intro">
        Path segments prefixed with <code>:</code> are captured and read with{" "}
        <code>useParams()</code>. Values are <code>decodeURIComponent</code>’d.
      </p>

      <section className="demo">
        <h2>Current params</h2>
        <div className="readout">{JSON.stringify(params, null, 2)}</div>
      </section>

      <section className="demo">
        <h2>Try different URLs</h2>
        <div className="row">
          <Link className="btn" to="/params">
            /params
          </Link>
          <Link className="btn" to="/params/42">
            /params/42
          </Link>
          <Link className="btn" to="/params/42/hello-world">
            /params/42/hello-world
          </Link>
          <Link className="btn" to="/params/caf%C3%A9">
            /params/café (encoded)
          </Link>
        </div>
        <p className="note" style={{ marginTop: "0.75rem" }}>
          The same component renders for all three route patterns — routini
          matches the most specific one and the others fall through by segment
          count.
        </p>
      </section>
    </>
  );
}

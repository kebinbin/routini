import { Link } from "routini";

export default function Home() {
  return (
    <>
      <h1 className="page-title">routini playground</h1>
      <p className="page-intro">
        A deliberately plain app that exercises every routini feature. Use the
        sidebar to jump between demos; open the browser devtools (Network +
        Console) to see lazy chunks, preloads, and <code>onError</code> logging.
      </p>

      <section className="demo">
        <h2>What’s covered</h2>
        <ul className="features">
          <li>
            <Link to="/eager">Eager routes</Link> vs{" "}
            <Link to="/lazy">lazy routes</Link> (global + per-route loading)
          </li>
          <li>
            <Link to="/params">useParams</Link> — single &amp; multiple params
          </li>
          <li>
            <Link to="/search">useSearchParams</Link> — reactive query string
          </li>
          <li>
            <Link to="/navigate">navigate() &amp; &lt;Navigate&gt;</Link> —
            imperative + declarative
          </li>
          <li>
            <Link to="/transitions/a">View Transitions</Link> — forward + back
          </li>
          <li>
            <Link to="/preload">Link preload</Link> — hover / render / viewport
          </li>
          <li>
            <Link to="/error">Error boundary</Link> — reset / reload /
            isChunkError
          </li>
          <li>
            <Link to="/hash">Hash-anchor scrolling</Link>
          </li>
          <li>
            <Link to="/jsx-route">JSX &lt;Route&gt;</Link> input form,{" "}
            <Link to="/nope">catch-all 404</Link>, and useLocation-driven active
            links (the sidebar).
          </li>
        </ul>
      </section>
    </>
  );
}

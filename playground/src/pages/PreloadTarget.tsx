import { useLocation } from "routini";

// Shared target for all three preload links. If the chunk was preloaded, this
// renders instantly on click (no loading fallback flash).
export default function PreloadTarget() {
  const { path } = useLocation();
  return (
    <>
      <h1 className="page-title">Preload target</h1>
      <p className="page-intro">
        You landed on <code>{path}</code>. If you preloaded first, there was no
        loading fallback — the chunk was already warm.
      </p>
    </>
  );
}

export default function Eager() {
  return (
    <>
      <h1 className="page-title">Eager route</h1>
      <p className="page-intro">
        This page is defined with <code>component:</code> — imported statically
        in <code>App.tsx</code>, so it ships in the main bundle and renders
        instantly with no Suspense boundary.
      </p>

      <section className="demo">
        <h2>How to tell</h2>
        <p className="note">
          Open the Network tab and navigate here — no new JS chunk is fetched,
          because this component was already in the initial bundle. Contrast
          with the lazy route, which fetches its own chunk on first visit.
        </p>
      </section>
    </>
  );
}

import { Outlet, useLocation, useParams } from "routini";
import { lazy, Suspense, useLayoutEffect } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { isLang, useT } from "../lib/i18n";

// /:lang matches any single segment, so an unknown language (e.g. /edsfsdfgsdfg)
// resolves to the lang route instead of 404ing. A router can't constrain :lang
// to "en"|"es" (per-param patterns are out of scope), so reject unknown
// languages here — one spot covers /:lang, /:lang/docs and /:lang/examples. The
// "*" and "/" routes have no lang param, so they pass straight through.
const NotFound = lazy(() => import("../pages/NotFound"));

export function Layout() {
  const t = useT();
  const { lang } = useParams<{ lang?: string }>();
  const unknownLang = lang !== undefined && !isLang(lang);

  // routini leaves scroll handling to the app (out of scope — the "right"
  // container varies per app, see examples/music-player's AppLayout for a
  // nested-<main> version of this same fix). Here the scroll container is
  // just the window, so a client-side navigation otherwise keeps whatever
  // scroll offset the previous page was at instead of starting at the top.
  // Skip when there's a hash so anchor links (e.g. the Docs sidebar) still
  // scroll to their target.
  const { path } = useLocation();
  useLayoutEffect(() => {
    // behavior: "instant" overrides the global `scroll-behavior: smooth`
    // (index.css) — that's meant for intentional anchor scrolling, not this
    // reset, which should be an instant jump like a normal page load.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [path]);
  return (
    <div className="flex min-h-screen flex-col">
      {/* Film-grain atmosphere — a fixed, non-interactive texture overlay. */}
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-60 opacity-5"
      />
      {/* Skip link: first focusable element, lets keyboard/SR users jump past
          the nav. Pure HTML — href="#main" + a focusable <main id="main"
          tabIndex={-1}> works on modern browsers. */}
      <a
        href="#main"
        className="sr-only z-50 bg-accent px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skipToContent}
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {unknownLang ? (
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}

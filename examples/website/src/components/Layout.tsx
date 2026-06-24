import { Outlet, useParams } from "routini";
import { lazy, Suspense } from "react";
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
        className="sr-only z-50 bg-accent px-4 py-2 font-mono text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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

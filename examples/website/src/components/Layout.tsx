import { Outlet } from "routini";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useT } from "../lib/i18n";

export function Layout() {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col">
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
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

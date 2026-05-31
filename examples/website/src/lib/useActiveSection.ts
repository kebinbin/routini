import { useEffect, useState } from "react";

// A heading counts as "reached" once its top scrolls within this many px of the
// viewport top — just below the sticky nav. Smaller = activates later (heading
// must be closer to the very top); larger = activates earlier.
const ACTIVE_LINE = 96;

/**
 * Tracks which section the reader is on, for sidebar highlighting: the active
 * section is the last one whose heading has scrolled up past ACTIVE_LINE. This
 * "you've reached this heading" model is predictable for tall sections. A
 * scroll listener throttled with requestAnimationFrame — negligible churn.
 *
 * Pass a stable `anchors` array (module-level constant) of section element ids
 * in document order. Shared by the Docs and Examples pages.
 */
export function useActiveSection(anchors: readonly string[]): string {
  const [active, setActive] = useState<string>(anchors[0] ?? "");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      let current = anchors[0] ?? "";
      for (const id of anchors) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_LINE) current = id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [anchors]);

  return active;
}

import { useEffect, useRef, useState } from "react";

/**
 * Bundle-size comparison, Astro-style horizontal bars.
 *
 * Sizes are minified + gzipped. Competitor figures are from bundlephobia
 * (verified 2026-05-30, versions noted below); routini is measured locally the
 * same way (terser --compress --mangle, react external, gzip) via `npm run
 * size` since it is not yet published — keep this in sync with the i18n copy.
 *
 *   React Router    react-router-dom@7.16.0   59.97 KB
 *   TanStack Router @tanstack/react-router@1.170.10  39.3 KB
 *   routini  (error boundary, View Transitions, preload, search params, scroll restoration, lazy resolver)  3.20 KB
 *
 * Measured against the full-featured routers people weigh routini against. They
 * carry much more — loaders, a data layer, type-safe routing, SSR — so they're
 * larger by nature; routini is scoped to routing (lazy, error boundary, View
 * Transitions, preload, search params) and ships an order of magnitude smaller.
 * The honest takeaway is SCOPE, not "we win": same core routing job, far less
 * framework. Ordered smallest → largest; routini is highlighted as the reference.
 */
const ENTRIES = [
  { name: "routini", kb: 3.2, label: "3.2 KB", highlight: true },
  { name: "TanStack Router", kb: 39.3, label: "39 KB" },
  { name: "React Router", kb: 59.97, label: "60 KB" },
] as const;

const MAX_KB = Math.max(...ENTRIES.map((e) => e.kb));

export function BundleChart() {
  // Bars fill in once, when the card scrolls into view — not on hover.
  // IntersectionObserver flips `visible` the first time the card is
  // ~30% in view, then disconnects (fires once, not on every scroll pass).
  // Reduced-motion starts `visible` (full width, no animation) via the
  // useState initializer — not a synchronous setState in the effect, which
  // the react-hooks/set-state-in-effect rule (rightly) flags.
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (visible) return; // already shown (reduced motion) — no observer needed
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-ink-3 bg-bone/2 p-8 md:p-10"
      style={{
        // Same theme-aware --color-glow tokens as the hero + the Highlights
        // cards, anchored top-left to match the Highlights cards' position.
        backgroundImage:
          "radial-gradient(90% 70% at 20% 0%, color-mix(in oklab, var(--color-glow) calc(var(--color-glow-alpha-1) * 0.5), transparent) 0%, transparent 70%)",
      }}
    >
      <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-bone-faint">
        Bundle size · minified + gzipped
      </p>

      <div className="flex flex-col gap-3">
        {ENTRIES.map((entry, i) => {
          // Range spans ~20×, so a purely linear width makes routini's bar
          // vanish. Floor at 8% to keep it legible — the labels carry the
          // exact figures.
          const width = Math.max((entry.kb / MAX_KB) * 100, 8);
          const highlight = "highlight" in entry && entry.highlight;

          return (
            <div key={entry.name} className="flex items-center gap-4">
              {/* routini's row is the actual point of this section — it gets
                  a visibly bigger, bolder name and number (a "hero stat"),
                  not the same weight as the competitor rows it's compared
                  against. */}
              <span
                className={[
                  "w-32 shrink-0 text-right",
                  highlight
                    ? "text-base font-bold text-bone"
                    : "text-sm text-bone-dim",
                ].join(" ")}
              >
                {entry.name}
              </span>

              {/* Flat, solid bars — no border/translucent-fill combo (which
                  read as washed out) and no grey for the competitors (warm
                  --color-ink-3 instead, matching the palette). The bar
                  fills left-to-right ONCE when the card scrolls into view
                  (the `visible` flag from the IntersectionObserver above),
                  not on hover — staggered per row for a cascading reveal.
                  No hover interaction; these are static data, not links. */}
              <div className="h-8 flex-1 overflow-hidden rounded-sm">
                <div
                  className={`h-full rounded-sm transition-[width] duration-700 ease-out ${
                    highlight ? "bg-accent" : "bg-ink-3"
                  }`}
                  style={{
                    width: visible ? `${width}%` : "0%",
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>

              <span
                className={[
                  "w-20 shrink-0 text-right font-mono tabular-nums",
                  highlight
                    ? "text-base font-bold text-accent"
                    : "text-xs text-bone-dim",
                ].join(" ")}
              >
                {entry.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

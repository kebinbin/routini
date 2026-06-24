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
 *   routini  (error boundary, View Transitions, preload, search params, lazy resolver)  2.79 KB
 *
 * Measured against the full-featured routers people weigh routini against. They
 * carry much more — loaders, a data layer, type-safe routing, SSR — so they're
 * larger by nature; routini is scoped to routing (lazy, error boundary, View
 * Transitions, preload, search params) and ships an order of magnitude smaller.
 * The honest takeaway is SCOPE, not "we win": same core routing job, far less
 * framework. Ordered smallest → largest; routini is highlighted as the reference.
 */
const ENTRIES = [
  { name: "routini", kb: 2.79, label: "2.8 KB", highlight: true },
  { name: "TanStack Router", kb: 39.3, label: "39 KB" },
  { name: "React Router", kb: 59.97, label: "60 KB" },
] as const;

const MAX_KB = Math.max(...ENTRIES.map((e) => e.kb));

export function BundleChart() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-md border border-ink-3 p-8 md:p-10">
      <p className="mb-7 font-mono text-xs uppercase tracking-[0.15em] text-bone-faint">
        Bundle size · minified + gzipped
      </p>

      <div className="flex flex-col gap-5">
        {ENTRIES.map((entry) => {
          // Range spans ~20×, so a purely linear width makes routini's bar
          // vanish. Floor at 8% to keep it legible — the labels carry the
          // exact figures.
          const width = Math.max((entry.kb / MAX_KB) * 100, 8);
          const highlight = "highlight" in entry && entry.highlight;

          return (
            <div key={entry.name} className="flex items-center gap-4">
              <span
                className={[
                  "w-32 shrink-0 text-right text-sm",
                  highlight ? "font-medium text-bone" : "text-bone-dim",
                ].join(" ")}
              >
                {entry.name}
              </span>

              {/* Each bar shows at rest (subtle). On hover a deeper fill sweeps
                  in from left to right — accent for routini, grey for the rest —
                  matching the bento's bordered, semi-transparent motifs. */}
              <div className="h-7 flex-1 overflow-hidden rounded-sm">
                <div
                  className={`relative h-full overflow-hidden rounded-sm border transition-colors ${
                    highlight
                      ? "border-accent/60 bg-accent/30 group-hover:border-accent/80"
                      : "border-ink-3 bg-bone-faint/15"
                  }`}
                  style={{ width: `${width}%` }}
                >
                  <div
                    className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 pointer-coarse:scale-x-100 ${
                      highlight ? "bg-accent/35" : "bg-bone-faint/20"
                    }`}
                  />
                </div>
              </div>

              <span
                className={[
                  "w-16 shrink-0 text-right font-mono text-sm tabular-nums",
                  highlight ? "text-accent" : "text-bone-dim",
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

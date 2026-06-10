/**
 * Bundle-size comparison, Astro-style horizontal bars.
 *
 * Sizes are minified + gzipped. Competitor figures are from bundlephobia
 * (verified 2026-05-30, versions noted below); routini is measured locally
 * the same way (terser --compress --mangle, react external, gzip) since it is
 * not yet published — keep this in sync with the figure quoted in i18n copy.
 *
 *   React Router    react-router-dom@7.16.0   59.97 KB
 *   TanStack Router @tanstack/react-router@1.170.10  39.3 KB
 *   Wouter          wouter@3.10.0             2.54 KB
 *   routini         (error boundary + view transitions)  2.26 KB
 *
 * Ordered smallest → largest so routini leads as the highlighted reference.
 */
const ENTRIES = [
  { name: "routini", kb: 2.26, label: "2.3 KB", highlight: true },
  { name: "Wouter", kb: 2.54, label: "2.5 KB" },
  { name: "TanStack Router", kb: 39.3, label: "39 KB" },
  { name: "React Router", kb: 59.97, label: "60 KB" },
] as const;

const MAX_KB = Math.max(...ENTRIES.map((e) => e.kb));

export function BundleChart() {
  return (
    <figure className="border border-ink-3 bg-ink-2 p-5">
      <figcaption className="mb-5 font-mono text-xs text-bone-faint">
        Bundle size · minified + gzipped
      </figcaption>

      <div className="flex flex-col gap-3">
        {ENTRIES.map((entry) => {
          // Range spans ~40×, so a purely linear width makes the small bars
          // vanish. Floor at 6% to keep routini/Wouter legible — the labels
          // carry the exact figures.
          const width = Math.max((entry.kb / MAX_KB) * 100, 6);
          const highlight = "highlight" in entry && entry.highlight;

          return (
            <div key={entry.name} className="flex items-center gap-3">
              <span
                className={[
                  "w-28 shrink-0 text-right text-sm",
                  highlight ? "font-medium text-bone" : "text-bone-dim",
                ].join(" ")}
              >
                {entry.name}
              </span>

              <div className="h-6 flex-1 overflow-hidden border border-ink-3 bg-ink">
                <div
                  className={`h-full ${highlight ? "bg-accent" : "bg-bone-faint"}`}
                  style={{ width: `${width}%` }}
                />
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
    </figure>
  );
}

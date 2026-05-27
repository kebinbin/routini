import { useT } from "../lib/i18n";

export function WhyRoutini() {
  const t = useT();

  // Order matters — the numbered markers (01, 02, 03, 04) follow this sequence.
  const features = [
    t.why.size,
    t.why.types,
    t.why.scope,
    t.why.config,
  ];

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.why.pretitle}
        </p>
        <h2 className="text-balance mx-auto mb-12 max-w-3xl text-center text-3xl font-medium tracking-tight text-bone md:mb-16 md:text-4xl">
          {t.why.subhead}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((feature, i) => (
            <FeatureCell
              key={feature.headline}
              index={i}
              total={features.length}
              headline={feature.headline}
              body={feature.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCell({
  index,
  total,
  headline,
  body,
}: {
  index: number;
  total: number;
  headline: string;
  body: string;
}) {
  const isLeftColumn = index % 2 === 0;
  const isLastRow = index >= total - 2;

  // Hairlines drawn per-cell so we get a clean 2x2 grid without inner borders
  // collapsing or doubling. Right border only on left column; bottom border
  // only on non-last rows. Top/left handled by the parent section.
  return (
    <div
      className={[
        "px-0 py-8 md:px-8",
        isLeftColumn ? "md:border-r md:border-ink-3" : "",
        !isLastRow ? "border-b border-ink-3 md:border-b" : "border-b border-ink-3 md:border-b-0",
        isLeftColumn ? "md:pl-0" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="block font-mono text-xs text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 text-2xl font-medium tracking-tight text-bone md:text-3xl">
        {headline}
      </h3>
      <p className="text-balance mt-4 max-w-md text-bone-dim">{body}</p>
    </div>
  );
}

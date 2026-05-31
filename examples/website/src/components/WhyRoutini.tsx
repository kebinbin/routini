import { useHomeT } from "../lib/i18n.home";
import { CodeBlock } from "./CodeBlock";
import { BundleChart } from "./BundleChart";
import type { SnippetId } from "../lib/snippets";

interface Feature {
  headline: string;
  body: string;
  /** Code snippet for the cell. `null` cells render a custom visual instead. */
  snippet: SnippetId | null;
  caption?: string;
}

export function WhyRoutini() {
  const t = useHomeT();

  // Order matters — the numbered markers (01, 02, 03, 04) follow this sequence.
  // Each cell pairs a claim with the visual that proves it.
  const features: Feature[] = [
    { ...t.why.size, snippet: null }, // 01 → bundle-size chart
    { ...t.why.types, snippet: "typedParams", caption: "Product.tsx" },
    { ...t.why.scope, snippet: "dataLayer", caption: "Product.tsx" },
    { ...t.why.config, snippet: "setup", caption: "App.tsx" },
  ];

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.why.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mb-12 max-w-3xl text-center text-3xl font-medium tracking-tight text-bone md:mb-16 md:text-4xl">
          {t.why.subhead}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((feature, i) => (
            <FeatureCell
              key={feature.headline}
              index={i}
              total={features.length}
              feature={feature}
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
  feature,
}: {
  index: number;
  total: number;
  feature: Feature;
}) {
  const isLeftColumn = index % 2 === 0;
  const isLastRow = index >= total - 2;

  // Hairlines drawn per-cell so we get a clean 2x2 grid without inner borders
  // collapsing or doubling. Right border only on left column; bottom border
  // only on non-last rows. Content sits flush to the outer container edges and
  // gets a generous gutter toward the center divisor (md:pr-12 / md:pl-12).
  return (
    <div
      className={[
        "px-0 py-12 md:py-16",
        isLeftColumn
          ? "md:border-r md:border-ink-3 md:pr-12"
          : "md:pl-12",
        !isLastRow ? "border-b border-ink-3" : "border-b border-ink-3 md:border-b-0",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="block font-mono text-xs text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 text-2xl font-medium tracking-tight text-bone md:text-3xl">
        {feature.headline}
      </h3>
      <p className="text-pretty mt-4 max-w-md text-bone-dim">{feature.body}</p>

      <div className="mt-10 min-w-0 md:mt-12">
        {feature.snippet ? (
          <CodeBlock id={feature.snippet} caption={feature.caption} />
        ) : (
          <BundleChart />
        )}
      </div>
    </div>
  );
}

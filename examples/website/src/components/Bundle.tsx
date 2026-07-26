import { useHomeT } from "../lib/i18n.home";
import { BUNDLE_SIZE_KB } from "../lib/meta";
import { BundleChart } from "./BundleChart";

// The size story gets its own section (rather than being crammed into a feature
// cell): a headline + the comparison chart, centered and given room to breathe.
export function Bundle() {
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        {/* Same eyebrow → headline → subhead hierarchy as Highlights: a
            small uppercase accent label, then a much bigger bold headline,
            then a body-sized subhead — not three similarly-weighted lines. */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {t.bundle.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mt-4 max-w-2xl text-center text-4xl font-bold leading-tight tracking-tight text-bone md:text-5xl">
          {t.bundle.headline}
        </h2>
        <p className="text-pretty mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-bone-dim sm:text-lg">
          {t.bundle.sub.replace("{size}", `${BUNDLE_SIZE_KB} KB`)}
        </p>

        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          <BundleChart />
          <p className="text-pretty ml-auto mt-7 max-w-md text-left text-xs leading-relaxed text-bone-faint">
            {t.bundle.compare}
          </p>
        </div>
      </div>
    </section>
  );
}

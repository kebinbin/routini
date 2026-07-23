import { useHomeT } from "../lib/i18n.home";
import { BundleChart } from "./BundleChart";

// The size story gets its own section (rather than being crammed into a feature
// cell): a headline + the comparison chart, centered and given room to breathe.
export function Bundle() {
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center text-base font-medium text-bone-dim sm:text-lg">
          {t.bundle.pretitle}
        </p>
        <h2 className="text-pretty mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-bone md:text-4xl">
          {t.bundle.headline}
        </h2>
        <p className="text-pretty mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-bone-dim sm:text-base">
          {t.bundle.sub}
        </p>

        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          <div className="group">
            <BundleChart />
          </div>
          <p className="text-pretty ml-auto mt-7 max-w-md text-left text-xs leading-relaxed text-bone-faint">
            {t.bundle.compare}
          </p>
        </div>
      </div>
    </section>
  );
}

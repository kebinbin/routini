import { ArrowUpRight } from "lucide-react";
import { useHomeT } from "../lib/i18n.home";

const PR_TEMPLATE_URL =
  "https://github.com/kebinbin/routini/issues/new?title=Built+with+routini%3A+";

export function BuiltWith() {
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.builtWith.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mb-12 max-w-3xl text-center text-3xl font-medium tracking-tight text-bone md:mb-16 md:text-4xl">
          {t.builtWith.intro}
        </h2>

        <ul className="grid grid-cols-1 gap-px bg-ink-3 sm:grid-cols-2 md:grid-cols-3">
          {/* Two ghost placeholders, then the live "Add yours" CTA cell. */}
          {[0, 1].map((i) => (
            <li
              key={i}
              className="aspect-4/3 flex items-center justify-center bg-ink"
            >
              <span className="font-mono text-xs text-bone-faint">
                {t.builtWith.placeholder}
              </span>
            </li>
          ))}
          <li className="aspect-4/3 bg-ink">
            <a
              href={PR_TEMPLATE_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full w-full items-center justify-center gap-2 font-mono text-sm text-bone-dim transition-colors hover:bg-ink-2 hover:text-accent"
            >
              {t.builtWith.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

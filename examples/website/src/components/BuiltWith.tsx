import { ArrowUpRight } from "lucide-react";
import { useT } from "../lib/i18n";

const PR_TEMPLATE_URL =
  "https://github.com/kebinbin/routini/issues/new?title=Built+with+routini%3A+";

export function BuiltWith() {
  const t = useT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.builtWith.pretitle}
        </p>
        <p className="text-balance mx-auto mb-12 max-w-2xl text-center text-lg text-bone-dim">
          {t.builtWith.intro}
        </p>

        <ul className="grid grid-cols-1 gap-px bg-ink-3 sm:grid-cols-2 md:grid-cols-4">
          {/* Three ghost placeholders, then the live "Add yours" CTA cell. */}
          {[0, 1, 2].map((i) => (
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

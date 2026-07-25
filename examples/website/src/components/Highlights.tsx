import { Route, Feather, Rocket } from "lucide-react";
import { useHomeT } from "../lib/i18n.home";

// Paired with t.highlights.items by index: just routing / effortless / fast.
// Clean, larger, accent-colored icons (a different register from the bento's
// animated diagrams). Static — no hover.
const ICONS = [Route, Feather, Rocket];

export function Highlights() {
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        {/* Eyebrow — small, uppercase, accent-colored, letter-spaced. Clearly
            a step above the headline in the hierarchy instead of reading as
            just another muted paragraph at nearly headline size. */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {t.highlights.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mt-4 max-w-2xl text-center text-4xl font-bold leading-tight tracking-tight text-bone md:text-5xl">
          {t.highlights.heading}
        </h2>
        <p className="text-pretty mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-bone-dim sm:text-lg">
          {t.highlights.sub}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-16">
          {t.highlights.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={item.name}
                className="flex flex-col rounded-2xl border border-ink-3 bg-bone/2 p-9"
                style={{
                  // Same theme-aware --color-glow tokens as the hero's
                  // ambient gradient (index.css) — a small top-anchored echo
                  // of it, not a separate one-off color. calc() halves the
                  // alpha locally (a card-scale glow should be much fainter
                  // than the full-hero one) without touching the shared
                  // --color-glow-alpha-1 token the hero itself still uses.
                  backgroundImage:
                    "radial-gradient(90% 70% at 20% 0%, color-mix(in oklab, var(--color-glow) calc(var(--color-glow-alpha-1) * 0.5), transparent) 0%, transparent 70%)",
                }}
              >
                <Icon className="h-10 w-10 text-accent" strokeWidth={1} />
                <h3 className="mt-7 text-lg font-semibold text-bone">
                  {item.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-bone-dim">
                  {item.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

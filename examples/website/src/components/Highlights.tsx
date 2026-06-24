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
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.highlights.pretitle}
        </p>
        <h2 className="text-pretty mx-auto max-w-2xl text-center text-3xl font-medium tracking-tight text-bone md:text-4xl">
          {t.highlights.heading}
        </h2>
        <p className="text-pretty mx-auto mt-6 max-w-2xl text-center text-lg text-bone-dim">
          {t.highlights.sub}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-px bg-ink-3 sm:grid-cols-3 md:mt-16">
          {t.highlights.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li key={item.name} className="flex flex-col bg-ink p-8">
                <Icon className="h-10 w-10 text-accent" strokeWidth={1} />
                <h3 className="mt-6 font-medium text-bone">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim">
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

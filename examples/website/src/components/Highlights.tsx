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
        <p className="mb-4 text-center text-base font-medium text-bone-dim sm:text-lg">
          {t.highlights.pretitle}
        </p>
        <h2 className="text-pretty mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-bone md:text-4xl">
          {t.highlights.heading}
        </h2>
        <p className="text-pretty mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-bone-dim sm:text-base">
          {t.highlights.sub}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-16">
          {t.highlights.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={item.name}
                className="flex flex-col rounded-2xl bg-bone/2 p-8 transition-colors duration-300 hover:bg-bone/5"
              >
                <Icon className="h-10 w-10 text-accent" strokeWidth={1} />
                <h3 className="mt-6 font-semibold text-bone">{item.name}</h3>
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

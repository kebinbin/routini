import { Link } from "routini";
import { langPath, useLang } from "../lib/i18n";
import { useHomeT } from "../lib/i18n.home";

export function ApiAtAGlance() {
  const lang = useLang();
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.api.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mb-12 max-w-3xl text-center text-3xl font-medium tracking-tight text-bone md:mb-16 md:text-4xl">
          {t.api.intro}
        </h2>

        <ul className="grid grid-cols-1 gap-x-12 gap-y-0 md:grid-cols-2">
          {t.api.entries.map((entry) => (
            <li
              key={entry.anchor}
              className="border-b border-ink-3 py-5 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
            >
              <Link
                to={`${langPath(lang, "/docs")}#${entry.anchor}`}
                className="group flex flex-col gap-2"
              >
                <code className="font-mono text-base text-bone group-hover:text-accent">
                  {entry.name}
                </code>
                <span className="text-sm text-bone-dim">{entry.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

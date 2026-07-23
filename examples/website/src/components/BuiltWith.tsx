import { ArrowUpRight } from "lucide-react";
import { Link } from "routini";
import { langPath, useLang } from "../lib/i18n";
import { useHomeT } from "../lib/i18n.home";

const PR_TEMPLATE_URL =
  "https://github.com/kebinbin/routini/issues/new?title=Built+with+routini%3A+";

export function BuiltWith() {
  const lang = useLang();
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center text-base font-medium text-bone-dim sm:text-lg">
          {t.builtWith.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mb-12 max-w-3xl text-center text-3xl font-bold tracking-tight text-bone md:mb-16 md:text-4xl">
          {t.builtWith.intro}
        </h2>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Sona — the routini showcase demo. Links to its case-study page
              (examples/sona), not straight out to the live app — that page
              has its own Live demo + Source links plus the write-up. */}
          <li className="group">
            <Link
              to={langPath(lang, "examples/sona")}
              preload="viewport"
              viewTransition
              className="block"
            >
              <img
                src="/built-with/sona.webp"
                alt="Sona.io — a music-discovery app built with routini"
                className="aspect-video w-full rounded-lg object-cover transition-opacity group-hover:opacity-80"
                style={{ viewTransitionName: "sona-shot" }}
              />
              <div className="flex items-center justify-between gap-2 py-3">
                <span className="text-sm text-bone">Sona.io</span>
                <ArrowUpRight className="h-4 w-4 text-bone-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
            </Link>
          </li>
          {/* One ghost placeholder, then the live "Add yours" CTA cell. */}
          <li className="aspect-video flex items-center justify-center rounded-2xl bg-bone/2">
            <span className="text-xs text-bone-faint">
              {t.builtWith.placeholder}
            </span>
          </li>
          <li className="aspect-video overflow-hidden rounded-2xl bg-bone/2">
            <a
              href={PR_TEMPLATE_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full w-full items-center justify-center gap-2 text-sm text-bone-dim transition-colors hover:bg-bone/5 hover:text-accent"
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

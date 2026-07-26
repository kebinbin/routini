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
        {/* Same eyebrow → headline hierarchy as every other section on the
            page: text-xs uppercase tracking-[0.2em] accent eyebrow, then a
            much bigger bold headline. */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {t.builtWith.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mt-4 max-w-3xl text-center text-4xl font-bold leading-tight tracking-tight text-bone md:text-5xl">
          {t.builtWith.intro}
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
          {/* Sona — the routini showcase demo. The image sits inside a
              device BEZEL (a glass frame, like a screenshot on a real
              device) — not a bordered card wrapping image + text together.
              The caption lives outside/below the bezel, as its own row. */}
          <li className="group">
            <Link
              to={langPath(lang, "examples/sona")}
              preload="viewport"
              viewTransition
              className="block"
            >
              <div
                className="bezel relative overflow-hidden rounded-2xl border bg-bone/6 p-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                style={{ viewTransitionName: "sona-shot" }}
              >
                <img
                  src="/built-with/sona.webp"
                  alt="Sona.io — a music-discovery app built with routini"
                  className="aspect-video w-full rounded-lg object-cover transition-opacity group-hover:opacity-80"
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-3 px-3">
                <span className="text-sm font-medium text-bone">Sona.io</span>
                <ArrowUpRight className="h-4 w-4 text-bone-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
            </Link>
          </li>
          {/* Ghost placeholder — a dashed border marks it as an empty slot,
              distinct from the solid-bordered real/actionable cards. */}
          <li className="aspect-video flex items-center justify-center rounded-2xl border border-dashed border-ink-3 bg-bone/2">
            <span className="text-xs text-bone-faint">
              {t.builtWith.placeholder}
            </span>
          </li>
          {/* "Add yours" is a real action, so it gets the same solid-border +
              accent-on-hover treatment as the bento's link cards. */}
          <li className="aspect-video overflow-hidden rounded-2xl border border-ink-3 bg-bone/2 transition-colors duration-300 hover:border-accent/25">
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

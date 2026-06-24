import { Link } from "routini";
import { langPath, useLang, useT } from "../lib/i18n";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { GithubMark } from "./GithubMark";

export function Nav() {
  const lang = useLang();
  const t = useT();

  return (
    <header className="sticky top-0 z-10 border-b border-ink-3 bg-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to={langPath(lang)}
          viewTransition
          className="group inline-flex items-center gap-2.5 font-mono text-sm tracking-tight text-bone hover:text-accent"
          aria-label="routini home"
        >
          <Logo className="h-5 w-auto" />
          <span>routini</span>
          <span className="text-bone-faint">v0.1.0</span>
        </Link>

        <nav className="flex items-center gap-6 font-mono text-sm text-bone-dim">
          {/* render, not hover: warm both primary routes during idle on load —
              instant first click, and it works on touch (hover never fires). */}
          <Link
            to={langPath(lang, "/docs")}
            preload="render"
            viewTransition
            className="hover:text-bone"
          >
            {t.nav.docs}
          </Link>
          <Link
            to={langPath(lang, "/examples")}
            preload="render"
            viewTransition
            className="hover:text-bone"
          >
            {t.nav.examples}
          </Link>
          <a
            href="https://github.com/kebinbin/routini"
            target="_blank"
            rel="noreferrer"
            className="hover:text-bone"
            aria-label={t.nav.github}
          >
            <GithubMark className="h-4 w-4" />
          </a>

          {/* Subtle divider between content links and chrome controls */}
          <span aria-hidden className="h-4 w-px bg-ink-3" />

          <LangSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

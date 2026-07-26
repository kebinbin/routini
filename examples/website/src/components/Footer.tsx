import { Logo } from "./Logo";
import { useT } from "../lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-32 border-t border-ink-3">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10 text-sm text-bone-faint md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="h-4 w-auto text-bone-faint" />
          <p>
            {t.footer.builtWith} <span className="text-accent">routini</span>{" "}
            · v0.1.0 · MIT · © 2026
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://kevincastillo.io"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-bone-dim"
          >
            {t.footer.builtBy} Kevin Castillo
          </a>
          <a
            href="https://github.com/kebinbin/routini"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-bone-dim"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

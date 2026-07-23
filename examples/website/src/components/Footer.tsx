import { useT } from "../lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-32 border-t border-ink-3">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-bone-faint md:flex-row md:items-center md:justify-between">
        <p>
          {t.footer.builtWith} <span className="text-accent">routini</span> ·
          MIT
        </p>
        <p>
          <a
            href="https://github.com/kebinbin/routini"
            target="_blank"
            rel="noreferrer"
            className="hover:text-bone-dim"
          >
            github.com/kebinbin/routini
          </a>
        </p>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "routini";
import { LANGS, useLang, type Lang } from "../lib/i18n";

/**
 * Replaces the lang segment in the current URL — e.g. on /en/docs, picking "es"
 * navigates to /es/docs. Falls back to /{lang} if the path doesn't start with a lang.
 */
function pathForLang(current: string, lang: Lang): string {
  const parts = current.split("/").filter(Boolean);
  if (parts.length === 0) return `/${lang}`;
  parts[0] = lang;
  return `/${parts.join("/")}`;
}

export function LangSwitcher() {
  const active = useLang();
  const { path } = useLocation();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center font-mono text-xs uppercase tracking-wider"
    >
      {LANGS.map((lang, i) => (
        <span key={lang} className="flex items-center">
          {i > 0 && <span className="px-1.5 text-bone-faint">/</span>}
          <Link
            to={pathForLang(path, lang)}
            viewTransition
            aria-current={lang === active ? "true" : undefined}
            className={
              lang === active
                ? "text-bone"
                : "text-bone-faint hover:text-bone-dim"
            }
          >
            {lang}
          </Link>
        </span>
      ))}
    </div>
  );
}

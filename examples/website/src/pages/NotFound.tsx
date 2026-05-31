import { Link } from "routini";
import { langPath, useLang } from "../lib/i18n";
import { useNotFoundT } from "../lib/i18n.notFound";

export default function NotFound() {
  const lang = useLang();
  const t = useNotFoundT();

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
        {t.notFound.pretitle}
      </p>
      <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
        {t.notFound.title}
      </h1>
      <p className="text-pretty mt-6 text-bone-dim">{t.notFound.sub}</p>
      <Link
        to={langPath(lang)}
        className="mt-8 inline-flex bg-accent px-5 py-3 font-mono text-sm text-white hover:bg-accent-dim"
      >
        {t.notFound.home}
      </Link>
    </section>
  );
}

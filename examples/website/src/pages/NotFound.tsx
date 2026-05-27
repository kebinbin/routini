import { Link } from "routini";
import { langPath, useLang, useT } from "../lib/i18n";

export default function NotFound() {
  const lang = useLang();
  const t = useT();

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
        {t.notFound.pretitle}
      </p>
      <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
        {t.notFound.title}
      </h1>
      <p className="mt-6 text-bone-dim">{t.notFound.sub}</p>
      <Link
        to={langPath(lang)}
        className="mt-8 inline-flex bg-accent px-5 py-3 font-mono text-sm text-white hover:bg-accent-dim"
      >
        {t.notFound.home}
      </Link>
    </section>
  );
}

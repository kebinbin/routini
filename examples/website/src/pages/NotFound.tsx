import { Link } from "routini";
import { langPath, useLang } from "../lib/i18n";
import { useNotFoundT } from "../lib/i18n.notFound";
import { usePageTitle } from "../lib/usePageTitle";

export default function NotFound() {
  const lang = useLang();
  const t = useNotFoundT();
  usePageTitle(`${t.notFound.pretitle} · routini`);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-6 text-base font-medium text-bone-dim sm:text-lg">{t.notFound.pretitle}</p>
      <h1 className="text-balance text-4xl font-black tracking-tight md:text-5xl">
        {t.notFound.title}
      </h1>
      <p className="text-pretty mt-6 text-sm leading-relaxed text-bone-dim sm:text-base">
        {t.notFound.sub}
      </p>
      <Link
        to={langPath(lang)}
        className="mt-8 inline-flex rounded-full bg-bone px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
      >
        {t.notFound.home}
      </Link>
    </section>
  );
}

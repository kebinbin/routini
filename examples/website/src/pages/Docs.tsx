import { useT } from "../lib/i18n";

export default function Docs() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
        {t.docs.pretitle}
      </p>
      <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
        {t.docs.title}
      </h1>
      <p className="mt-6 text-bone-dim">{t.docs.sub}</p>
    </section>
  );
}

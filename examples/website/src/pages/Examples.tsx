import { useT } from "../lib/i18n";

export default function Examples() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
        {t.examples.pretitle}
      </p>
      <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
        {t.examples.title}
      </h1>
      <p className="mt-6 text-bone-dim">{t.examples.sub}</p>
    </section>
  );
}

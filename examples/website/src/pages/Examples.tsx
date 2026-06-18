import { CodeBlock } from "../components/CodeBlock";
import { useExamplesT } from "../lib/i18n.examples";
import { usePageTitle } from "../lib/usePageTitle";
import { snippets, type SnippetId } from "../lib/snippets";

// Recipe order + the snippet each one shows. Titles/bodies are translated in
// i18n.examples (keyed by the same anchor); section ids keep deep links working.
const RECIPES: { anchor: string; snippet: SnippetId }[] = [
  { anchor: "basic-app", snippet: "setup" },
  { anchor: "code-split", snippet: "codeSplit" },
  { anchor: "preload", snippet: "preload" },
  { anchor: "view-transitions", snippet: "viewTransitions" },
  { anchor: "shared-element", snippet: "sharedElement" },
  { anchor: "error-handling", snippet: "errorHandling" },
  { anchor: "typed-params", snippet: "dataLayer" },
  { anchor: "search-params", snippet: "searchParams" },
  { anchor: "active-nav", snippet: "activeNav" },
  { anchor: "redirects-404", snippet: "redirects404" },
  { anchor: "programmatic-nav", snippet: "navigateFromCode" },
];

export default function Examples() {
  const t = useExamplesT();
  const recipes = t.examples.recipes as Record<
    string,
    { title: string; body: string }
  >;
  usePageTitle(`${t.examples.title} · routini`);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <header className="mb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.examples.pretitle}
        </p>
        <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
          {t.examples.title}
        </h1>
        <p className="text-pretty mt-6 text-lg text-bone-dim">
          {t.examples.sub}
        </p>
      </header>

      {/* Recipes */}
      <div className="flex flex-col gap-20 md:gap-24">
        {RECIPES.map((r) => {
          const recipe = recipes[r.anchor];
          return (
            <section key={r.anchor} id={r.anchor}>
              <h2 className="mb-4 text-2xl font-medium tracking-tight text-bone md:text-3xl">
                {recipe?.title}
              </h2>
              <p className="text-pretty mb-7 leading-relaxed text-bone-dim">
                {recipe?.body}
              </p>
              <CodeBlock id={r.snippet} copyText={snippets[r.snippet]} />
            </section>
          );
        })}
      </div>

      {/* Full apps gallery */}
      <section className="mt-24 border-t border-ink-3 pt-16">
        <h2 className="mb-4 text-2xl font-medium tracking-tight text-bone md:text-3xl">
          {t.examples.appsTitle}
        </h2>
        <p className="text-pretty mb-10 leading-relaxed text-bone-dim">
          {t.examples.appsIntro}
        </p>

        <ul className="grid grid-cols-1 gap-px bg-ink-3 sm:grid-cols-2">
          {t.examples.apps.map((app) => (
            <li key={app.name} className="flex flex-col gap-3 bg-ink p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-base text-bone">{app.name}</h3>
                <span className="shrink-0 border border-ink-3 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-bone-faint">
                  {t.examples.comingSoon}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-bone-dim">
                {app.blurb}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

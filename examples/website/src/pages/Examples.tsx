import { ArrowUpRight } from "lucide-react";
import { Link } from "routini";
import { CodeBlock } from "../components/CodeBlock";
import { langPath, useLang } from "../lib/i18n";
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

// Full-apps gallery — same card look as the home page's Built With section
// (image + name, no blurb/links text). Names are translated (i18n.examples
// `apps`); links are code, not translated. Apps without an `image` render as
// a plain "coming soon" cell, same as Built With's ghost placeholder.
const APPS: { id: string; image?: string; caseStudy?: string }[] = [
  { id: "sona", image: "/built-with/sona.webp", caseStudy: "examples/sona" },
  { id: "skeleton" },
];

export default function Examples() {
  const lang = useLang();
  const t = useExamplesT();
  const recipes = t.examples.recipes as Record<
    string,
    { title: string; body: string }
  >;
  const apps = t.examples.apps as Record<string, { name: string }>;
  usePageTitle(`${t.examples.title} · routini`);

  return (
    <div className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
      <header className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bone-faint">
          {t.examples.pretitle}
        </p>
        <h1 className="text-balance mt-3 text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
          {t.examples.title}
        </h1>
        <p className="text-pretty mt-6 text-lg leading-relaxed text-bone-dim">
          {t.examples.sub}
        </p>
      </header>

      {/* Recipes */}
      <div className="flex flex-col gap-20 md:gap-24">
        {RECIPES.map((r) => {
          const recipe = recipes[r.anchor];
          return (
            <section key={r.anchor} id={r.anchor}>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-bone">
                {recipe?.title}
              </h2>
              <p className="text-pretty mb-7 leading-relaxed text-bone-dim">
                {recipe?.body}
              </p>
              <CodeBlock id={r.snippet} copyText={snippets[r.snippet]} />
            </section>
          );
        })}

        {/* Full apps gallery — same heading style + container width as the
            recipes above, same card look as the home page's Built With
            section. */}
        <section id="full-apps">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-bone">
            {t.examples.appsTitle}
          </h2>
          <p className="text-pretty mb-7 leading-relaxed text-bone-dim">
            {t.examples.appsIntro}
          </p>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {APPS.map((app) => {
                const content = apps[app.id];
                if (!app.image) {
                  return (
                    <li
                      key={app.id}
                      className="aspect-video flex items-center justify-center rounded-2xl bg-bone/2"
                    >
                      <span className="text-xs text-bone-faint">
                        {content?.name} — {t.examples.comingSoon}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={app.id} className="group">
                    <Link
                      to={app.caseStudy ? langPath(lang, app.caseStudy) : "#"}
                      preload="viewport"
                      viewTransition
                      className="block"
                    >
                      <img
                        src={app.image}
                        alt={content?.name ?? ""}
                        className="aspect-video w-full rounded-lg object-cover transition-opacity group-hover:opacity-80"
                        style={{ viewTransitionName: "sona-shot" }}
                      />
                      <div className="flex items-center justify-between gap-2 py-3">
                        <span className="text-sm text-bone">
                          {content?.name}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-bone-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </div>
                    </Link>
                  </li>
                );
            })}
          </ul>
        </section>
      </div>
      </div>
    </div>
  );
}

import { CodeBlock } from "../components/CodeBlock";
import { useSonaCaseStudyT } from "../lib/i18n.sonaCaseStudy";
import { usePageTitle } from "../lib/usePageTitle";
import { snippets } from "../lib/snippets";

const SONA_LIVE_URL = "https://music-player-chi-pied.vercel.app";
const SONA_SOURCE_URL =
  "https://github.com/kebinbin/routini/tree/main/examples/music-player";

// Section order + which real Sona excerpt each one shows. Prose is
// translated in i18n.sonaCaseStudy (keyed by the same id); the snippets
// themselves are code, not translated (see snippets.ts).
const SECTIONS = [
  { id: "routes", snippet: "sonaRoutes", caption: "src/App.tsx" },
  { id: "layout", snippet: "sonaLayout", caption: "src/components/AppLayout.tsx" },
  {
    id: "preloadVt",
    snippet: "sonaPreloadVt",
    caption: "src/components/ArtistViews.tsx",
  },
  { id: "params", snippet: "sonaParams", caption: "src/pages/Artist.tsx" },
  {
    id: "searchParams",
    snippet: "sonaSearchParams",
    caption: "src/pages/Map.tsx",
  },
  { id: "redirect", snippet: "sonaRedirect", caption: "src/App.tsx" },
] as const;

export default function SonaCaseStudy() {
  const t = useSonaCaseStudyT();
  const s = t.sonaCaseStudy;
  usePageTitle(`${s.title} · routini`);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <header className="mb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {s.pretitle}
        </p>
        <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
          {s.title}
        </h1>
        <p className="text-pretty mt-6 text-lg text-bone-dim">{s.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={SONA_LIVE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-bone px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            {s.liveDemo}
          </a>
          <a
            href={SONA_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink-3 px-4 py-2 text-sm font-medium text-bone-dim transition-colors hover:text-bone"
          >
            {s.viewSource}
          </a>
        </div>
      </header>

      <a
        href={SONA_LIVE_URL}
        target="_blank"
        rel="noreferrer"
        className="mb-16 block md:mb-24"
      >
        <img
          src="/built-with/sona.webp"
          alt="Sona.io — a music-discovery app built with routini"
          className="aspect-video w-full rounded-lg object-cover"
          style={{ viewTransitionName: "sona-shot" }}
        />
      </a>

      <div className="flex flex-col gap-20 md:gap-24">
        {SECTIONS.map(({ id, snippet, caption }) => {
          const section = s.sections[id];
          return (
            <section key={id} id={id}>
              <h2 className="mb-4 text-2xl font-medium tracking-tight text-bone md:text-3xl">
                {section.title}
              </h2>
              <p className="text-pretty mb-7 leading-relaxed text-bone-dim">
                {section.body}
              </p>
              <CodeBlock
                id={snippet}
                caption={caption}
                copyText={snippets[snippet]}
              />
            </section>
          );
        })}

        {/* Resilience closes the page — deliberately no snippet: the point is
            that Sona wrote zero code to get this protection. */}
        <section id="resilience">
          <h2 className="mb-4 text-2xl font-medium tracking-tight text-bone md:text-3xl">
            {s.sections.resilience.title}
          </h2>
          <p className="text-pretty leading-relaxed text-bone-dim">
            {s.sections.resilience.body}
          </p>
        </section>
      </div>
    </div>
  );
}

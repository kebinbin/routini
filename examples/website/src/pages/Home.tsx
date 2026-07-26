import { Link } from "routini";
import { version } from "routini/package.json";
import { ArrowRight } from "lucide-react";
import HIGHLIGHTED from "virtual:highlighted-snippets";
import { InstallCommand } from "../components/InstallCommand";
import { Logo } from "../components/Logo";
import { Highlights } from "../components/Highlights";
import { Bundle } from "../components/Bundle";
import { BuiltInV1 } from "../components/BuiltInVariants";
import { BuiltWith } from "../components/BuiltWith";
import { langPath, useLang } from "../lib/i18n";
import { useHomeT } from "../lib/i18n.home";
import { usePageTitle } from "../lib/usePageTitle";

// A framed "console" window carrying the core setup snippet — the hero's
// product visual (dogfooding the build-time Shiki highlighting).
function HeroCodeWindow() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-3 bg-ink-2 text-left shadow-[0_40px_100px_-40px_rgba(0,0,0,0.75)]">
      <div className="flex items-center gap-2 border-b border-ink-3 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />
        <span className="ml-2 font-mono text-xs text-bone-faint">App.tsx</span>
      </div>
      <div
        className="code-block-shiki overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: HIGHLIGHTED.setup }}
      />
    </div>
  );
}

export default function Home() {
  const lang = useLang();
  const t = useHomeT();
  usePageTitle("routini · a tiny React router");

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Rotating a background painted directly on the section would spin
            the section's own box/content too — not what we want. Instead the
            gradient lives on its own square, made much larger than the glow's
            visible radius (480x350px) and than the viewport, so once rotated
            its own edges sit far outside the visible area. The section's
            overflow-hidden clips any excess; because the gradient has already
            faded to fully transparent long before reaching the square's own
            boundary, that clip never shows a seam. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[2400px] w-[2400px]"
          style={{
            transform: "translate(-64%, -57%) rotate(11deg)",
            // Same shape/position/size in both themes; --color-glow and
            // --color-glow-alpha-1/2 (index.css) are the only tokens that
            // change per theme — light mode needs both a darker color and a
            // higher alpha for the same visual weight against a bright page.
            background:
              "radial-gradient(ellipse 1250px 380px at center, color-mix(in oklab, var(--color-glow) var(--color-glow-alpha-1), transparent) 0%, color-mix(in oklab, var(--color-glow) var(--color-glow-alpha-2), transparent) 45%, transparent 75%)",
          }}
        />
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-20 pt-28 text-center md:pb-28 md:pt-40">
          {/* Animated logo — restored above the headline; the transparent
              hollow-node fix makes it render correctly over this gradient. */}
          <div className="rise mb-6" style={{ animationDelay: "0ms" }}>
            <Logo animated className="h-10 w-auto text-bone-dim md:h-14" />
          </div>

          {/* Badge pill */}
          <div
            className="rise inline-flex items-center gap-2 rounded-full border border-ink-3 bg-ink-2/60 px-3.5 py-1.5 text-xs font-medium text-bone-dim backdrop-blur"
            style={{ animationDelay: "70ms" }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            3.2 KB · v{version} · React 18+
          </div>

          {/* Headline — single line, single color */}
          <h1
            className="rise text-balance mt-8 text-5xl font-semibold leading-[0.98] tracking-tight text-bone sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "140ms" }}
          >
            {t.home.title1} {t.home.title2}
          </h1>

          <p
            className="rise text-balance mt-7 max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg"
            style={{ animationDelay: "210ms" }}
          >
            {t.home.sub}
          </p>

          {/* CTA — accent button + the install command beside it */}
          <div
            className="rise mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              to={langPath(lang, "/docs")}
              viewTransition
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
            >
              {t.home.ctaDocs}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <InstallCommand />
          </div>

          {/* Product visual — the framed console */}
          <div
            className="rise mt-14 w-full max-w-2xl md:mt-16"
            style={{ animationDelay: "350ms" }}
          >
            <HeroCodeWindow />
          </div>
        </div>
      </section>

      <Highlights />
      <Bundle />

      {/* Bento redesign (work in progress). Once settled, fold BuiltInV1 back
          into BuiltIn.tsx and delete BuiltInVariants.tsx. */}
      {/* ONE glow, shared across both sections, fixed for real this time:
          - The OUTER wrapper (isolate + overflow-hidden) spans BOTH
            BuiltInV1 and BuiltWith. `isolate` here means the glow's
            -z-10 resolves within THIS shared context, so it paints
            behind ALL of both sections' card content (not just one) —
            without isolate here, an inner-only isolate had trapped the
            glow to its own tiny box, which is why it wasn't reaching
            BuiltWith. `overflow-hidden` here (which the previous attempt
            was missing entirely) stops the oversized glow square from
            extending past the end of this wrapper's actual content — with
            no clip anywhere, it was inflating the page's scroll height
            past the real content, which is what pushed the footer down.
          - The INNER seam div (plain `relative`, deliberately NOT
            isolated) sits in the flow exactly between the two sections
            with no height of its own, so its top-1/2 anchor is the exact
            boundary point regardless of either section's actual height —
            fixing the earlier "top-1/2 of their combined height" bug,
            which skewed toward the much-taller bento section. */}
      <div className="relative isolate overflow-hidden">
        <BuiltInV1 />
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[2400px] w-[2400px]"
            style={{
              transform: "translate(-64%, -57%) rotate(11deg)",
              background:
                "radial-gradient(ellipse 1250px 380px at center, color-mix(in oklab, var(--color-glow) var(--color-glow-alpha-1), transparent) 0%, color-mix(in oklab, var(--color-glow) var(--color-glow-alpha-2), transparent) 45%, transparent 75%)",
            }}
          />
        </div>
        <BuiltWith />

        {/* A second glow, anchored to THIS wrapper's own bottom-right corner
            — which is exactly BuiltWith's bottom-right corner, since
            BuiltWith is the wrapper's last child. It lives inside the same
            outer overflow-hidden boundary as the first glow, so it can't
            bleed past the wrapper's edge into the Footer (a separate,
            page-shared component rendered outside this wrapper entirely,
            in Layout.tsx) — no risk of the footer cutting it off. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[2400px] w-[2400px]"
          style={{
            transform: "translate(35%, 35%) rotate(11deg)",
            background:
              "radial-gradient(ellipse 1250px 380px at center, color-mix(in oklab, var(--color-glow) var(--color-glow-alpha-1), transparent) 0%, color-mix(in oklab, var(--color-glow) var(--color-glow-alpha-2), transparent) 45%, transparent 75%)",
          }}
        />
      </div>
    </>
  );
}

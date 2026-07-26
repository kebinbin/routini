import { useState, type ReactNode, type CSSProperties } from "react";
import { Search } from "lucide-react";
import { Link } from "routini";
import { langPath, useLang } from "../lib/i18n";
import { useHomeT } from "../lib/i18n.home";

/**
 * Redesigned "Built in" bento (work in progress). Floating cards on the page
 * background: cards rest just barely lifted off the page (bg-ink-hover) and
 * warm a subtle step further on hover (bg-ink-2) — the same subtle delta Sona
 * uses on notification hover. The illustrations draw their single accent from
 * a `--viz-accent` CSS variable (the brand orange), used only as small crisp
 * touches over otherwise neutral ink/bone.
 *
 * Once settled, fold BuiltInV1 back into BuiltIn.tsx and delete this file.
 */

// ---------------------------------------------------------------------------
// Shared accent helpers — every visual draws its ONE accent element from
// `--viz-accent`, so a variant only sets that variable to recolor them all.
// Neutrals come from the site palette (ink / bone) exclusively.
// ---------------------------------------------------------------------------
const A_TEXT = "text-[var(--viz-accent)]";
const A_BORDER = "border-[color-mix(in_oklab,var(--viz-accent)_55%,transparent)]";
const A_FILL = "bg-[color-mix(in_oklab,var(--viz-accent)_16%,transparent)]";
const A_FILL_SOFT = "bg-[color-mix(in_oklab,var(--viz-accent)_9%,transparent)]";
const A_DOT = "bg-[var(--viz-accent)]";

// Variant-prefixed forms as COMPLETE literals — Tailwind v4 scans source text
// for whole class names and can't resolve `group-hover:${A_BORDER}`, so the
// "on hover / on touch" accent states must appear spelled out here.
const A_BORDER_ON =
  "group-hover:border-[color-mix(in_oklab,var(--viz-accent)_55%,transparent)] pointer-coarse:border-[color-mix(in_oklab,var(--viz-accent)_55%,transparent)]";
const A_FILL_ON =
  "group-hover:bg-[color-mix(in_oklab,var(--viz-accent)_16%,transparent)] pointer-coarse:bg-[color-mix(in_oklab,var(--viz-accent)_16%,transparent)]";
const A_TEXT_ON =
  "group-hover:text-[var(--viz-accent)] pointer-coarse:text-[var(--viz-accent)]";
const A_DOT_ON =
  "group-hover:bg-[var(--viz-accent)] pointer-coarse:bg-[var(--viz-accent)]";

// Neutral surfaces for chips/frames drawn on top of a card.
const CHIP = "border border-ink-3 bg-ink-2";

// ---------------------------------------------------------------------------
// Declarative ⇄ imperative — the one interactive visual. Hover (mouse) previews
// the imperative state; clicking a tab pins it; leaving releases. Touch stays
// declarative until tapped.
// ---------------------------------------------------------------------------
function DeclImpVisual() {
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState<"declarative" | "imperative" | null>(
    null,
  );
  const mode = pinned ?? (hovering ? "imperative" : "declarative");
  const imperative = mode === "imperative";

  return (
    <div
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          setHovering(false);
          setPinned(null);
        }
      }}
      className="flex w-full max-w-72 flex-col gap-2.5 font-mono"
    >
      <div className="relative flex overflow-hidden rounded-lg border border-ink-3 bg-ink-2 p-0.5 text-[11px]">
        <div
          className={`pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md ${A_FILL} transition-transform duration-300 ease-out ${
            imperative ? "translate-x-full" : ""
          }`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPinned("declarative");
          }}
          className={`relative z-10 w-1/2 rounded-md px-3 py-1.5 text-center transition-colors duration-300 ${
            imperative ? "text-bone-faint" : A_TEXT
          }`}
        >
          declarative
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPinned("imperative");
          }}
          className={`relative z-10 w-1/2 rounded-md px-3 py-1.5 text-center transition-colors duration-300 ${
            imperative ? A_TEXT : "text-bone-faint"
          }`}
        >
          imperative
        </button>
      </div>
      <div className="relative h-28 overflow-hidden rounded-lg border border-ink-3 bg-ink-2 text-[12.5px] leading-relaxed text-bone-dim">
        <div
          className={`absolute inset-4 flex flex-col justify-center whitespace-pre transition-opacity duration-300 ${
            imperative ? "opacity-0" : "opacity-100"
          }`}
        >
          <div>
            {"<"}
            <span className={A_TEXT}>Link</span>
            {' to="/a">'}
          </div>
          <div>{"  Album"}</div>
          <div>
            {"</"}
            <span className={A_TEXT}>Link</span>
            {">"}
          </div>
        </div>
        <div
          className={`absolute inset-4 flex flex-col justify-center whitespace-pre transition-opacity duration-300 ${
            imperative ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>{"onClick={() => {"}</div>
          <div>
            {"  "}
            <span className={A_TEXT}>navigate</span>
            {'("/a");'}
          </div>
          <div>{"}}"}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The improved visual set. Each is centered in whatever stage the frame gives
// it. Consistent radii (rounded-lg for chips), consistent stroke (border-ink-3),
// exactly one accent element per illustration.
// ---------------------------------------------------------------------------
const visuals: Record<string, ReactNode> = {
  // Lazy + code-split: a row of route chunks. The eager landing chunk is warm
  // (accent) at rest; on hover two lazy chunks drop in as they're visited.
  route: (
    <div className="flex items-end gap-2.5">
      <div className={`h-9 w-9 rounded-lg border ${A_BORDER} ${A_FILL}`} />
      <div className={`h-9 w-9 rounded-lg ${CHIP}`} />
      <div className="relative h-9 w-9">
        <div className={`absolute inset-0 rounded-lg ${CHIP} transition-opacity duration-700 group-hover:opacity-0 pointer-coarse:opacity-0`} />
        <div className={`absolute inset-0 -translate-y-1.5 rounded-lg border ${A_BORDER} ${A_FILL} opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100`} />
      </div>
      <div className="relative h-9 w-9">
        <div className={`absolute inset-0 rounded-lg ${CHIP} transition-opacity delay-300 duration-700 group-hover:opacity-0 pointer-coarse:opacity-0`} />
        <div className={`absolute inset-0 -translate-y-1.5 rounded-lg border ${A_BORDER} ${A_FILL} opacity-0 transition-all delay-300 duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100`} />
      </div>
      <div className={`h-9 w-9 rounded-lg ${CHIP}`} />
    </div>
  ),

  // Link preload: an app skeleton whose three fetched regions warm to accent in
  // sequence (header → sidebar → a content block).
  preloading: (
    <div className="grid h-24 w-28 grid-cols-3 grid-rows-3 gap-2">
      <div className={`col-span-2 rounded-lg ${CHIP} transition-colors duration-300 ${A_BORDER_ON} ${A_FILL_ON}`} />
      <div className={`rounded-lg ${CHIP}`} />
      <div className={`row-span-2 rounded-lg ${CHIP} transition-colors delay-150 duration-300 ${A_BORDER_ON} ${A_FILL_ON}`} />
      <div className={`col-span-2 rounded-lg ${CHIP}`} />
      <div className={`rounded-lg ${CHIP} transition-colors delay-300 duration-300 ${A_BORDER_ON} ${A_FILL_ON}`} />
      <div className={`rounded-lg ${CHIP}`} />
    </div>
  ),

  // Declarative or imperative: the interactive toggle above.
  router: <DeclImpVisual />,

  // Layouts with Outlet: nav + sidebar persist while the Outlet content swaps —
  // old page fades, a new one slides in from the right.
  outlet: (
    <div className="flex h-24 w-32 flex-col gap-2">
      <div className={`h-3.5 rounded-md ${CHIP}`} />
      <div className="flex flex-1 gap-2">
        <div className={`w-7 rounded-md ${CHIP}`} />
        <div className="relative flex-1">
          <div className={`absolute inset-0 rounded-md border border-ink-3 ${A_FILL_SOFT} transition-opacity duration-500 ease-out group-hover:opacity-0 pointer-coarse:opacity-0`} />
          <div className={`absolute inset-0 translate-x-full rounded-md border ${A_BORDER} ${A_FILL} opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 pointer-coarse:translate-x-0 pointer-coarse:opacity-100`} />
        </div>
      </div>
    </div>
  ),

  // Error boundary: a failing route grows from the centre until it's caught at
  // the (accent) boundary — it never escapes to the app frame around it.
  "error-handling": (
    <div className={`grid h-20 w-32 place-items-center rounded-xl ${CHIP}`}>
      <div className={`relative grid h-11 w-24 place-items-center rounded-lg border border-dashed border-ink-3 transition-colors duration-300 ${A_BORDER_ON}`}>
        <div className={`absolute inset-[34%] rounded-md ${A_FILL} transition-all duration-300 ease-out group-hover:inset-1 pointer-coarse:inset-1`}>
          <span className={`absolute -right-2 -top-2 grid h-4.5 w-4.5 place-items-center rounded-full ${A_DOT} text-[10px] font-semibold text-white`}>
            !
          </span>
        </div>
      </div>
    </div>
  ),

  // View Transitions: the incoming (accent) page slides over the outgoing one,
  // which dims — the old → new morph, in miniature.
  "view-transitions": (
    <div className="relative h-24 w-44">
      <div className={`absolute left-1 top-4 z-10 h-16 w-28 rounded-lg ${CHIP} transition-opacity duration-500 group-hover:opacity-30 pointer-coarse:opacity-30`} />
      <div className={`absolute right-1 top-0 z-0 h-16 w-28 -translate-x-8 rounded-lg border ${A_BORDER} ${A_FILL_SOFT} opacity-40 transition-all duration-500 ease-out group-hover:z-20 group-hover:translate-x-0 group-hover:opacity-100 pointer-coarse:z-20 pointer-coarse:translate-x-0 pointer-coarse:opacity-100`} />
    </div>
  ),

  // Redirects: a token travels /account → /login (which lights up as it lands).
  "navigate-component": (
    <div className="flex items-center justify-center gap-3 font-mono text-[11px]">
      <span className={`rounded-lg px-2.5 py-1.5 text-bone-dim ${CHIP}`}>
        /account
      </span>
      <div className="relative h-px w-12 bg-ink-3">
        <div className={`absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full ${A_DOT} opacity-0 transition-all duration-500 ease-out group-hover:left-full group-hover:opacity-100 pointer-coarse:left-full pointer-coarse:opacity-100`} />
      </div>
      <span className={`rounded-lg px-2.5 py-1.5 text-bone-dim ${CHIP} transition-colors duration-500 ${A_BORDER_ON} ${A_TEXT_ON}`}>
        /login
      </span>
    </div>
  ),

  // Route & search params: the path + query slots resolve to real values, and
  // the reads reveal below.
  "use-params": (
    <div className="flex flex-col items-center gap-3 font-mono">
      <div className="flex items-center text-xs">
        <span className="text-bone-faint">/products/</span>
        <span className={`relative inline-grid rounded-md border px-1.5 py-0.5 ${A_BORDER} ${A_FILL} ${A_TEXT}`}>
          <span className="col-start-1 row-start-1 text-center transition-opacity duration-300 group-hover:opacity-0 pointer-coarse:opacity-0">
            :id
          </span>
          <span className="col-start-1 row-start-1 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
            9
          </span>
        </span>
        <span className="text-bone-faint">?sort=</span>
        <span className={`relative inline-grid rounded-md border px-1.5 py-0.5 ${A_BORDER} ${A_FILL} ${A_TEXT}`}>
          <span className="col-start-1 row-start-1 text-center transition-opacity duration-300 group-hover:opacity-0 pointer-coarse:opacity-0">
            :sort
          </span>
          <span className="col-start-1 row-start-1 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
            price
          </span>
        </span>
      </div>
      <div className="flex flex-col items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
        <div className={`rounded-lg px-2.5 py-1 text-[11px] text-bone-dim ${CHIP}`}>
          <span className="text-bone-faint">useParams().</span>
          <span className={A_TEXT}>id</span>
          {" → "}
          <span className={A_TEXT}>&quot;9&quot;</span>
        </div>
        <div className={`rounded-lg px-2.5 py-1 text-[11px] text-bone-dim ${CHIP}`}>
          <span className="text-bone-faint">params.get(</span>
          <span className={A_TEXT}>&quot;sort&quot;</span>
          <span className="text-bone-faint">)</span>
          {" → "}
          <span className={A_TEXT}>&quot;price&quot;</span>
        </div>
      </div>
    </div>
  ),

  // useLocation: a compact browser whose URL + active nav label update together
  // on hover — /docs → /about.
  "use-location": (
    <div className={`w-48 overflow-hidden rounded-xl font-mono ${CHIP}`}>
      <div className="flex items-center gap-1.5 border-b border-ink-3 px-2.5 py-1.5 text-[10px]">
        <Search className="h-2.5 w-2.5 shrink-0 text-bone-faint" />
        <span>
          <span className="text-bone-faint">example.com</span>
          <span className={`relative inline-grid rounded px-1 ${A_FILL_SOFT} ${A_TEXT}`}>
            <span className="col-start-1 row-start-1 transition-opacity duration-300 group-hover:opacity-0 pointer-coarse:opacity-0">
              /docs
            </span>
            <span className="col-start-1 row-start-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
              /about
            </span>
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2.5">
        <div className="flex justify-end gap-2.5 text-[9px]">
          <span className="text-bone-dim">Home</span>
          <span className={`border-b pb-0.5 ${A_BORDER} ${A_TEXT} transition-colors duration-300 group-hover:border-transparent group-hover:text-bone-dim pointer-coarse:border-transparent pointer-coarse:text-bone-dim`}>
            Docs
          </span>
          <span className={`border-b border-transparent pb-0.5 text-bone-dim transition-colors duration-300 ${A_BORDER_ON} ${A_TEXT_ON}`}>
            About
          </span>
        </div>
        <div className={`h-6 rounded-md border border-ink-3 bg-ink`} />
      </div>
    </div>
  ),

  // Hash-anchor scrolling: a scroll-spy steps through section bars; the #target
  // (4th) settles into the accent.
  link: (
    <div className="flex w-32 flex-col gap-3">
      <div className="h-2 w-1/2 rounded-full bg-ink-3 group-hover:animate-[routini-spy-pulse_0.5s_ease]" />
      <div className="h-2 w-3/4 rounded-full bg-ink-3 group-hover:animate-[routini-spy-pulse_0.5s_ease_0.2s]" />
      <div className="h-2 w-2/3 rounded-full bg-ink-3 group-hover:animate-[routini-spy-pulse_0.5s_ease_0.4s]" />
      <div className={`h-2 w-3/5 rounded-full bg-ink-3 transition-colors delay-700 duration-300 ${A_DOT_ON}`} />
      <div className="h-2 w-2/5 rounded-full bg-ink-3" />
    </div>
  ),
};

const WIDE = "view-transitions";
const TALL = "router";

// Accent, set as a CSS variable on the section root so every visual draws from
// it. Kept as the brand orange, used only as small crisp touches.
const ORANGE: CSSProperties = {
  ["--viz-accent" as string]: "var(--color-accent)",
};

// A shared header — same eyebrow → headline hierarchy as Highlights/Bundle
// (text-xs uppercase tracking-[0.2em] accent eyebrow, then a much bigger bold
// headline), not this section's own smaller/differently-tracked treatment.
function BentoHeader({
  pretitle,
  intro,
  align = "center",
}: {
  pretitle: string;
  intro: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {pretitle}
      </p>
      <h2 className="text-balance mt-4 text-4xl font-bold leading-tight tracking-tight text-bone md:text-5xl">
        {intro}
      </h2>
    </div>
  );
}

// ===========================================================================
// VARIANT 1 — Floating cards. Rounded cards on the page background, an editorial
// index number per card, wide/tall spans for rhythm, warm orange accent.
// ===========================================================================
export function BuiltInV1() {
  const lang = useLang();
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3" style={ORANGE}>
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <BentoHeader pretitle={t.builtIn.pretitle} intro={t.builtIn.intro} />

        <ul className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {t.builtIn.entries.map((entry) => {
            const wide = entry.anchor === WIDE;
            const tall = entry.anchor === TALL;
            return (
              <li
                key={entry.anchor}
                className={
                  [wide && "lg:col-span-2", tall && "lg:row-span-2"]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
              >
                <Link
                  to={`${langPath(lang, "/docs")}#${entry.anchor}`}
                  viewTransition
                  className={[
                    // Same card object as Highlights/Bundle: hairline border
                    // + the shared accent glow (below) instead of a flat,
                    // borderless tint. These ARE links (unlike Highlights),
                    // so hover keeps a border-lit affordance on top of the
                    // existing bg shift.
                    "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink-3 bg-bone/2 p-8 transition-colors duration-300 hover:border-accent/25 hover:bg-bone/5",
                    wide && "lg:flex-row lg:items-center lg:gap-10",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    backgroundImage:
                      "radial-gradient(90% 70% at 20% 0%, color-mix(in oklab, var(--color-glow) calc(var(--color-glow-alpha-1) * 0.5), transparent) 0%, transparent 70%)",
                  }}
                >
                  <div
                    className={[
                      "flex items-center justify-center",
                      wide
                        ? "h-28 lg:order-2 lg:mb-0 lg:flex-1"
                        : tall
                          ? "h-32 lg:flex-1"
                          : "h-32",
                      "mb-6",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {visuals[entry.anchor]}
                  </div>
                  <div className={wide ? "lg:order-1 lg:flex-1" : undefined}>
                    <h3 className="text-lg font-semibold tracking-tight text-bone">
                      {entry.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-bone-dim">
                      {entry.desc}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}


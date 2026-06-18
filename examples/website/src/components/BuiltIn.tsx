import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Link } from "routini";
import { langPath, useLang } from "../lib/i18n";
import { useHomeT } from "../lib/i18n.home";

// The "what it does" counterpart to WhyRoutini's "why it's small". A bento:
// most cards are 1x1 (visual on top, text below). One WIDE card (declarative/
// imperative) spans two columns on desktop with text left + visual right; one
// TALL card (View Transitions) spans two rows in a single column with a portrait
// visual. They tile a clean grid on lg (12 cells, 4 rows) and collapse to plain
// 1x1 cards below lg. Layout matches the site: a hairline grid (gap-px over
// bg-ink-3), sharp corners, cells filling on hover:bg-ink-2. Visuals are
// restrained, sharp, ink+accent motifs (no icons) animating on group-hover;
// keyed by docs anchor since they're code.
const WIDE = "view-transitions";
const TALL = "router";

// Declarative or imperative (the TALL card). On desktop, hovering the card
// previews the imperative end state (mouse only); clicking a tab pins that mode
// (preventDefault + stopPropagation so it doesn't follow the card's link), and
// leaving the card releases the pin back to the hover/default state. On touch
// there's no hover, so it stays declarative until a tab is tapped — same gesture
// every other card answers to. Default = declarative. Only Link/navigate accent.
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
      className="flex w-full max-w-80 flex-col gap-3 font-mono"
    >
      <div className="relative flex overflow-hidden rounded-md border border-ink-3 bg-ink text-[11px]">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-accent/15 transition-transform duration-300 ease-out ${
            imperative ? "translate-x-full" : ""
          }`}
        />
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPinned("declarative");
          }}
          className={`relative z-10 w-1/2 cursor-pointer px-3 py-1.5 text-center transition-colors duration-300 ${
            imperative ? "text-bone-dim" : "text-accent"
          }`}
        >
          declarative
        </span>
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPinned("imperative");
          }}
          className={`relative z-10 w-1/2 cursor-pointer px-3 py-1.5 text-center transition-colors duration-300 ${
            imperative ? "text-accent" : "text-bone-dim"
          }`}
        >
          imperative
        </span>
      </div>
      <div className="relative h-32 overflow-hidden rounded-md border border-ink-3 text-[13px] leading-relaxed text-bone-dim">
        <div
          className={`absolute inset-4 flex flex-col justify-center whitespace-pre transition-opacity duration-300 ${
            imperative ? "opacity-0" : "opacity-100"
          }`}
        >
          <div>
            {"<"}
            <span className="text-accent">Link</span>
            {' to="/a">'}
          </div>
          <div>{"  Album"}</div>
          <div>
            {"</"}
            <span className="text-accent">Link</span>
            {">"}
          </div>
        </div>
        <div
          className={`absolute inset-4 flex flex-col justify-center whitespace-pre transition-opacity duration-300 ${
            imperative ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            {"<a onClick={() => "}
            <span className="text-accent">navigate</span>
            {'("/a")}>'}
          </div>
          <div>{"  Album"}</div>
          <div>{"</a>"}</div>
        </div>
      </div>
    </div>
  );
}

const visuals: Record<string, ReactNode> = {
  // Lazy + code-split: a row of route chunks. The first (the eager landing route)
  // is already loaded; the rest are lazy. On hover only the routes you actually
  // visit load — the whole orange chunk drops in from above and replaces the
  // empty gray slot (which fades out). The others stay unloaded.
  route: (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md border border-accent/60 bg-accent/25" />
      <div className="h-8 w-8 rounded-md border border-ink-3" />
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-md border border-ink-3 transition-opacity duration-700 group-hover:opacity-0 pointer-coarse:opacity-0" />
        <div className="absolute inset-0 -translate-y-full rounded-md border border-accent/60 bg-accent/25 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100" />
      </div>
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-md border border-ink-3 transition-opacity delay-300 duration-700 group-hover:opacity-0 pointer-coarse:opacity-0" />
        <div className="absolute inset-0 -translate-y-full rounded-md border border-accent/60 bg-accent/25 opacity-0 transition-all delay-300 duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100" />
      </div>
      <div className="h-8 w-8 rounded-md border border-ink-3" />
    </div>
  ),
  // View Transitions (wide): the new (orange) page peeks from behind the old
  // (gray) one at the top-right and, on hover, slides fully into place as the old
  // page dims. The old → new morph, in miniature.
  "view-transitions": (
    <div className="relative h-24 w-40">
      <div className="absolute left-0 top-4 z-10 h-16 w-28 rounded-md border border-ink-3 bg-ink transition-opacity duration-500 group-hover:opacity-40 pointer-coarse:opacity-40" />
      <div className="absolute right-0 top-0 z-0 h-16 w-28 -translate-x-8 rounded-md border border-accent/60 bg-accent/15 opacity-50 transition-all duration-500 ease-out group-hover:z-20 group-hover:translate-x-0 group-hover:opacity-100 pointer-coarse:z-20 pointer-coarse:translate-x-0 pointer-coarse:opacity-100" />
    </div>
  ),
  // Link preload: a bento of app sections; hovering warms three of them to accent
  // in sequence (header → sidebar → content) — the chunks a preload would fetch.
  preloading: (
    <div className="grid h-20 w-24 grid-cols-3 grid-rows-3 gap-1.5">
      <div className="col-span-2 rounded-md border border-ink-3 bg-ink transition-colors duration-300 group-hover:border-accent/70 group-hover:bg-accent/20 pointer-coarse:border-accent/70 pointer-coarse:bg-accent/20" />
      <div className="rounded-md border border-ink-3 bg-ink" />
      <div className="row-span-2 rounded-md border border-ink-3 bg-ink transition-colors delay-150 duration-300 group-hover:border-accent/70 group-hover:bg-accent/20 pointer-coarse:border-accent/70 pointer-coarse:bg-accent/20" />
      <div className="col-span-2 rounded-md border border-ink-3 bg-ink" />
      <div className="rounded-md border border-ink-3 bg-ink transition-colors delay-300 duration-300 group-hover:border-accent/70 group-hover:bg-accent/20 pointer-coarse:border-accent/70 pointer-coarse:bg-accent/20" />
      <div className="rounded-md border border-ink-3 bg-ink" />
    </div>
  ),
  // Error boundary: two nested horizontal frames — the full app (outer, solid)
  // and the error boundary (dashed) inside it. On hover the failing route grows
  // from the middle as an orange fill until it reaches the boundary (contained),
  // and the boundary's dashed stroke turns orange — it caught the error, which
  // never escapes to the app. The ! sits at the boundary's top-right. Touch shows
  // the caught end state.
  "error-handling": (
    <div className="grid h-16 w-28 place-items-center rounded-md border border-ink-3">
      <div className="relative h-10 w-20 rounded-md border border-dashed border-ink-3 transition-colors duration-300 group-hover:border-accent pointer-coarse:border-accent">
        <div className="absolute inset-[30%] rounded-sm bg-accent/30 transition-all duration-300 ease-out group-hover:inset-0 pointer-coarse:inset-0">
          <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-accent font-mono text-[9px] text-white">
            !
          </span>
        </div>
      </div>
    </div>
  ),
  // Route params: a route pattern resolving to real values. At rest it's the
  // pattern /users/:userId/posts/:postId (placeholders highlighted); on hover each
  // :param resolves in place to its value (9, 4) and the captured object reveals
  // below — what useParams() hands you, and proof multiple params work. Each swap
  // uses an inline-grid overlap so the pill keeps the placeholder's width (no
  // jump). Touch shows the resolved state.
  "use-params": (
    <div className="flex flex-col items-center gap-3 font-mono">
      <div className="flex items-center text-xs">
        <span className="text-bone-faint">/users/</span>
        <span className="relative inline-grid rounded-md border border-accent/60 bg-accent/15 px-1 py-0.5 text-accent">
          <span className="col-start-1 row-start-1 text-center transition-opacity duration-300 group-hover:opacity-0 pointer-coarse:opacity-0">
            :userId
          </span>
          <span className="col-start-1 row-start-1 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
            9
          </span>
        </span>
        <span className="text-bone-faint">/posts/</span>
        <span className="relative inline-grid rounded-md border border-accent/60 bg-accent/15 px-1 py-0.5 text-accent">
          <span className="col-start-1 row-start-1 text-center transition-opacity duration-300 group-hover:opacity-0 pointer-coarse:opacity-0">
            :postId
          </span>
          <span className="col-start-1 row-start-1 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
            4
          </span>
        </span>
      </div>
      <div className="rounded-md border border-ink-3 bg-ink px-2.5 py-1 text-[11px] text-bone-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
        {"{ userId: "}
        <span className="text-accent">&quot;9&quot;</span>
        {", postId: "}
        <span className="text-accent">&quot;4&quot;</span>
        {" }"}
      </div>
    </div>
  ),
  // Hash-anchor scrolling: a scroll-spy highlight steps through the section bars
  // on hover (bars 1–3 pulse) and the 4th — the #section target — fades in and
  // holds. The 5th stays below the fold.
  link: (
    <div className="flex w-28 flex-col gap-2.5">
      <div className="h-1.5 w-1/2 rounded-full bg-ink-3 group-hover:animate-[routini-spy-pulse_0.5s_ease]" />
      <div className="h-1.5 w-3/4 rounded-full bg-ink-3 group-hover:animate-[routini-spy-pulse_0.5s_ease_0.2s]" />
      <div className="h-1.5 w-2/3 rounded-full bg-ink-3 group-hover:animate-[routini-spy-pulse_0.5s_ease_0.4s]" />
      <div className="h-1.5 w-3/5 rounded-full bg-ink-3 transition-colors delay-700 duration-300 group-hover:bg-accent pointer-coarse:bg-accent" />
      <div className="h-1.5 w-2/5 rounded-full bg-ink-3" />
    </div>
  ),
  // Declarative or imperative: the click-to-toggle visual defined above.
  router: <DeclImpVisual />,
  // Layouts: nav + sidebar persist while the Outlet's content swaps on hover —
  // the old page fades out in place and a different page slides in from the right.
  outlet: (
    <div className="flex h-20 w-28 flex-col gap-1.5">
      <div className="h-3 rounded-md border border-ink-3 bg-ink" />
      <div className="flex flex-1 gap-1.5">
        <div className="w-6 rounded-md border border-ink-3 bg-ink" />
        <div className="relative flex-1">
          <div className="absolute inset-0 rounded-md border border-ink-3 bg-accent/10 transition-opacity duration-500 ease-out group-hover:opacity-0 pointer-coarse:opacity-0" />
          <div className="absolute inset-0 translate-x-full rounded-md border border-accent/60 bg-accent/20 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 pointer-coarse:translate-x-0 pointer-coarse:opacity-100" />
        </div>
      </div>
    </div>
  ),
  // Redirects: a guarded route sends visitors to /login via <Navigate>, which
  // replaces the entry by default — so Back doesn't bounce them into the redirect
  // again (no back-button trap). On hover a token travels the track from /account
  // to /login, which lights up as it lands. Touch shows the landed state.
  "navigate-component": (
    <div className="flex items-center justify-center gap-2.5 font-mono text-xs">
      <span className="rounded-md border border-ink-3 bg-ink px-2.5 py-1.5 text-bone-dim">
        /account
      </span>
      <div className="relative h-px w-14 bg-ink-3">
        <div className="absolute -top-0.75 left-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-all duration-500 ease-out group-hover:left-full group-hover:opacity-100 pointer-coarse:left-full pointer-coarse:opacity-100" />
      </div>
      <span className="rounded-md border border-ink-3 bg-ink px-2.5 py-1.5 text-bone-dim transition-colors duration-500 group-hover:border-accent/50 group-hover:text-accent pointer-coarse:border-accent/50 pointer-coarse:text-accent">
        /login
      </span>
    </div>
  ),
  // useLocation: a compact browser window sized to sit comfortably inside the
  // standard visual slot, not dominate it. A thin address bar (full URL, active
  // route segment highlighted) over a small page body — right-aligned nav header
  // above the main content rectangle — so it reads as a real site at a restrained
  // scale. The nav highlights the route's label, not its path. On hover the
  // location "changes" from /docs to /about and the URL + the active label update
  // together — what useLocation().path lets you drive. Touch shows the moved state.
  "use-location": (
    <div className="w-46 overflow-hidden rounded-md border border-ink-3 bg-ink font-mono">
      <div className="flex items-center gap-1.5 border-b border-ink-3 px-2.5 py-1 text-[10px]">
        <Search className="h-2.5 w-2.5 shrink-0 text-bone-faint" />
        <span>
          <span className="text-bone-faint">example.com</span>
          <span className="relative inline-grid rounded bg-accent/10 px-1 text-accent">
            <span className="col-start-1 row-start-1 transition-opacity duration-300 group-hover:opacity-0 pointer-coarse:opacity-0">
              /docs
            </span>
            <span className="col-start-1 row-start-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
              /about
            </span>
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-2">
        <div className="flex justify-end gap-2.5 text-[9px]">
          <span className="text-bone-dim">Home</span>
          <span className="border-b border-accent pb-0.5 text-accent transition-colors duration-300 group-hover:border-transparent group-hover:text-bone-dim pointer-coarse:border-transparent pointer-coarse:text-bone-dim">
            Docs
          </span>
          <span className="border-b border-transparent pb-0.5 text-bone-dim transition-colors duration-300 group-hover:border-accent group-hover:text-accent pointer-coarse:border-accent pointer-coarse:text-accent">
            About
          </span>
        </div>
        <div className="h-6 rounded border border-ink-3 bg-ink-2" />
      </div>
    </div>
  ),
};

export function BuiltIn() {
  const lang = useLang();
  const t = useHomeT();

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.builtIn.pretitle}
        </p>
        <h2 className="text-pretty mx-auto mb-12 max-w-3xl text-center text-3xl font-medium tracking-tight text-bone md:mb-16 md:text-4xl">
          {t.builtIn.intro}
        </h2>

        <ul className="grid grid-cols-1 gap-px bg-ink-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    "group flex h-full w-full flex-col bg-ink p-8 transition-colors hover:bg-ink-2",
                    wide && "lg:flex-row lg:items-center lg:gap-10",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div
                    className={[
                      "mb-7 flex items-center justify-center",
                      wide && "h-28 lg:order-2 lg:mb-0 lg:flex-1",
                      tall && "lg:mb-8 lg:flex-1",
                      !wide && !tall && "h-28",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {visuals[entry.anchor]}
                  </div>
                  <div className={wide ? "lg:order-1 lg:flex-1" : undefined}>
                    <h3 className="font-medium text-bone transition-colors group-hover:text-accent">
                      {entry.name}
                    </h3>
                    <p className="mt-2 text-sm text-bone-dim">{entry.desc}</p>
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

import { Link } from "routini";
import { CodeBlock } from "../components/CodeBlock";
import { langPath, useLang } from "../lib/i18n";
import { useDocsT } from "../lib/i18n.docs";
import { useActiveSection } from "../lib/useActiveSection";
import { usePageTitle } from "../lib/usePageTitle";
import type { SnippetId } from "../lib/snippets";

const GROUP_ORDER = ["components", "hooks", "utility", "guides"] as const;
type GroupKey = (typeof GROUP_ORDER)[number];

// Code-side metadata, ordered for display. `anchor` keys into the translated
// `docsContent` (prose, table, notes); name/signature/snippet are code, so
// they live here rather than in translations. Self-contained — the docs page
// no longer depends on the home page's `api` list.
interface DocEntry {
  anchor: string;
  name: string;
  signature: string;
  snippet: SnippetId;
  group: GroupKey;
  since: string;
}

const DOCS_ENTRIES: DocEntry[] = [
  {
    anchor: "router",
    name: "Router",
    signature: "<Router routes loading ssrPath>{children?}</Router>",
    snippet: "setup",
    group: "components",
    since: "0.1.0",
  },
  {
    anchor: "route",
    name: "Route",
    signature: "<Route path component | lazy loading />",
    snippet: "routeChildren",
    group: "components",
    since: "0.1.0",
  },
  {
    anchor: "link",
    name: "Link",
    signature: "<Link to {...anchorProps} />",
    snippet: "linkUsage",
    group: "components",
    since: "0.1.0",
  },
  {
    anchor: "outlet",
    name: "Outlet",
    signature: "<Outlet />",
    snippet: "outletLayout",
    group: "components",
    since: "0.1.0",
  },
  {
    anchor: "navigate-component",
    name: "Navigate",
    signature: "<Navigate to />",
    snippet: "navigateRedirect",
    group: "components",
    since: "0.1.0",
  },
  {
    anchor: "use-location",
    name: "useLocation",
    signature: "useLocation(): { path, navigate }",
    snippet: "currentPath",
    group: "hooks",
    since: "0.1.0",
  },
  {
    anchor: "use-params",
    name: "useParams",
    signature: "useParams<T>(): T",
    snippet: "typedParams",
    group: "hooks",
    since: "0.1.0",
  },
  {
    anchor: "navigate-util",
    name: "navigate",
    signature: "navigate(to: string, options?: NavigateOptions): void",
    snippet: "navigateFromCode",
    group: "utility",
    since: "0.1.0",
  },
  {
    anchor: "error-handling",
    name: "Error handling",
    signature: "<Router errorFallback onError />",
    snippet: "errorHandling",
    group: "guides",
    since: "0.2.0",
  },
  {
    anchor: "view-transitions",
    name: "View Transitions",
    signature: '<Link viewTransition> · navigate(to, { viewTransition })',
    snippet: "viewTransitions",
    group: "guides",
    since: "0.2.0",
  },
  {
    anchor: "preloading",
    name: "Preloading",
    signature: '<Link preload="hover" | "render" />',
    snippet: "preload",
    group: "guides",
    since: "0.3.0",
  },
];

interface DocsEntryContent {
  body: string;
  table?: readonly { name: string; type: string; desc: string }[];
  notes?: readonly string[];
}

const ANCHORS = DOCS_ENTRIES.map((e) => e.anchor);

export default function Docs() {
  const lang = useLang();
  const t = useDocsT();
  const docsPath = langPath(lang, "/docs");
  const content = t.docsContent as Record<string, DocsEntryContent>;
  const active = useActiveSection(ANCHORS);
  usePageTitle(`${t.docs.title} · routini`);

  const groups = GROUP_ORDER.map((key) => ({
    key,
    label: t.docs.groups[key],
    entries: DOCS_ENTRIES.filter((e) => e.group === key),
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="md:grid md:grid-cols-[180px_1fr] md:gap-12 lg:grid-cols-[210px_1fr] lg:gap-20">
        {/* Sidebar */}
        <aside className="mb-12 md:mb-0">
          <nav
            aria-label={t.docs.onThisPage}
            className="md:sticky md:top-[calc(var(--nav-h)+2rem)]"
          >
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
              {t.docs.onThisPage}
            </p>
            <div className="flex flex-col gap-6">
              {groups.map((group) => (
                <div key={group.key}>
                  <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-bone-faint">
                    {group.label}
                  </p>
                  <ul className="flex flex-col border-l border-ink-3">
                    {group.entries.map((entry) => {
                      const isActive = entry.anchor === active;
                      return (
                        <li key={entry.anchor}>
                          <Link
                            to={`${docsPath}#${entry.anchor}`}
                            aria-current={isActive ? "location" : undefined}
                            className={`-ml-px block border-l py-1 pl-3 font-mono text-sm transition-colors ${
                              isActive
                                ? "border-accent text-bone"
                                : "border-transparent text-bone-dim hover:border-bone-faint hover:text-bone"
                            }`}
                          >
                            {entry.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <header className="mb-16">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
              {t.docs.pretitle}
            </p>
            <h1 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">
              {t.docs.title}
            </h1>
            <p className="text-pretty mt-6 max-w-2xl text-lg text-bone-dim">
              {t.docs.sub}
            </p>
          </header>

          <div className="flex flex-col gap-20 md:gap-24">
            {DOCS_ENTRIES.map((entry) => {
              const c = content[entry.anchor];

              return (
                <section key={entry.anchor} id={entry.anchor}>
                  <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-mono text-2xl font-medium tracking-tight text-bone">
                      {entry.name}
                    </h2>
                    <span className="font-mono text-xs text-bone-faint">
                      {t.docs.kind[entry.group]} · {t.docs.since} {entry.since}
                    </span>
                  </div>

                  <code className="block overflow-x-auto border border-ink-3 bg-ink-2 px-4 py-2.5 font-mono text-sm text-accent">
                    {entry.signature}
                  </code>

                  <div className="mt-7 flex flex-col gap-8">
                    {c?.body || c?.notes?.length ? (
                      <div className="flex max-w-2xl flex-col gap-4 leading-relaxed text-bone-dim">
                        {c?.body ? (
                          <p className="text-pretty">{c.body}</p>
                        ) : null}
                        {c?.notes?.map((note, i) => (
                          <p key={i} className="text-pretty">
                            {note}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    {c?.table?.length ? (
                      <PropsTable
                        heading={t.docs.tableHeading[entry.group]}
                        cols={t.docs.tableCols}
                        rows={c.table}
                      />
                    ) : null}

                    <figure>
                      <figcaption className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-bone-faint">
                        {t.docs.exampleLabel}
                      </figcaption>
                      <CodeBlock id={entry.snippet} />
                    </figure>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PropsTable({
  heading,
  cols,
  rows,
}: {
  heading: string;
  cols: { name: string; type: string; description: string };
  rows: readonly { name: string; type: string; desc: string }[];
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-bone-faint">
        {heading}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-3">
              <th className="py-2 pr-6 font-mono text-xs font-normal uppercase tracking-wider text-bone-faint">
                {cols.name}
              </th>
              <th className="py-2 pr-6 font-mono text-xs font-normal uppercase tracking-wider text-bone-faint">
                {cols.type}
              </th>
              <th className="py-2 font-mono text-xs font-normal uppercase tracking-wider text-bone-faint">
                {cols.description}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-ink-3 align-top">
                <td className="whitespace-nowrap py-3 pr-6 font-mono text-accent">
                  {row.name}
                </td>
                <td className="whitespace-nowrap py-3 pr-6 font-mono text-bone-dim">
                  {row.type}
                </td>
                <td className="py-3 text-bone-dim">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

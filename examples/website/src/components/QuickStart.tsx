import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { useT } from "../lib/i18n";
import type { SnippetId } from "../lib/snippets";

const QUICK_START_ORDER = [
  "setup",
  "lazyRoutes",
  "typedParams",
  "navigateFromCode",
  "currentPath",
] as const satisfies readonly SnippetId[];

export function QuickStart() {
  const t = useT();
  const [activeId, setActiveId] = useState<SnippetId>(QUICK_START_ORDER[0]);
  const caption = t.quickStart.captions[activeId];

  return (
    <section className="border-t border-ink-3">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
          {t.quickStart.pretitle}
        </p>
        <p className="text-balance mx-auto mb-12 max-w-2xl text-center text-lg text-bone-dim">
          {t.quickStart.intro}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {/* Active code on the left (8/12 on desktop, full on mobile) */}
          <div className="min-w-0 md:col-span-8">
            <CodeBlock id={activeId} caption={caption} />
          </div>

          {/* Tab list on the right (4/12 on desktop, full on mobile) */}
          <nav
            aria-label={t.quickStart.pretitle}
            className="md:col-span-4"
          >
            <ul className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible md:border-l md:border-ink-3">
              {QUICK_START_ORDER.map((id) => {
                const isActive = id === activeId;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(id)}
                      aria-current={isActive ? "true" : undefined}
                      className={[
                        "block whitespace-nowrap px-4 py-3 text-left font-mono text-sm transition-colors",
                        "md:w-full md:whitespace-normal md:border-l-2 md:-ml-px",
                        isActive
                          ? "text-accent md:border-accent"
                          : "text-bone-dim hover:text-bone md:border-transparent md:hover:border-bone-faint",
                      ].join(" ")}
                    >
                      {t.quickStart.captions[id]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

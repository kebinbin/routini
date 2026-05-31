// Loading placeholder for the lazy content routes. One component, two shapes:
// pass `sidebar` for the Docs two-column layout, omit it for the single-column
// Examples layout. Mirrors the real page so content swaps in without a shift.
// Eager module (referenced by App's route `loading`), shown immediately.

function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-ink-3 ${className}`} />;
}

function GhostSidebar({ groups }: { groups: number[] }) {
  return (
    <aside className="mb-12 md:mb-0">
      <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)]">
        <Bar className="mb-5 h-3 w-24" />
        <div className="flex flex-col gap-6">
          {groups.map((count, g) => (
            <div key={g}>
              <Bar className="mb-3 h-2.5 w-16" />
              <div className="flex flex-col gap-2.5 border-l border-ink-3 pl-3">
                {Array.from({ length: count }).map((_, i) => (
                  <Bar key={i} className="h-3 w-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function GhostContent({ blocks }: { blocks: number }) {
  return (
    <div className="min-w-0">
      <div className="mb-16">
        <Bar className="mb-4 h-3 w-20" />
        <Bar className="mb-6 h-10 w-56" />
        <Bar className="h-4 w-full max-w-xl" />
      </div>
      <div className="flex flex-col gap-20">
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i}>
            <Bar className="mb-4 h-7 w-48" />
            <Bar className="mb-6 h-4 w-full max-w-lg" />
            <div className="h-40 w-full rounded border border-ink-3 bg-ink-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface PageSkeletonProps {
  /** Link counts per sidebar group. Provided → two-column (Docs) layout;
   *  omitted → single-column (Examples) layout. */
  sidebarGroups?: number[];
  /** Number of ghost content blocks. */
  blocks?: number;
}

export function PageSkeleton({ sidebarGroups, blocks = 3 }: PageSkeletonProps) {
  const sidebar = (sidebarGroups?.length ?? 0) > 0;
  return (
    <div
      role="status"
      aria-busy="true"
      className={`mx-auto px-6 py-16 md:py-20 ${sidebar ? "max-w-7xl" : "max-w-3xl"}`}
    >
      <span className="sr-only">Loading…</span>
      <div
        className={`animate-pulse motion-reduce:animate-none ${
          sidebar
            ? "md:grid md:grid-cols-[180px_1fr] md:gap-12 lg:grid-cols-[210px_1fr] lg:gap-20"
            : ""
        }`}
      >
        {sidebar ? <GhostSidebar groups={sidebarGroups ?? []} /> : null}
        <GhostContent blocks={blocks} />
      </div>
    </div>
  );
}

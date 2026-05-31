// Loading placeholder for the lazy Docs route. Mirrors the Docs two-column
// layout so the real page swaps in without a layout shift. Lives in its own
// eager module (not inside the lazy Docs chunk) so referencing it doesn't pull
// the chunk in early. Wired as the docs route's per-route `loading`.

// Sidebar group sizes mirror the real nav: Components (5), Hooks (2), Utility (1).
const GROUP_SIZES = [5, 2, 1];

function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-ink-3 ${className}`} />;
}

export function DocsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto max-w-7xl px-6 py-16 md:py-20"
    >
      <span className="sr-only">Loading documentation…</span>

      <div className="md:grid md:grid-cols-[180px_1fr] md:gap-12 lg:grid-cols-[210px_1fr] lg:gap-20">
        {/* Sidebar */}
        <aside aria-hidden className="mb-12 md:mb-0">
          <div className="animate-pulse motion-reduce:animate-none md:sticky md:top-[calc(var(--nav-h)+2rem)]">
            <Bar className="mb-5 h-3 w-24" />
            <div className="flex flex-col gap-6">
              {GROUP_SIZES.map((count, g) => (
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

        {/* Content */}
        <div
          aria-hidden
          className="min-w-0 animate-pulse motion-reduce:animate-none"
        >
          <div className="mb-16">
            <Bar className="mb-4 h-3 w-16" />
            <Bar className="mb-6 h-10 w-64" />
            <Bar className="h-4 w-full max-w-2xl" />
          </div>

          <div className="flex flex-col gap-20 md:gap-24">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Bar className="mb-4 h-7 w-40" />
                <Bar className="mb-5 h-10 w-full max-w-md" />
                <Bar className="mb-6 h-4 w-full max-w-xl" />
                <div className="h-40 w-full rounded border border-ink-3 bg-ink-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

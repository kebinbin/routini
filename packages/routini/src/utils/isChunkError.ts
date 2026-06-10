/**
 * Detecting a failed code-split chunk load.
 *
 * Browsers don't share one error type or message for a failed dynamic
 * `import()`, and matching on message text is fragile — the wording differs per
 * engine and changes over time. So the *primary* signal is a tag routini puts
 * on the error itself: routini owns the lazy loader, so when the `import()` it
 * runs rejects, it marks that error (see `markChunkError`). That's 100% reliable
 * for routini's own routes. The message heuristic below is only a *fallback* for
 * errors that didn't pass through routini's loader.
 *
 * Verified message strings (June 2026):
 *   - Chromium:        "Failed to fetch dynamically imported module: <url>"
 *   - Firefox/Safari:  "error loading dynamically imported module"
 *   - webpack:         error.name "ChunkLoadError" / "Loading chunk 42 failed"
 */

// Symbol.for keeps the tag stable across module instances (e.g. the dual
// ESM/CJS builds, or duplicate copies in a consumer's dependency tree).
const CHUNK_ERROR = Symbol.for("routini.chunkError");

/**
 * Tag an error thrown by a failed dynamic `import()` so it can be recognised
 * reliably, without depending on browser-specific message strings.
 */
export function markChunkError(cause: unknown): unknown {
  if (cause && typeof cause === "object") {
    try {
      (cause as Record<symbol, unknown>)[CHUNK_ERROR] = true;
    } catch {
      // Error object is frozen — fall back to the message heuristic.
    }
  }
  return cause;
}

export function isChunkError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  // Primary, reliable signal: routini tagged it at the import boundary.
  if ((error as Record<symbol, unknown>)[CHUNK_ERROR] === true) return true;

  // Fallback for errors not routed through routini's loader.
  if ((error as { name?: unknown }).name === "ChunkLoadError") return true;

  const message = (error as { message?: unknown }).message;
  if (typeof message !== "string") return false;

  return (
    /failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /loading chunk \d+ failed/i.test(message)
  );
}

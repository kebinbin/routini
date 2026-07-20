import { useSyncExternalStore } from "react";

// Instrumentation only — not part of routini itself. Records when a wrapped
// lazy import resolves, so demo pages can show a live "loaded" state without
// needing the Network tab open.
const loaded = new Set<string>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function markLoaded(key: string) {
  loaded.add(key);
  notify();
}

export function useChunkLoaded(key: string) {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => loaded.has(key),
    () => false,
  );
}

import { useSyncExternalStore } from "react";

// Theme lives on <html data-theme>, set before paint by the inline script in
// index.html (no flash). This module reads/writes that attribute + localStorage
// and lets components subscribe.
export type Theme = "dark" | "light";

const KEY = "sona-theme";
const listeners = new Set<() => void>();

function read(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore (private mode, etc.) */
  }
  for (const l of listeners) l();
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "dark",
  );
}

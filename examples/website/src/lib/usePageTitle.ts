import { useEffect } from "react";

/**
 * Sets document.title while the calling page is mounted, restoring the previous
 * title on unmount. Lets each route own its tab title; the static index.html
 * title is the pre-mount / crawler default. Client-only (effects don't run
 * during SSR, and the demo site is client-rendered).
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

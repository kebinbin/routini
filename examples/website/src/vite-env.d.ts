/// <reference types="vite/client" />

declare module "virtual:highlighted-snippets" {
  import type { SnippetId } from "./lib/snippets";
  /**
   * Snippet ID → pre-highlighted HTML string. Populated at build time by
   * `plugins/highlight-snippets.ts`. Safe to drop into
   * `dangerouslySetInnerHTML` — the source code is escaped by Shiki before
   * being wrapped in `<span>`s.
   */
  const HIGHLIGHTED: Record<SnippetId, string>;
  export default HIGHLIGHTED;
}

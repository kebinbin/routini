import HIGHLIGHTED from "virtual:highlighted-snippets";
import type { SnippetId } from "../lib/snippets";

interface CodeBlockProps {
  id: SnippetId;
  /** Optional caption shown above the code block (file path, label). */
  caption?: string;
}

export function CodeBlock({ id, caption }: CodeBlockProps) {
  const html = HIGHLIGHTED[id];

  return (
    <figure className="overflow-hidden border border-ink-3">
      {caption ? (
        <figcaption className="border-b border-ink-3 bg-ink-2 px-4 py-2 font-mono text-xs text-bone-faint">
          {caption}
        </figcaption>
      ) : null}
      <div
        className="code-block-shiki overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

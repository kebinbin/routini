import { useState } from "react";
import { Check, Copy } from "lucide-react";
import HIGHLIGHTED from "virtual:highlighted-snippets";
import type { SnippetId } from "../lib/snippets";

interface CodeBlockProps {
  id: SnippetId;
  /** Optional caption shown above the code block (file path, label). */
  caption?: string;
  /**
   * Raw source to copy. When provided, a copy button is shown. Pass the entry
   * from `snippets` so the original (un-highlighted) text is copied. Callers
   * that pass this import `snippets`, keeping the raw text out of bundles that
   * only render code.
   */
  copyText?: string;
}

export function CodeBlock({ id, caption, copyText }: CodeBlockProps) {
  const html = HIGHLIGHTED[id];
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Older browsers / insecure contexts — silently no-op.
    }
  };

  return (
    <figure className="relative overflow-hidden border border-ink-3">
      {caption ? (
        <figcaption className="border-b border-ink-3 bg-ink-2 px-4 py-2 font-mono text-xs text-bone-faint">
          {caption}
        </figcaption>
      ) : null}
      {copyText ? (
        <button
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center border border-ink-3 bg-ink-2 text-bone-faint transition-colors hover:border-accent hover:text-bone"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      ) : null}
      <div
        className="code-block-shiki overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

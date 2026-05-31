import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useT } from "../lib/i18n";

const COMMAND = "npm install routini";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const t = useT();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Older browsers / insecure contexts — silently no-op.
    }
  };

  return (
    <button
      onClick={copy}
      aria-label={copied ? t.install.copied : t.install.copy}
      className="group inline-flex items-center gap-3 border border-ink-3 bg-ink-2 px-4 py-3 font-mono text-sm text-bone-dim transition-colors hover:border-accent hover:text-bone"
    >
      <span className="text-bone-faint">$</span>
      <span>{COMMAND}</span>
      <span className="ml-2 inline-flex h-4 w-4 items-center justify-center">
        {copied ? (
          <Check className="h-4 w-4 text-accent" />
        ) : (
          <Copy className="h-4 w-4 text-bone-faint group-hover:text-bone-dim" />
        )}
      </span>
    </button>
  );
}

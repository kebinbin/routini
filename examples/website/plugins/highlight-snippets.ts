import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Plugin, transformWithEsbuild } from "vite";

/**
 * Vite plugin: pre-render code snippets with Shiki at build time and expose
 * them via `virtual:highlighted-snippets`.
 *
 * Why a build-time plugin: Shiki at runtime adds ~75 KB gzip to the client
 * bundle just to highlight static strings we author ourselves. Running the
 * highlighter once at build, inlining the resulting HTML, and shipping zero
 * Shiki to the browser is the right architecture for static content.
 *
 * Usage in a component:
 *   import HIGHLIGHTED from "virtual:highlighted-snippets";
 *   const html = HIGHLIGHTED[snippetId]; // ready-to-render HTML string
 *
 * HMR: when `src/lib/snippets.ts` changes, the virtual module is invalidated
 * and a full reload is triggered so the new highlighted output is picked up.
 */

const VIRTUAL_ID = "virtual:highlighted-snippets";
const RESOLVED_VIRTUAL_ID = "\0" + VIRTUAL_ID;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SNIPPETS_PATH = path.resolve(HERE, "../src/lib/snippets.ts");

async function loadSnippets(): Promise<Record<string, string>> {
  // Node can't `import()` a .ts file natively. Transform with esbuild
  // (shipped with Vite), then import as an inline data URL so we get a real
  // ES module without writing anything to disk.
  const ts = await fs.readFile(SNIPPETS_PATH, "utf8");
  const { code } = await transformWithEsbuild(ts, SNIPPETS_PATH, {
    loader: "ts",
    format: "esm",
  });
  const dataUrl =
    "data:text/javascript;base64," + Buffer.from(code).toString("base64");
  const mod = (await import(dataUrl)) as { snippets: Record<string, string> };
  return mod.snippets;
}

export function highlightSnippets(): Plugin {
  return {
    name: "routini-website:highlight-snippets",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
    },

    async load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return;

      // Dynamic import keeps Shiki out of Vite's main config-load path —
      // it only runs when the virtual module is actually requested.
      const { codeToHtml } = await import("shiki");
      const snippets = await loadSnippets();

      const entries = await Promise.all(
        Object.entries(snippets).map(async ([key, code]) => {
          const html = await codeToHtml(code, {
            lang: "tsx",
            themes: { light: "vitesse-light", dark: "vitesse-dark" },
            defaultColor: false,
          });
          return [key, html] as const;
        }),
      );

      const map = Object.fromEntries(entries);
      return `export default ${JSON.stringify(map)};`;
    },

    handleHotUpdate(ctx) {
      if (ctx.file !== SNIPPETS_PATH) return;
      const mod = ctx.server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
      if (!mod) return;
      ctx.server.moduleGraph.invalidateModule(mod);
      ctx.server.ws.send({ type: "full-reload" });
      // Returning [] tells Vite we've handled the update for this file.
      return [];
    },
  };
}

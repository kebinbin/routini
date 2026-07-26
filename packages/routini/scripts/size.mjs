// Measures routini's published size the way bundlephobia (and the website's
// BundleChart) does, so every number lines up: bundle with esbuild, minify with
// terser (--compress --mangle), then gzip + brotli. react / react-dom /
// react/jsx-runtime are peer deps so they're externalized; routini has no
// runtime dependencies, so nothing else is bundled. Run with `npm run size`.
//
// Exits non-zero if the gzip size exceeds the budget below, so size can't creep
// without someone consciously bumping it.
import { build } from "esbuild";
import { minify } from "terser";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// gzip budget, in KB. Current is ~3.20 KB. This session added opt-in scroll
// restoration (`<Router scrollRestoration scrollContainer>`) and exposed
// `package.json` in the exports map. Both are real features, not creep —
// bumped from 2.8 deliberately. This ceiling leaves a little headroom while
// still catching a real regression; growing past it should be a conscious
// decision.
const LIMIT_KB = 3.3;

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, "../src/index.ts");

const { outputFiles } = await build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  format: "esm",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  external: ["react", "react-dom", "react/jsx-runtime"],
});

const { code } = await minify(outputFiles[0].text, {
  compress: true,
  mangle: true,
  module: true,
});

const min = Buffer.from(code);
const gzip = gzipSync(min, { level: 9 }).length;
const brotli = brotliCompressSync(min).length;
const kb = (n) => (n / 1024).toFixed(2);

console.log("routini (ESM, minified + gzipped)");
console.log(`  minified : ${kb(min.length)} KB`);
console.log(`  gzipped  : ${kb(gzip)} KB  (budget ${LIMIT_KB} KB)`);
console.log(`  brotli   : ${kb(brotli)} KB`);

const limitBytes = LIMIT_KB * 1024;
if (gzip > limitBytes) {
  console.error(
    `\n✗ gzip ${kb(gzip)} KB exceeds the ${LIMIT_KB} KB budget by ` +
      `${gzip - limitBytes} B. Trim it, or bump LIMIT_KB in scripts/size.mjs.`,
  );
  process.exit(1);
}
console.log("\n✓ within budget");

// routini's published bundle size (minified + gzipped), in KB. The one place
// the site states this number — BundleChart and the "Small on purpose" copy
// both read it from here. Update by re-running `npm run size -w
// packages/routini` after a change to the library and copying the reported
// gzip figure; also bump LIMIT_KB in packages/routini/scripts/size.mjs and the
// README/package.json description at the same time.
export const BUNDLE_SIZE_KB = 3.2;

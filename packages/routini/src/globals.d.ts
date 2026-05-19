// `process.env.NODE_ENV` is statically replaced by consumer bundlers (Vite, webpack,
// Rollup), letting dev-only branches tree-shake out of production builds. We type it
// locally instead of pulling in all of @types/node just for one string.
declare const process: { env: { NODE_ENV?: string } };

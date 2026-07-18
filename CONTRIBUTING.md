# Contributing

Thanks for your interest in routini.

## Getting started

This is an npm-workspaces monorepo — the library lives in `packages/routini`,
the demo site in `examples/website`. See the README's
[Development](./README.md#development) section for prerequisites, common
commands, and the two-terminal `dev:package` + `dev:website` workflow.

## Before opening a PR

- Add tests for new behavior (Vitest + @testing-library/react; run `npm test`
  from the repo root).
- Run `npm run lint -w packages/routini` and `npm run typecheck -w packages/routini` from the repo root.
- If your change is user-visible, add a changeset: `npx changeset` from the
  repo root. See the README's [Releasing](./README.md#releasing) section for
  what that means and when to skip it.
- CI (lint, typecheck, test, build) must pass before a PR can merge into `main`.

## Scope

routini is intentionally small — see the README's
[What's not in scope](./README.md#whats-not-in-scope) section before proposing
a large feature. If you're unsure whether something fits, open an issue to
discuss before writing code.

## Reporting bugs

Open a [GitHub issue](https://github.com/kebinbin/routini/issues) with a
minimal reproduction. Include your routini version and browser.

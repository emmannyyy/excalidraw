# Upstream merge cadence (Fortify fork)

- **`origin`** → `github.com/emmannyyy/excalidraw` — push Fortify-specific work here.
- **`upstream`** → `github.com/excalidraw/excalidraw` — pull official fixes and features.

## Suggested workflow

1. Periodically: `git fetch upstream` then merge or rebase `upstream/master` into `fortify-custom` (or your integration branch).
2. Resolve conflicts in `packages/excalidraw` first; then `yarn build:packages` and smoke-test.
3. Tag releases consumed by Fortify (e.g. `v0.18.0-fortify.1`) after a successful build.

## Build for Fortify

From monorepo root:

```bash
yarn install
yarn build:packages
```

Then point Fortify at `packages/excalidraw` via `file:` or publish `@emmannyyy/excalidraw`.

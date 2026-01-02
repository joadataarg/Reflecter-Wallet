# Contributing (Trunk-Based Workflow)

This repo follows a lightweight trunk-based workflow with small, short-lived branches and feature flags. The goal: trunk always deployable, low-friction merges, and quick rollback via flags.

## Branching and cadence
- Branch from `trunk`; keep branches short-lived (ideally < 3 days).
- Rebase/merge from `trunk` daily to avoid drift.
- Prefer small PRs: target < 10 files or < 500 LOC. If larger, split.
- Make changes additive when possible (add new code/flags instead of rewriting). 
- Use feature flags for incomplete work; default to `false` until the feature is ready.

## Hotspot files and rules
- `.env.example`: add-only, no renames/deletes; keep alphabetical; dummy values only. List new vars in the PR.
- `package.json` / lockfiles: avoid large upgrades inside feature branches; do them in dedicated chore PRs.
- `featureFlags` (or similar): add flags; do not rename; remove in a cleanup PR once stable.
- Design tokens / `tailwind.config.js`: add tokens minimally; group stylistic changes in a focused PR.
- Shared config (auth/network): call out changes explicitly in the PR if modified.

## Feature flags (no Remote Config in the SDK)
1) Add flag with a safe default (`false`).
2) Develop behind the flag (do not break the existing path).
3) Turn flag `true` when validated.
4) Cleanup: remove flag and dead code after a couple of stable releases.

Rollback: if a flagged feature causes issues, flip the flag to `false` (one-line change) and deploy; no need to revert the whole merge.

## Working in parallel / conflict avoidance
- Announce when touching hotspot files (env, flags, config, design tokens).
- Keep changes additive (especially env and flags) to reduce conflicts.
- Before opening a PR, inspect scope: `git diff trunk --stat` and `git diff trunk --name-only`.
- Rebase onto latest `trunk` before requesting review.
- If env conflicts arise, keep both additions, re-sort, and update the PR notes on new vars.

## PR expectations
- Describe scope and list hotspot changes (env/flags/config).
- Note new env vars and their purpose.
- Specify flag defaults and planned cleanup if applicable.
- Keep tests/build green; mention what was run.

### PR template snippet
```
## Resumen
- ...

## Cambios en config/env/flags
- .env.example: agrega API_FOO_BASE_URL (dummy)
- featureFlags: agrega FLAG_LENDING_V2 (default false)

## Rollout / flags
- FLAG_LENDING_V2=false (activar cuando esté listo)

## Tests
- npm test / lint / dev smoke
```

## Defaults for SDK consumers
- Do not require Firebase Remote Config or external setup.
- Feature flags should work with env defaults only; Remote Config is for internal use only if ever needed.

---
title: establish extension test coverage
status: open
priority: high
type: chore
labels: [release-blocker, testing]
created: 2026-09-14
parent: null
blocked-by: []
blocks: []
---

## Context

The extraction has only seven tests. On 2026-09-14, `npm run test:coverage` passed but reported 11.47% statements, 6.05% branches, 9.52% functions, and 12.21% lines across extension sources. Several behavior-heavy modules have no exercised statements, so regressions can pass CI.

This parent tracks focused characterization in reviewable slices before release.

## Acceptance Criteria

- [ ] Complete child 0008.1 for session-notes behavior.
- [ ] Complete child 0008.2 for assistant-outline core behavior.
- [ ] Complete child 0008.3 for assistant-outline UI behavior and enforce a justified coverage floor.
- [ ] Keep `npm run test:coverage` in CI and document any behavior that still requires focused manual validation.

## Affected Files

- `test/` — add behavioral and integration coverage.
- `vitest.config.ts` — enforce the agreed coverage floor after representative tests exist.
- `README.md` — document focused manual checks that cannot be automated economically.

## Notes

Coverage percentage is a regression signal, not the goal. Prioritize persisted-entry compatibility, commands and shortcuts, editor and clipboard behavior, overlay interactions, and producer-owned status behavior. Do not redesign extension behavior to simplify tests.

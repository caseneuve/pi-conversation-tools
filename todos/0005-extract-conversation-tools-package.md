---
title: extract conversation tools package
status: in_progress
priority: high
type: feature
labels: [pi, packaging]
created: 2026-09-13
parent: null
blocked-by: []
blocks: []
---

## Context

Extract dotagents `assistant-outline` and `session-notes` into this package without redesign. Source retirement and dotagents bootstrap cleanup are explicitly out of scope.

## Acceptance Criteria

- [ ] Package manifest explicitly exposes `./extensions/assistant-outline/index.ts` and `./extensions/session-notes.ts`.
- [ ] Preserve commands, shortcuts, persisted custom-entry identities, selection behavior, editor and clipboard behavior, and current platform assumptions.
- [ ] Publish the `session-notes` status with producer-owned dim styling.
- [ ] Port source todos `0033` and `0056` as `0001` and `0002`; close source copies only after destination is effective.
- [ ] Preserve the runtime-footer release blocker in `0003`.
- [ ] Add focused characterization and registration tests plus manual parity guidance.
- [ ] Validate package contents and local installation. Immutable-ref installation requires a reviewed immutable ref and remains a manual release-gate check.

## Affected Files

- `extensions/assistant-outline/`
- `extensions/session-notes.ts`
- `test/`
- `README.md`
- `package.json`

## Notes

Created from `template-pi-package` at version `0.0.0`. Do not release while todos `0003` or `0004` remain unresolved.

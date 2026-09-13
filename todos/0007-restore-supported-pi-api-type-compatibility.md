---
title: restore supported Pi API type compatibility
status: open
priority: high
type: bug
labels: [release-blocker, pi-api]
created: 2026-09-13
parent: null
blocked-by: []
blocks: []
---

## Context

Literal sources fail type checking against the selected `@earendil-works/pi-coding-agent@0.85.1` API. Extraction must not redesign behavior while repairing these failures.

## Acceptance Criteria

- [ ] Resolve `extensions/assistant-outline/comments.ts:40` unknown-value type error with an explicit session-entry payload contract.
- [ ] Update assistant-outline command/overlay API use for Pi 0.85.1, including command-context and overlay-options types.
- [ ] Preserve public commands, shortcuts, custom-entry formats, and existing behavior.
- [ ] Run `npm run typecheck` successfully against the pinned version.

## Notes

Observed during extraction. This blocks release.

The supported compatibility pin was changed from the template default, Pi 0.84.2, to Pi 0.85.1 by human decision on 2026-09-13. `package.json`, `package-lock.json`, and Copier answers must keep that version aligned.

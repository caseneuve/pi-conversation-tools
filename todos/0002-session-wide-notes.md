---
title: make session notes session-wide
status: open
priority: medium
type: bug
labels: []
created: 2026-09-13
parent: null
blocked-by: []
blocks: []
---

## Context

Ported from dotagents todo `0056-session-wide-notes`.

`session-notes` currently reconstructs state from the active conversation branch. Navigating with `/tree` can replace visible notes and the footer count with a branch-local snapshot. Notes are intended to belong to the session as a whole, independently of the selected point in its conversation tree.

New sessions, including sessions created by `/fork` or `/clone`, must start without notes rather than inheriting snapshots copied from the source session.

## Acceptance Criteria

- [ ] `/session-notes` resolves latest state for the current whole session rather than the active branch.
- [ ] Navigating between branches with `/tree` does not change visible notes or footer status.
- [ ] Note create, edit, status, and delete operations remain visible from every branch in the same session.
- [ ] `/new`, `/fork`, and `/clone` start with no notes; resuming the same session restores notes.
- [ ] Legacy snapshots have an explicit, tested compatibility policy.
- [ ] Documentation describes session-wide behavior and the new-session/fork boundary accurately.
- [ ] Extension type-checks and focused tests pass.

## Affected Files

- `extensions/session-notes.ts`
- `test/session-notes.test.ts`
- `README.md`

## E2E Spec

GIVEN a session with notes and multiple conversation branches
WHEN the user navigates between branches with `/tree`
THEN every branch shows the same latest notes and footer count.

GIVEN a session containing notes
WHEN the user creates a new session with `/new`, `/fork`, or `/clone`
THEN the new session starts with no notes
AND resuming the original session restores its notes.

## Notes

Pi custom entries occupy a tree position because `pi.appendEntry()` attaches them to the current leaf. Fork and clone paths may physically copy custom entries, so simply reading `getEntries()` is insufficient.

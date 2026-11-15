---
title: extract conversation tools package
status: done
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

- [x] Package manifest explicitly exposes `./extensions/assistant-outline/index.ts` and `./extensions/session-notes.ts`.
- [x] Preserve commands, shortcuts, persisted custom-entry identities, selection behavior, editor and clipboard behavior, and current platform assumptions.
- [x] Publish the `session-notes` status with producer-owned dim styling.
- [ ] Port source todos `0033` and `0056` as `0001` and `0002`; close source copies only after destination is effective.
- [x] Preserve the runtime-footer release blocker in `0003`.
- [x] Add focused characterization and registration tests plus manual parity guidance.
- [x] Validate package contents and local installation. Immutable-ref installation requires a reviewed immutable ref and remains a manual release-gate check.

## Affected Files

- `extensions/assistant-outline/`
- `extensions/session-notes.ts`
- `test/`
- `README.md`
- `package.json`

## Notes

Created from `template-pi-package` at version `0.0.0`. Do not release while todos `0003` or `0004` remain unresolved.

## Reconciliation (2026-11-15)

Technical extraction is accepted under done migration `0009` and the user's manual
acceptance reported by lead t16. Integrated `6d357a27a25a1fc06357ba1ab576266b492df01b`
is tree-identical to reviewed `b847b1c`. The explicit two-entry manifest, public
commands/shortcuts/custom-entry identities, dim producer-owned status and documented
branch-relative behavior are preserved. Reviewed local native installation/filtering,
17-file pack, clipboard, comment/note exports, resume and generic-footer composition
provide the extraction evidence. Fresh non-mutating check:ci/typecheck/tests pass
(16 tests); evidence: `~/.cache/pi-migration/evidence/conversation-tools/{review,handoff}.md`
and `evidence/todo-reconciliation/pi-conversation-tools-checks.log` under the same cache root.

Destination todos `0001`/`0002` are effective and remain open. The historical compound
source-copy checkbox above stays unchecked: no dotagents source-todo closure is claimed
or performed by this package-only reconciliation. That outside-owner action is not
remaining technical extraction work. Width investigation, session-wide notes,
readability/coverage work, source retirement/bootstrap cleanup and immutable remote
Git/publication gates are not completed by this closure. Existing `0003`/`0004` blockers
are already closed; `0007` is superseded by the selected Pi 1.5.2 target. No release,
push, tag or source retirement is authorized here.

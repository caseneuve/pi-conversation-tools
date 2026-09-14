---
title: reconcile literal sources with package lint baseline
status: open
priority: high
type: chore
labels: [release-blocker, tooling]
created: 2026-09-13
parent: null
blocked-by: []
blocks: []
---

## Context

The literal dotagents extension sources and their behavioral tests do not pass the generated package's Biome and anti-slop Oxlint baseline. Extraction intentionally preserves the source formatting and implementation rather than performing broad cleanup. Anti-slop does not apply to package infrastructure or infrastructure tests.

## Acceptance Criteria

- [x] Resolve Biome formatting, import-order diagnostics, and pre-existing unused declarations across `extensions/` without behavior changes.
- [ ] Scope anti-slop to `extensions/` production code and its behavioral tests, excluding package infrastructure such as `scripts/` and `test/package.test.ts`.
- [ ] Resolve current anti-slop diagnostics, including readability spacing, unsafe external-payload parsing, type-assertion safety comments, and array pipeline rules, without weakening rules.
- [ ] Preserve commands, session-entry formats, overlay behavior, editor behavior, and clipboard behavior.
- [ ] Run the focused anti-slop command and `npm run check:ci` successfully.

## Notes

Observed after literal source copy. The current Oxlint output has widespread `require-readable-spacing` failures and source-specific semantic-rule findings. This blocks release.

Biome formatting and the two pre-existing unused declarations were resolved as a mechanical checkpoint after the extraction; the behavior-sensitive local Oxlint work remains open.

On 2026-09-14 the lint boundary was clarified: anti-slop is for production code and its tests, not infrastructure. Todo 0004 was closed because its three findings were outside that boundary. A Copier v0.3 update made no changes because v0.3 makes `package.json` repository-owned after initial generation. This todo therefore owns restoring the intended Biome-only `check:ci` and adding a separate correctly scoped local anti-slop command. The template already generates a Biome-only `check:ci`, but its bare local `oxlint` invocation still needs separate upstream correction for future packages.

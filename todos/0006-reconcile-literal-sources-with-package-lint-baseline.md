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

The literal dotagents sources do not pass the generated package's Biome and anti-slop Oxlint baseline. Extraction intentionally preserves the source formatting and implementation rather than performing broad cleanup.

## Acceptance Criteria

- [x] Resolve Biome formatting, import-order diagnostics, and pre-existing unused declarations across `extensions/` without behavior changes.
- [ ] Resolve current anti-slop diagnostics, including readability spacing, unsafe external-payload parsing, type-assertion safety comments, and array pipeline rules, without weakening rules.
- [ ] Preserve commands, session-entry formats, overlay behavior, editor behavior, and clipboard behavior.
- [ ] Run `npm run check:ci` successfully.

## Notes

Observed after literal source copy. The current Oxlint output has widespread `require-readable-spacing` failures and source-specific semantic-rule findings. This blocks release.

Biome formatting and the two pre-existing unused declarations were resolved as a mechanical checkpoint after the extraction; the behavior-sensitive local Oxlint work remains open.

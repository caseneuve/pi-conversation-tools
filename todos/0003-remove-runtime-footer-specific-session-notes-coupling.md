---
title: remove runtime-footer-specific session-notes coupling
status: closed
priority: high
type: chore
labels: [release-blocker, coupling]
created: 2026-09-13
parent: null
blocked-by: []
blocks: []
---

## Context

`session-notes` publishes the stable Pi extension-status key `session-notes`. `pi-runtime-ui` currently has a dedicated `session-notes` runtime-footer block, renderer, default token, and alias handling despite its existing generic `status:<key>` support. This package now owns dim ANSI styling at the producer, so consumers must preserve it.

Resolution belongs in `pi-runtime-ui`; this todo tracks the cross-package release blocker for `pi-conversation-tools`.

## Acceptance Criteria

- [ ] Change runtime-footer integration to consume `status:session-notes` generically.
- [ ] Do not restyle producer-owned ANSI status text.
- [ ] Remove no-longer-needed session-notes-specific renderer, type, alias, and duplicate handling.
- [ ] Preserve agreed default placement behavior through configuration.
- [ ] Update `pi-runtime-ui` tests and documentation.
- [ ] Verify both the stock Pi footer and composed custom-footer behavior.

## Affected Files

- `~/git/pi/pi-runtime-ui/extensions/runtime-footer.ts`
- `~/git/pi/pi-runtime-ui/extensions/shared/runtime-footer-config.ts`
- `~/git/pi/pi-runtime-ui/test/`
- `~/git/pi/pi-runtime-ui/README.md`

## Notes

Reconciled during migration 0009 (2026-11-15): this is a stale blocker, not remaining implementation work. Read-only inspection of pi-runtime-ui at 38fb58ed6d2c70743430c7b51b57acef54874974 confirms generic `status:<key>` classification/rendering, no dedicated session-notes renderer, and tests for removed producer aliases plus ANSI preservation. No runtime-ui edits are authorized or needed here. Original checkboxes retain historical scope, not current failures.

Migration 0009 live evidence now also exercises actual read-only pi-runtime-ui at that SHA, filtered to its sole runtime-footer entry, with canonical sandbox config `status:session-notes`. Native local installs of both packages show note status create [0/1], toggle [1/1], reload persistence and delete/clear. Stock Pi and an independent generic test consumer were also exercised. Artifacts: `~/.cache/pi-migration/evidence/conversation-tools/runtime-composition-{note,status-done,reload,status-clear}.png` plus `runtime-state/`. The runtime-ui migration will revalidate its upgraded composition; no dedicated consumer is needed.

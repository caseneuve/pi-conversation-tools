---
title: remove runtime-footer-specific session-notes coupling
status: blocked
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

Do not release `pi-conversation-tools` while this is unresolved.

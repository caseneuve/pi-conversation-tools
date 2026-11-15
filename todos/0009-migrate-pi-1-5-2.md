---
title: migrate conversation tools to Pi 1.5.2 portable baseline
status: done
priority: high
type: chore
labels: [migration, pi-api, packaging]
created: 2026-11-15
parent: null
blocked-by: []
blocks: []
---

## Context

Approved autonomous conversation-tools-only migration from d7b7c0592dab (including dd4ffc2); master stays at 1a0cf75. Manually adopt relevant Copier baseline 08350707812e7036ab9477e879c1b029febd552b, not unrelated-history extraction work. No publication, remote creation, push, tag, merge, other repository edits or subagents.

## Acceptance Criteria

- [x] Exact Pi coding-agent/TUI 1.5.2 dev pins, host `*` peers, Node >=22.19.0; committed portable lockfile.
- [x] Portable Biome/typecheck/tests/coverage/pack and clean-clone/production lifecycle checks without per-package Oxlint/vendor requirements. Ignored local rules remain untouched.
- [x] Repository-owned app/tests/README/AGENTS preserved; instructions, native install/filter examples, Copier provenance and `.pi` ignores deliberately reconciled.
- [x] Actual compatibility fixes have regressions; public commands/shortcuts/custom-entry schemas, branch-relative state and outline command-export formats preserved.
- [x] Separate local TypeScript runner on enumerated changed owned JS/TS; record diagnostics and scope, not broad refactoring.
- [x] Reconcile stale runtime-footer coupling todo against existing generic status support; broad coverage epic and session-wide redesign remain outside scope.
- [x] Isolated HOME/config/session/scratch native personal and local installs; independently test both manifest entries/filters, project trust, real seeded-response outline navigation/selection/comment/export and comment resume, note create/edit/export/delete, branch/session persistence, reload/restart. Disclose seeded fixture and deterministic editor substitute; no credential/config reuse or model-proof claim.
- [x] Save exact commands/commit/diffs and PASS/FAIL/BLOCKED scenarios under `~/.cache/pi-migration/evidence/conversation-tools/`; coordinate screenshots safely with t16; request independent review before approval/merge.

## Design decisions and evidence

- Manual adoption avoids re-rendering application seeds. Copier baseline makes resources/tests/metadata/README/changelog/AGENTS copy-only; shared tooling remains reviewed opt-in. Per lead clarification, retain actual Copier generation/update `_commit: v0.3.0`; the adopted template SHA is local/unpublished and remote Copier resolution was not validated. The API answer is updated deliberately for future work; no Copier update was run.
- Existing notes reconstruct from `getBranch()`; preserve that behavior. Todo 0002 requests a separate session-wide redesign and is not implemented here.
- Read baseline review and live contract; installed Pi 1.5.2 package/extension/UI/settings/session/CLI docs and relevant examples/source before extension changes.
- Narrow fixes: picker accepts base ExtensionContext (no command-only methods used); explicit overlay/result types; comment snapshot field validation; TUI-only guards use ctx.mode, not RPC-capable hasUI; failed/signalled editor processes cannot report saves. Regression tests captured three runtime failures before fixes and pin the two distinct command-export formats.
- Actual live input exposed enhanced-key compatibility failures: Shift+E arrives as Kitty CSI `101;2u`, not literal `E`; similarly Shift+G. Minimal matchesKey repairs preserve legacy byte input and command semantics. Direct input-routing regressions cover both encodings; SessionNotesComponent is named-exported only as a test seam, with no command/schema changes.
- Reviewer noted upstream Pi 1.5.2 intentionally does not flush notes-only sessions before a user/assistant message. Documented that persistence caveat, without redesigning host session storage.
- Separate runner at 9621e6adc6772cd12acea856ac79679830b55535 remains failing on inherited findings. Exact eight-path baseline comparison: d7b7c05 has 296 findings (added test represented by an explicitly empty baseline fixture); initial candidate had 307 = 288 identical rule+code findings + 19 introduced - 8 removed. Narrow follow-up adds genuine persisted-data predicates and fixes introduced spacing; final has 288 identical inherited findings, zero additions, 8 removals. No rule suppression or broad cleanup. Full logs/comparisons are retained.
- Live UI uses known seeded assistant messages, not real model output. External editor is a controlled test-owned process, not a human editor test.
- Immutable remote Git install is a later reviewed release gate; no remote creation or push authorized here.

## Results

Implementation checkpoints: 9d12167 (portable baseline), 1f6eb88 (API/editor/comment fixes), 9c008bd (enhanced-key regressions and fixes, provenance correction). Initial planning commit was blocked by the stale Prek → package Oxlint gate; the approved portable gate removed that coupling without touching ignored vendor files.

At 9c008bd: clean temp checkout `npm ci`, verify (16 tests), V8 coverage and pack pass; production `npm ci --omit=dev --omit=peer` skips absent Prek safely. Pack contains 17 intended files. Coverage is 36.4% statements / 23.66% branches / 43.75% functions / 38.83% lines; no broad coverage-epic completion claim. npm reports five development-tree transitive advisories (3 moderate, 2 high); no audit-fix sweep was performed.

Separate changed-file runner still exits 1 with 288 inherited rule+source-code findings; baseline comparison proves zero introduced findings after narrow boundary/spacing follow-up. Exact eight-file scope and baseline/candidate diagnostics are retained in `local-typescript-baseline-comparison-final.json`. This is disclosed failing local evidence, not a portable-check failure or a claim of anti-slop compliance.

Actual isolated native personal outline-only and project-local notes-only installs pass functional checks, including controlled-editor comment/notes changes, section/discussion and executable-command exports, disk restart, reload, branch-relative restoration, new/resume, editor failure without saves, and stock status. Known assistant messages are explicitly seeded fixtures, not provider output. Actual read-only runtime-ui 38fb58ed sole-footer composition passes status create/toggle/reload/clear; narrow overlays also render in the isolated app. No host display/auth/config was exposed. Early mistimed picker/all-command probes are explicitly superseded in the evidence index.

Follow-ups: f0618d7 validates persisted comment data without new local-policy findings. The ignore correction uses root-anchored `!/.pi/` so shared root docs remain trackable under synthetic global `**/.pi` ignores without reopening nested `.pi` directories. Actual Git regressions pass with empty and synthetic global config; root settings/MCP/state remain ignored, and nested `.pi/settings.json` stays globally ignored. The intermediate unanchored e8989da pattern failed that nested regression and is superseded. A fresh isolated Xvfb rerun with read-only xclip verifies actual outline `y` copies the exact bare selected command plus newline; no host clipboard/display exposure.

Evidence and exact commands: `~/.cache/pi-migration/evidence/conversation-tools/handoff.md`, `live-commands.jsonl`, `artifact-assertions.json`, screenshots and sanitized session/config snapshots. Independent reviewer conversation-review approved the compatibility/local migration, with final ignore/todo metadata review requested. Compatibility/local acceptance is fulfilled; per lead direction this task is done. Publication, immutable remote Git verification and user cutover remain outside this task and separately gated. Existing coverage/session-wide/readability todos remain unchanged. No merge/push/tag/cutover authorized to this implementer.

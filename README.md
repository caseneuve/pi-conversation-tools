# pi-conversation-tools

Conversation navigation and transient session-note tools for [Pi](https://pi.dev).

## Resources

- `assistant-outline` — `/assistant-outline`, `Alt+O`: browse the latest completed assistant response as a Markdown heading tree, comment on sections, export marked sections, and extract shell-command snippets.
- `session-notes` — `/session-notes`, `Alt+N`: create transient per-session notes outside LLM context, manage them in an overlay, and insert marked notes into the editor.

Both extensions may be filtered independently through Pi package settings:

```json
{
  "packages": [{
    "source": "git:github.com/caseneuve/pi-conversation-tools@<reviewed-tag-or-commit-sha>",
    "extensions": ["extensions/assistant-outline/index.ts"]
  }]
}
```

Use `"extensions": ["extensions/session-notes.ts"]` for notes only, omit `extensions` to load both, or use `[]` to disable both. Filters narrow the explicit manifest; helper modules are not separate extension entries.

## Install

Requires Node >=22.19.0; development targets Pi 1.5.2 with exact API pins and host-provided `*` peers.

Install a reviewed local checkout natively:

```bash
pi install /absolute/path/to/pi-conversation-tools     # personal
pi install -l /absolute/path/to/pi-conversation-tools  # current project
```

Local directories load in place; Pi does not install their dependencies. Run `npm ci` in the checkout separately for development. Project packages require trust; review project configuration before using `pi install -l --approve /absolute/path/to/pi-conversation-tools` if installation refuses an untrusted project.

For normal use, install a reviewed immutable ref:

```bash
pi install git:github.com/caseneuve/pi-conversation-tools@<reviewed-tag-or-commit-sha>
```

## assistant-outline

`/assistant-outline` opens the latest completed assistant response from the current branch. Pass `pick` to select an assistant response from the session tree. It parses ATX headings, ignores headings inside fenced code, supports outline and command modes, and keeps section comments in `custom` session entries with custom type `assistant-outline-comments`.

Keybindings: `↑/↓` or `j/k` move; `←/→` or `h/l` collapse/expand; `tab` folds; `enter` toggles preview; `m` marks; `e` edits a section or selected command; `E` edits all commands; `y` copies a command; `c` switches modes; `r` reloads; `t` changes split layout; `q`/`esc` exports marked content.

Command clipboard fallback tries Linux `wl-copy`, then `xclip -selection clipboard`, then macOS `pbcopy`.

## session-notes

`/session-notes <text>` creates a quick TODO note. With no text, `/session-notes` or `Alt+N` opens the notes overlay. Use `a` to add, `e` to edit, `x` to delete marked notes, `m` to mark, `s` to toggle TODO/DONE, `t` to change layout, `enter`/`tab` to change focus, and `q`/`esc` to insert marked notes.

Notes currently follow the active conversation branch: `/tree` restores that branch’s latest snapshot, and resume/reload restores the selected branch. Fork/clone may inherit copied snapshots. Session-wide behavior is a separate proposal in todo 0002, not part of this migration.

Pi 1.5.2 writes a new session file only once it contains a user or assistant message. Notes created before any conversation remain in memory until then; do not rely on notes-only sessions surviving process exit.

Snapshots use `custom` session entries with custom type `session-notes`; this identity is preserved for existing sessions. The extension publishes the stable `session-notes` extension-status key. Its dim ANSI styling is producer-owned, so custom footer consumers should render `footerData.getExtensionStatuses().get("session-notes")` without restyling it.

## External editor and platform support

Both extensions invoke `$VISUAL`, falling back to `$EDITOR`, with a temporary file. Their command parsing is intentionally simple and preserves current Linux/macOS assumptions; it does not add Windows support. Assistant-outline clipboard support requires one of `wl-copy`, `xclip`, or `pbcopy`.

## Development and verification

```bash
npm ci
npm run check:ci
npm run typecheck
npm test
npm run test:coverage
npm run pack:check
```

Manual parity checks: start Pi with each resource independently enabled, reload it, exercise both commands and shortcuts, test narrow overlays, external-editor flows, command clipboard fallback, marked exports, and session resume compatibility. Verify local-path installation in an isolated `PI_CODING_AGENT_DIR`. After a reviewed immutable ref exists, verify its Git installation in a separate isolated configuration.

`check:ci` is non-mutating Biome; `check` and the Prek development hook may apply safe fixes. Extra local anti-slop checks are a separate author workflow, not a vendored dependency or portable CI requirement.

## Ownership and updates

Application code, tests, metadata/lockfile, README, changelog and AGENTS are repository-owned copy-only seeds. This migration manually adopts Copier baseline `08350707812e7036ab9477e879c1b029febd552b`; shared tooling updates remain opt-in and reviewed. Metadata and instruction changes are manual; resource answers are not an update-time resource manager.

`pi update` updates Pi itself; `pi update --extensions` reconciles installed packages, not Copier or local checkout dependencies. Local `.pi/*` settings/state are ignored; deliberately shared `.pi/docs/` may be tracked. Git ignores are separate from the npm `files` allowlist.

## Release gates

Unfinished testing/readability work remains tracked in todos 0006 and 0008; this migration does not complete that coverage epic. Generic `status:session-notes` consumption already exists in runtime-ui (see reconciled todo 0003). Immutable Git installation and independent live/screenshot review remain required before release.

## License

[MIT](LICENSE), Copyright (c) 2026 Caseneuve.

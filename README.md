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
    "extensions": ["assistant-outline"]
  }]
}
```

Use `"extensions": ["session-notes"]` for notes only, or omit `extensions` to load both.

## Install

During development:

```bash
pi install ~/git/pi/pi-conversation-tools
```

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

## Release blockers

Do not release while `todos/0003-remove-runtime-footer-specific-session-notes-coupling.md` or `todos/0004-resolve-template-anti-slop-readability-violations.md` remains unresolved.

## License

[MIT](LICENSE), Copyright (c) 2026 Caseneuve.
